package main

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/stripe/stripe-go"

	"github.com/amborle/featmap/migrations"
	"github.com/amborle/featmap/webapp"
	assetfs "github.com/elazarl/go-bindata-assetfs"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	bindata "github.com/golang-migrate/migrate/v4/source/go_bindata"
	_ "modernc.org/sqlite"
	//_ "github.com/mattn/go-sqlite3"
)

// Configuration ...
type Configuration struct {
	Environment         string
	Mode                string
	AppSiteURL          string
	DbHost              string
	DbPort              string
	DbType              string
	DbUser              string
	DbPass              string
	DbName              string
	DbConnectionString  string
	JWTSecret           string
	Port                string
	EmailFrom           string
	SMTPServer          string
	SMTPPort            string
	SMTPUser            string
	SMTPPass            string
	StripeKey           string
	StripeWebhookSecret string
	StripeBasicPlan     string
	StripeProPlan       string
}

var config Configuration

func getEnv(key, fallback string) string {
	value := viper.GetString(key)
	if value != "" {
		return value
	}

	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}

func getConfig() (Configuration, error) {
	viper.SetConfigFile(".env")
	err := viper.ReadInConfig()
	if err != nil {
		log.Print("CONF: ")
		log.Println(err)
		log.Println("CONF: try loading config via environment ...")
	}

	cfg := Configuration{}
	cfg.Environment = getEnv("ENV", "development")
	cfg.Mode = getEnv("MODE", "")
	cfg.AppSiteURL = getEnv("APP_SITE_URL", "https://localhost:5000")
	cfg.DbType = getEnv("DB_TYPE", "postgres")
	cfg.DbHost = getEnv("DB_HOST", "postgres")
	cfg.DbPort = getEnv("DB_PORT", "5432")
	cfg.DbName = getEnv("DB_NAME", "featmap")
	cfg.DbUser = getEnv("DB_USER", "featmap")
	cfg.DbPass = getEnv("DB_PASS", "featmap")
	//config.DbConnectionString = getEnv("DB_CONN_STRING", "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable")
	cfg.DbConnectionString = getEnv("DB_CONN_STRING", "")

	if cfg.DbConnectionString == "" {
		switch cfg.DbType {
		case "postgres":
			cfg.DbConnectionString = "postgresql://" + cfg.DbUser + ":" + cfg.DbPass + "@" + cfg.DbHost + ":" + cfg.DbPort + "/" + cfg.DbName + "?sslmode=disable"
			break
		case "sqlite":
			pwd, err := os.Getwd()
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}
			cfg.DbConnectionString = fmt.Sprintf("%s.sqlite", filepath.Join(pwd, cfg.DbName))
			break
		default:
			return Configuration{}, errors.New("CONF: can not run without database")
		}
	}

	cfg.JWTSecret = getEnv("JWT_SECRET", "ChangeMeForProduction")
	cfg.Port = getEnv("PORT", "5000")
	cfg.EmailFrom = getEnv("EMAIL_FROM", "noreply@example.com")
	cfg.SMTPServer = getEnv("SMTP_HOST", "")
	cfg.SMTPPort = getEnv("SMTP_PORT", "587")
	cfg.SMTPUser = getEnv("SMTP_USER", "")
	cfg.SMTPPass = getEnv("SMTP_PASS", "")

	cfg.StripeKey = getEnv("STRIPE_KEY", "")
	cfg.StripeWebhookSecret = getEnv("STRIPE_WH_SECRET", "")
	cfg.StripeBasicPlan = getEnv("STRIPE_BASIC_PLAN", "")
	cfg.StripeProPlan = getEnv("STRIPE_PRO_PLAN", "")

	return cfg, nil
}

func main() {

	r := chi.NewRouter()

	// A good base middleware stack
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	// r.Use(middleware.SetHeader("Content-Type", "application/json"))

	var err error
	config, err = getConfig()
	if err != nil {
		log.Fatalln(err)
	}

	// CORS
	corsConfiguration := cors.New(cors.Options{
		AllowedOrigins:   []string{config.AppSiteURL, "http://localhost:3000"}, // localhost is for development work
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "Workspace", "X-CSRF-Token"},
		ExposedHeaders:   []string{""},
		AllowCredentials: true,
		MaxAge:           300,
	})

	r.Use(corsConfiguration.Handler)

	db, err := sqlx.Connect(config.DbType, config.DbConnectionString)
	if err != nil {
		log.Fatalln("database error:" + err.Error())
	}

	defer func() {
		if err := db.Close(); err != nil {
			log.Fatalln(err)
		}
	}()

	// Apply migrations
	s := bindata.Resource(migrations.AssetNames(),
		func(name string) ([]byte, error) {
			return migrations.Asset(name)
		})

	d, err := bindata.WithInstance(s)
	if err != nil {
		log.Fatalln(err)
	}

	m, err := migrate.NewWithSourceInstance("go-bindata", d, config.DbConnectionString)
	if err != nil {
		log.Fatalln(err)
	}

	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		log.Fatalln(err)
	}

	// Create JWTAuth object
	auth := jwtauth.New("HS256", []byte(config.JWTSecret), nil)

	r.Use(jwtauth.Verifier(auth))
	r.Use(ContextSkeleton(config))

	r.Use(Transaction(db))
	r.Use(Auth(auth))

	r.Use(User())

	stripe.Key = config.StripeKey

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	r.Route("/v1/users", usersAPI)               // Nothing is needed
	r.Route("/v1/link", linkAPI)                 // Nothing is needed
	r.Route("/v1/subscription", subscriptionAPI) // Nothing is needed

	r.Route("/v1/account", accountAPI) // Account needed
	r.Route("/v1/", workspaceAPI)      // Account + workspace is needed

	files := &assetfs.AssetFS{
		Asset:    webapp.Asset,
		AssetDir: webapp.AssetDir,
		Prefix:   "webapp/build/static",
	}

	fileServer(r, "/static", files)

	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		index, _ := webapp.Asset("webapp/build/index.html")
		http.ServeContent(w, r, "index.html", time.Now(), strings.NewReader(string(index)))
	})

	fmt.Println("Serving on port " + config.Port)
	err = http.ListenAndServe(":"+config.Port, r)
	if err != nil {
		log.Fatalln(err)
	}

}

func fileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	fs := http.StripPrefix(path, http.FileServer(root))

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	}))
}

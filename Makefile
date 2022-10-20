.PHONY: run

BINDATA=$(shell which go-bindata)

run: assets webapp
ifneq ("$(wildcard $(conf.json))","conf.json")
	@echo "config file does not exist, using sample" && cp $(PWD)/config/conf.json $(PWD)/conf.json
endif
	@echo "starting app" && \
	go run .

.PHONY: tools-install assets webapp build run
tools-install:
ifndef BINDATA
	@echo "installing go-bindata"
	@go install -a -v github.com/go-bindata/go-bindata/...@latest
endif

assets: tools-install
	@echo "binary packing migrations" && \
	go-bindata  -pkg migrations -o ./migrations/bindata.go  ./migrations/
	@echo "binary packing templates" && \
	go-bindata  -pkg tmpl -o ./tmpl/bindata.go  ./tmpl/

webapp-build:
	@echo "building webapp"
	docker run --rm -it -v $(PWD)/webapp/:/projects -w /projects node:16 npm ci
	docker run --rm -it -v $(PWD)/webapp/:/projects -w /projects node:16 npm run build

webapp: tools-install
#ifneq ("$(wildcard $(./webapp/build))","")
#echo "build dir exists, continuing "
#else
#echo "build dir does not exist, exiting" && exit 1
#endif
	@echo "binary packing webapp" && \
    go-bindata  -pkg webapp -o ./webapp/bindata.go  ./webapp/build/...

build:
	@echo "building main app" && \
	go build .

container:
	docker build -t mhenselin/featmap:dev .

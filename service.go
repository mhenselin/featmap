package main

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/amborle/featmap/lexorank"
	"github.com/asaskevich/govalidator"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-chi/jwtauth"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	uuid "github.com/satori/go.uuid"
	stripe "github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/customer"
	"golang.org/x/crypto/bcrypt"
)

// Service ...
type Service interface {
	// Technical

	SetConfig(x Configuration)
	SetAccountObject(a *Account)
	SetMemberObject(m *Member)
	SetRepoObject(m Repository)
	SetAuth(x *jwtauth.JWTAuth)
	SetWorkspaceObject(a *Workspace)
	SetSubscriptionObject(x *Subscription)
	UpdateLatestActivityNow()

	GetConfig() Configuration
	GetDBObject() *sqlx.DB
	GetRepoObject() Repository
	GetMemberObject() *Member
	GetAccountObject() *Account
	GetWorkspaceObject() *Workspace
	GetSubscriptionObject() *Subscription

	SendEmail(smtpServer string, smtpPort string, smtpUser string, smtpPass string, from string, recipient string, subject string, body string) error

	Register(workspaceName string, name string, email string, password string) (*Workspace, *Account, *Member, error)
	Login(email string, password string) (*Account, error)
	Token(accountID string) string
	DeleteAccount() error

	CreateWorkspace(name string) (*Workspace, *Subscription, *Member, error)
	GetWorkspace(id string) (*Workspace, error)
	GetWorkspaceByContext() *Workspace
	GetWorkspaces() []*Workspace
	GetAccount(accountID string) (*Account, error)
	GetAccountsByWorkspace() []*Account
	DeleteWorkspace() error

	StripeWebhook(r *http.Request) error
	GetSubscriptionPlanSession(plan string, quantity int64) (string, error)
	GetSubscriptionByWorkspace(id string) *Subscription
	GetSubscriptionsByAccount() []*Subscription

	ChangeSubscription(plan string, quantity int64) error

	ConfirmEmail(key string) error
	UpdateEmail(email string) error
	UpdateName(name string) error
	ResendEmail() error
	SendResetEmail(email string) error
	SetPassword(password string, key string) error

	GetMember(accountID string, workspaceID string) (*Member, error)
	GetMembersByAccount() []*Member
	GetMembers() []*Member
	GetMembersByWorkspace(id string) []*Member
	UpdateMemberLevel(memberID string, level string) (*Member, error)
	DeleteMember(memberID string) error
	CreateMember(workspaceID string, accountID string, level string) (*Member, error)
	Leave() error

	ChangeAllowExternalSharing(value bool) error
	ChangeGeneralInfo(EUVAT string, externalBillingEmail string) error

	GetInvitesByWorkspace() []*Invite
	CreateInvite(email string, level string) (*Invite, error)
	SendInvitationMail(invitationID string) error
	DeleteInvite(invitationID string) error
	AcceptInvite(code string) error
	GetInvite(code string) (*Invite, error)

	GetProjectByExternalLink(link string) (*Project, error)
	GetProjectExtendedByExternalLink(link string) (*projectResponse, error)
	GetProject(id string) *Project
	CreateProjectWithID(id string, title string) (*Project, error)
	RenameProject(id string, title string) (*Project, error)
	DeleteProject(id string) error
	GetProjects() []*Project
	UpdateProjectDescription(id string, d string) (*Project, error)

	CreateMilestoneWithID(id string, projectID string, title string) (*Milestone, error)
	MoveMilestone(id string, index int) (*Milestone, error)
	RenameMilestone(id string, title string) (*Milestone, error)
	GetMilestonesByProject(id string) []*Milestone
	DeleteMilestone(id string) error
	UpdateMilestoneDescription(id string, d string) (*Milestone, error)
	CloseMilestone(id string) (*Milestone, error)
	OpenMilestone(id string) (*Milestone, error)
	ChangeColorOnMilestone(id string, color string) (*Milestone, error)
	UpdateAnnotationsOnMilestone(id string, names string) (*Milestone, error)

	GetWorkflowsByProject(id string) []*Workflow
	MoveWorkflow(id string, index int) (*Workflow, error)
	CreateWorkflowWithID(id string, projectID string, title string) (*Workflow, error)
	RenameWorkflow(id string, title string) (*Workflow, error)
	DeleteWorkflow(id string) error
	UpdateWorkflowDescription(id string, d string) (*Workflow, error)
	ChangeColorOnWorkflow(id string, color string) (*Workflow, error)
	CloseWorkflow(id string) (*Workflow, error)
	OpenWorkflow(id string) (*Workflow, error)
	UpdateAnnotationsOnWorkflow(id string, names string) (*Workflow, error)

	CreateSubWorkflowWithID(id string, workflowID string, title string) (*SubWorkflow, error)
	MoveSubWorkflow(id string, toWorkflowID string, index int) (*SubWorkflow, error)
	GetSubWorkflowsByProject(id string) []*SubWorkflow
	RenameSubWorkflow(id string, title string) (*SubWorkflow, error)
	DeleteSubWorkflow(id string) error
	UpdateSubWorkflowDescription(id string, d string) (*SubWorkflow, error)
	ChangeColorOnSubWorkflow(id string, color string) (*SubWorkflow, error)
	CloseSubWorkflow(id string) (*SubWorkflow, error)
	OpenSubWorkflow(id string) (*SubWorkflow, error)
	UpdateAnnotationsOnSubWorkflow(id string, names string) (*SubWorkflow, error)

	GetFeaturesByProject(id string) []*Feature
	MoveFeature(id string, toMilestoneID string, toSubWorkflowID string, index int) (*Feature, error)
	CreateFeatureWithID(id string, subWorkflowID string, milestoneID string, title string) (*Feature, error)
	RenameFeature(id string, title string) (*Feature, error)
	DeleteFeature(id string) error
	UpdateFeatureDescription(id string, d string) (*Feature, error)
	CloseFeature(id string) (*Feature, error)
	OpenFeature(id string) (*Feature, error)
	ChangeColorOnFeature(id string, color string) (*Feature, error)
	UpdateAnnotationsOnFeature(id string, names string) (*Feature, error)
	UpdateEstimateOnFeature(id string, estimate int) (*Feature, error)

	GetFeatureCommentsByProject(id string) []*FeatureComment
	CreateFeatureCommentWithID(id string, featureID string, post string) (*FeatureComment, error)
	UpdateFeatureCommentPost(id string, post string) (*FeatureComment, error)
	DeleteFeatureComment(id string) error

	GetPersonasByProject(id string) []*Persona
	GetWorkflowPersonasByProject(id string) []*WorkflowPersona

	CreateWorkflowPersonaWithID(id string, workflowID string, personaID string) (*WorkflowPersona, error)
	DeleteWorkflowPersona(id string) error

	CreatePersonaWithID(id string, projectID string, avatar string, name string, role string, description string, workflowID string, workflowPersonaID string) (*Persona, error)
	DeletePersona(id string) error
	UpdatePersona(id string, avatar string, name string, role string, description string) (*Persona, error)
}

type service struct {
	config       Configuration
	Acc          *Account
	Member       *Member
	Subscription *Subscription
	r            Repository
	auth         *jwtauth.JWTAuth
	ws           *Workspace
}

// NewFeatmapService ...
func NewFeatmapService() Service {
	return &service{}
}

func (s *service) SetConfig(x Configuration) { s.config = x }

func (s *service) SetAccountObject(a *Account)           { s.Acc = a }
func (s *service) SetMemberObject(m *Member)             { s.Member = m }
func (s *service) SetRepoObject(m Repository)            { s.r = m }
func (s *service) SetAuth(x *jwtauth.JWTAuth)            { s.auth = x }
func (s *service) SetWorkspaceObject(a *Workspace)       { s.ws = a }
func (s *service) SetSubscriptionObject(x *Subscription) { s.Subscription = x }

func (s *service) GetConfig() Configuration             { return s.config }
func (s *service) GetDBObject() *sqlx.DB                { return s.r.DB() }
func (s *service) GetRepoObject() Repository            { return s.r }
func (s *service) GetAccountObject() *Account           { return s.Acc }
func (s *service) GetSubscriptionObject() *Subscription { return s.Subscription }
func (s *service) GetMemberObject() *Member             { return s.Member }
func (s *service) GetWorkspaceObject() *Workspace       { return s.ws }

func (s *service) UpdateLatestActivityNow() {
	acc := s.GetAccountObject()
	acc.LatestActivity = time.Now().UTC()
	s.r.StoreAccount(acc)
}

func (s *service) Register(workspaceName string, name string, email string, password string) (*Workspace, *Account, *Member, error) {

	workspaceName = govalidator.Trim(workspaceName, "")
	name = govalidator.Trim(name, "")
	email = strings.ToLower(govalidator.Trim(email, ""))

	if !govalidator.IsEmail(email) {
		return nil, nil, nil, errors.New("email_invalid")
	}

	if s.config.Environment == "test" && name != "test" {
		return nil, nil, nil, errors.New("workspace_invalid")
	}

	if !workspaceNameIsValid(workspaceName) {
		return nil, nil, nil, errors.New("workspace_invalid")
	}

	if len(name) < 1 || len(name) > 200 {
		return nil, nil, nil, errors.New("name_invalid")
	}

	if len(password) < 6 || len(password) > 200 {
		return nil, nil, nil, errors.New("password_invalid")
	}

	// First check if email is not already taken!
	dupacc, err := s.r.GetAccountByEmail(email)
	if dupacc != nil {
		return nil, nil, nil, errors.New("email_taken")
	}

	dupworkspace, err := s.r.GetWorkspaceByName(workspaceName)
	if dupworkspace != nil {
		return nil, nil, nil, errors.New("workspace_taken")
	}

	// Create all needed objects

	t := time.Now().UTC()

	workspace := &Workspace{
		ID:                   uuid.Must(uuid.NewV4(), nil).String(),
		Name:                 workspaceName,
		CreatedAt:            t,
		AllowExternalSharing: true,
		EUVAT:                "",
		ExternalBillingEmail: email,
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	acc := &Account{
		ID:                       uuid.Must(uuid.NewV4(), nil).String(),
		Name:                     name,
		Email:                    email,
		Password:                 string(hash),
		CreatedAt:                t,
		EmailConfirmationSentTo:  email,
		EmailConfirmed:           false,
		EmailConfirmationKey:     uuid.Must(uuid.NewV4(), nil).String(),
		EmailConfirmationPending: true,
		PasswordResetKey:         uuid.Must(uuid.NewV4(), nil).String(),
	}

	sub := &Subscription{
		ID:                 uuid.Must(uuid.NewV4(), nil).String(),
		WorkspaceID:        workspace.ID,
		Level:              "TRIAL",
		NumberOfEditors:    100,
		FromDate:           t,
		ExpirationDate:     t.AddDate(0, 0, 15),
		CreatedByName:      acc.Name,
		CreatedAt:          t,
		LastModified:       t,
		LastModifiedByName: acc.Name,
		Status:             "trialing",
	}

	if s.config.Mode != "hosted" {
		sub.Level = "BASIC"
		sub.NumberOfEditors = 1000
		sub.ExpirationDate = t.AddDate(1000, 0, 0)
		sub.Status = "active"
	}

	member := &Member{
		ID:          uuid.Must(uuid.NewV4(), nil).String(),
		WorkspaceID: workspace.ID,
		AccountID:   acc.ID,
		Level:       "OWNER",
		CreatedAt:   t,
	}

	s.r.StoreWorkspace(workspace)
	s.r.StoreAccount(acc)
	s.r.StoreSubscription(sub)
	s.r.StoreMember(member)

	s.SetWorkspaceObject(workspace)
	s.SetAccountObject(acc)
	s.SetSubscriptionObject(sub)
	s.SetMemberObject(member)

	body, err := WelcomeBody(welcome{s.config.AppSiteURL, acc.EmailConfirmationSentTo, workspace.Name, acc.EmailConfirmationKey})
	if err != nil {
		log.Println(err)
		return nil, nil, nil, err
	}

	err = s.SendEmail(s.config.SMTPServer, s.config.SMTPPort, s.config.SMTPUser, s.config.SMTPPass, s.config.EmailFrom, acc.EmailConfirmationSentTo, "Welcome to Featmap!", body)
	if err != nil {
		log.Println("error sending mail")
	}

	return workspace, acc, member, nil
}

func (s *service) DeleteAccount() error {
	members := s.GetMembersByAccount()

	for _, m := range members {
		if m.Level == "OWNER" {
			return errors.New("Cannot delete account if owner of workspace. ")
		}
	}
	s.r.DeleteAccount(s.Acc.ID)

	return nil
}

func (s *service) Login(email string, password string) (*Account, error) {

	acc, err := s.r.GetAccountByEmail(strings.ToLower(email))
	if acc == nil {
		return nil, errors.Wrap(err, "email not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(acc.Password), []byte(password)); err != nil {
		return nil, errors.Wrap(err, "password not correct")
	}

	return acc, nil
}

func (s *service) Token(accountID string) string {

	_, tokenString, _ := s.auth.Encode(jwt.MapClaims{"id": accountID})

	return tokenString
}

func (s *service) GetAccount(id string) (*Account, error) {

	acc, err := s.r.GetAccount(id)
	if acc == nil {
		return nil, errors.Wrap(err, "account not found")
	}
	return acc, nil
}

func (s *service) GetAccountsByWorkspace() []*Account {
	accounts, err := s.r.FindAccountsByWorkspace(s.Member.WorkspaceID)
	if err != nil {
		log.Println(err)
		return nil
	}
	return accounts
}

func (s *service) GetSubscriptionsByAccount() []*Subscription {
	subs, err := s.r.FindSubscriptionsByAccount(s.Acc.ID)
	if err != nil {
		return nil
	}
	return subs
}

func (s *service) GetSubscriptionByWorkspace(id string) *Subscription {
	subs, err := s.r.FindSubscriptionsByWorkspace(id)
	if err != nil {
		return nil
	}
	// Take the latest one, they come sorted from the db!
	return subs[0]
}

func workspaceNameIsValid(name string) bool {
	return !(len(name) < 2 || len(name) > 200 || !govalidator.IsAlphanumeric(name) || name == "account" || name == "link")
}

func (s *service) CreateWorkspace(name string) (*Workspace, *Subscription, *Member, error) {
	name = govalidator.Trim(name, "")

	if !workspaceNameIsValid(name) {
		return nil, nil, nil, errors.New("workspace_invalid")
	}

	dupworkspace, _ := s.r.GetWorkspaceByName(name)
	if dupworkspace != nil {
		return nil, nil, nil, errors.New("workspace_taken")
	}

	t := time.Now().UTC()
	workspace := &Workspace{
		ID:                   uuid.Must(uuid.NewV4(), nil).String(),
		Name:                 name,
		CreatedAt:            t,
		AllowExternalSharing: true,
		EUVAT:                "",
		ExternalBillingEmail: s.Acc.Email,
	}
	subscription := &Subscription{
		ID:                 uuid.Must(uuid.NewV4(), nil).String(),
		WorkspaceID:        workspace.ID,
		Level:              "TRIAL",
		NumberOfEditors:    100,
		FromDate:           t,
		ExpirationDate:     t.AddDate(0, 0, 15),
		CreatedByName:      s.Acc.Name,
		CreatedAt:          t,
		LastModified:       t,
		LastModifiedByName: s.Acc.Name,
		Status:             "trialing",
	}
	member := &Member{
		ID:          uuid.Must(uuid.NewV4(), nil).String(),
		WorkspaceID: workspace.ID,
		AccountID:   s.Acc.ID,
		Level:       "OWNER",
		CreatedAt:   t,
	}

	s.r.StoreWorkspace(workspace)
	s.r.StoreSubscription(subscription)
	s.r.StoreMember(member)

	return workspace, subscription, member, nil
}

func (s *service) GetWorkspace(id string) (*Workspace, error) {

	workspace, err := s.r.GetWorkspace(id)
	if err != nil {
		return nil, errors.Wrap(err, "workspace not found")
	}
	return workspace, nil
}

func (s *service) GetWorkspaceByContext() *Workspace {

	workspace, err := s.GetWorkspace(s.Member.WorkspaceID)
	if err != nil {
		log.Println(err)
	}
	return workspace
}

func (s *service) GetWorkspaces() []*Workspace {

	workspace, err := s.r.GetWorkspacesByAccount(s.Acc.ID)
	if err != nil {
		log.Println(err)
		return nil
	}
	return workspace
}

func (s *service) UpdateMemberLevel(memberID string, level string) (*Member, error) {

	if !levelIsValid(level) {
		return nil, errors.New("level invalid")
	}

	member, err := s.r.GetMember(s.Member.WorkspaceID, memberID)
	if err != nil {
		return nil, err
	}

	if member.ID == s.Member.ID {
		return nil, errors.New("not allowed to change own role")
	}

	if member.Level == "OWNER" && s.Member.Level == "ADMIN" {
		return nil, errors.New("not allowed to change role of owner")
	}

	if isEditor(level) {
		members := s.GetMembers()
		sub := s.GetSubscriptionByWorkspace(s.Member.WorkspaceID)

		n := 0
		for _, m := range members {
			if isEditor(m.Level) {
				n++
			}
		}

		if (!isEditor(member.Level)) && (n+1 > sub.NumberOfEditors) {
			return nil, errors.New("subscription exceeded - please contact the owner of the workspace")
		}

	}

	member.Level = level

	s.r.StoreMember(member)

	return member, nil
}

func (s *service) numberOfEditors() int {
	members := s.GetMembers()

	n := 0
	for _, m := range members {
		if isEditor(m.Level) {
			n++
		}
	}

	return n
}

func (s *service) DeleteMember(id string) error {

	member, err := s.r.GetMember(s.Member.WorkspaceID, id)
	if err != nil {
		return err
	}

	if member.ID == s.Member.ID && s.Member.Level == "OWNER" {
		return errors.New("owners not allowed to remove their own membership")
	}

	if member.Level == "OWNER" && s.Member.Level == "ADMIN" {
		return errors.New("admins not allowed to remove membership of owner ")
	}

	s.r.DeleteMember(s.Member.WorkspaceID, id)

	return nil
}

func isEditor(level string) bool {
	return level == "EDITOR" || level == "ADMIN" || level == "OWNER"
}

func (s *service) CreateMember(workspaceID string, accountID string, level string) (*Member, error) {
	sub := s.GetSubscriptionByWorkspace(workspaceID)

	if sub.Level == "NONE" {
		return nil, errors.New("cannot create member on workspace without plan")
	}

	if isEditor(level) {
		members := s.GetMembersByWorkspace(workspaceID)

		n := 0
		for _, m := range members {
			if isEditor(m.Level) {
				n++
			}
		}

		if n >= sub.NumberOfEditors {
			return nil, errors.New("subscription exceeded - please contact the owner of the workspace")
		}
	}

	// Store member
	member := &Member{
		ID:          uuid.Must(uuid.NewV4(), nil).String(),
		WorkspaceID: workspaceID,
		AccountID:   accountID,
		Level:       level,
		CreatedAt:   time.Now().UTC(),
	}

	s.r.StoreMember(member)

	return member, nil
}

func (s *service) GetMember(accountID string, workspaceID string) (*Member, error) {

	member, err := s.r.GetMemberByAccountAndWorkspace(accountID, workspaceID)
	if member == nil {
		return nil, errors.Wrap(err, "member not found")
	}
	return member, nil
}

func (s *service) GetMembersByAccount() []*Member {

	members, err := s.r.GetMembersByAccount(s.Acc.ID)
	if err != nil {
		log.Println(err)
		return nil
	}
	return members
}

func (s *service) GetMembers() []*Member {
	members, err := s.r.FindMembersByWorkspace(s.Member.WorkspaceID)
	if err != nil {
		log.Println(err)
		return nil
	}
	return members
}

func (s *service) GetMembersByWorkspace(id string) []*Member {
	members, err := s.r.FindMembersByWorkspace(id)
	if err != nil {
		return nil
	}
	return members
}

// SETTINGS

func (s *service) ChangeAllowExternalSharing(value bool) error {

	w := s.GetWorkspaceByContext()

	w.AllowExternalSharing = value

	s.r.StoreWorkspace(w)

	return nil
}

func (s *service) ChangeGeneralInfo(EUVAT string, externalBillingInfo string) error {

	w := s.GetWorkspaceByContext()

	if !govalidator.IsEmail(externalBillingInfo) {
		return errors.New("invalid email")
	}

	w.EUVAT = EUVAT
	w.ExternalBillingEmail = externalBillingInfo

	if len(w.ExternalCustomerID) > 0 {
		params := &stripe.CustomerParams{}
		params.Email = stripe.String(externalBillingInfo)
		_, err := customer.Update(w.ExternalCustomerID, params)
		if err != nil {
			return err
		}
	}

	s.r.StoreWorkspace(w)

	return nil
}

// INVITES

func (s *service) CreateInvite(email string, level string) (*Invite, error) {

	email = strings.ToLower(govalidator.Trim(email, ""))

	if !govalidator.IsEmail(email) {
		return nil, errors.New("email invalid")
	}

	if !levelIsValid(level) {
		return nil, errors.New("level invalid")
	}

	if s.Member.Level == "ADMIN" && level == "OWNER" {
		return nil, errors.New("admins are not allowed to appoint new owners")
	}

	member, _ := s.r.GetMemberByEmail(s.Member.WorkspaceID, email)

	if member != nil {
		return nil, errors.New("already member of the workspace")
	}

	m, _ := s.r.GetInviteByEmail(s.Member.WorkspaceID, email)
	if m != nil {
		return nil, errors.New("email already has a pending invite")
	}

	ws, err := s.r.GetWorkspace(s.Member.WorkspaceID)
	if err != nil {
		return nil, err
	}

	x := &Invite{
		WorkspaceID:    s.Member.WorkspaceID,
		ID:             uuid.Must(uuid.NewV4(), nil).String(),
		Email:          email,
		Level:          level,
		Code:           uuid.Must(uuid.NewV4(), nil).String(),
		CreatedBy:      s.Member.ID,
		CreatedByName:  s.Acc.Name,
		CreatedAt:      time.Now().UTC(),
		CreatedByEmail: s.Acc.Email,
		WorkspaceName:  ws.Name,
	}

	s.r.StoreInvite(x)

	if err := s.SendInvitationMail(x.ID); err != nil {
		return nil, err
	}

	return x, nil
}

func (s *service) SendInvitationMail(invitationID string) error {

	ws, err := s.r.GetWorkspace(s.Member.WorkspaceID)
	if err != nil {
		return err
	}

	invite, err := s.r.GetInvite(s.Member.WorkspaceID, invitationID)
	if err != nil {
		return err
	}

	i := InviteStruct{
		AppSiteURL:     s.config.AppSiteURL,
		WorkspaceName:  ws.Name,
		Email:          invite.Email,
		Code:           invite.Code,
		InvitedBy:      invite.CreatedByName,
		InvitedByEmail: invite.CreatedByEmail,
	}

	body, err := inviteBody(i)
	if err != nil {
		return err
	}

	err = s.SendEmail(s.config.SMTPServer, s.config.SMTPPort, s.config.SMTPUser, s.config.SMTPPass, s.config.EmailFrom, invite.Email, "Featmap: invitation to join a workspace", body)
	if err != nil {
		log.Println("error sending mail")
	}

	return nil
}

func (s *service) DeleteInvite(id string) error {
	m, err := s.r.GetInvite(s.Member.WorkspaceID, id)
	if err != nil {
		return err
	}

	if s.Member.Level == "ADMIN" && m.Level == "OWNER" {
		return errors.New("admins are not allowed to cancel invite to owner")
	}

	s.r.DeleteInvite(s.Member.WorkspaceID, id)

	return nil
}

func (s *service) Leave() error {

	if s.Member.Level == "OWNER" {
		return errors.New("owners cannot not themselves leave a workspace")
	}

	s.r.DeleteMember(s.Member.WorkspaceID, s.Member.ID)

	return nil
}

func (s *service) DeleteWorkspace() error {
	s.r.DeleteWorkspace(s.Member.WorkspaceID)
	return nil
}

func (s *service) GetInvitesByWorkspace() []*Invite {
	invites, err := s.r.FindInvitesByWorkspace(s.Member.WorkspaceID)
	if err != nil {
		log.Println(err)
		return nil
	}
	return invites
}

func (s *service) AcceptInvite(code string) error {
	invite, err := s.r.GetInviteByCode(code)

	if err != nil {
		return errors.New("invite not found")
	}

	acc, err := s.r.GetAccountByEmail(invite.Email)
	if err != nil {
		return errors.New("Please create an account first  (using " + invite.Email + ") and then accept again.")
	}

	if _, err := s.CreateMember(invite.WorkspaceID, acc.ID, invite.Level); err != nil {
		return err
	}

	s.r.DeleteInvite(invite.WorkspaceID, invite.ID)

	return nil
}

func (s *service) GetInvite(code string) (*Invite, error) {
	invite, err := s.r.GetInviteByCode(code)

	if err != nil {
		return nil, err
	}

	return invite, nil
}

// const datelayout = "2006-01-02"

// Projects

func (s *service) GetProject(id string) *Project {
	pp, err := s.r.GetProject(s.Member.WorkspaceID, id)
	if err != nil {
		log.Println(err)
	}
	return pp
}

func (s *service) GetProjectByExternalLink(link string) (*Project, error) {
	return s.r.GetProjectByExternalLink(link)

}

func (s *service) GetProjectExtendedByExternalLink(link string) (*projectResponse, error) {
	project, err := s.r.GetProjectByExternalLink(link)
	if err != nil {
		return nil, err
	}

	milestones, err := s.r.FindMilestonesByProject(project.WorkspaceID, project.ID)
	if err != nil {
		return nil, err
	}
	workflows, err := s.r.FindWorkflowsByProject(project.WorkspaceID, project.ID)
	if err != nil {
		return nil, err
	}
	subworkflows, err := s.r.FindSubWorkflowsByProject(project.WorkspaceID, project.ID)
	if err != nil {
		return nil, err
	}
	features, err := s.r.FindFeaturesByProject(project.WorkspaceID, project.ID)
	if err != nil {
		return nil, err
	}

	featureComments, err := s.r.FindFeatureCommentsByProject(project.WorkspaceID, project.ID)
	if err != nil {
		return nil, err
	}

	personas, err := s.r.FindPersonasByProject(project.WorkspaceID, project.ID)
	if err != nil {
		return nil, err
	}

	workflowPersonas, err := s.r.FindWorkflowPersonasByProject(project.WorkspaceID, project.ID)
	if err != nil {
		return nil, err
	}

	resp := &projectResponse{
		Project:          project,
		Milestones:       milestones,
		Workflows:        workflows,
		SubWorkflows:     subworkflows,
		Features:         features,
		FeatureComments:  featureComments,
		Personas:         personas,
		WorkflowPersonas: workflowPersonas,
	}

	return resp, nil
}

func (s *service) CreateProjectWithID(id string, title string) (*Project, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	pp, _ := s.r.GetProject(s.Member.WorkspaceID, id)
	if pp != nil {
		return nil, errors.New("already exist")
	}

	p := &Project{
		WorkspaceID:   s.Member.WorkspaceID,
		ID:            id,
		Title:         title,
		CreatedAt:     time.Now().UTC(),
		CreatedByName: s.Acc.Name,
		ExternalLink:  uuid.Must(uuid.NewV4(), nil).String(),
	}

	p.LastModified = time.Now().UTC()
	p.LastModifiedByName = s.Acc.Name

	s.r.StoreProject(p)

	return p, nil
}

func (s *service) LoadSampleCards(pid string) error {
	// wsid := s.Member.WorkspaceID
	// accid := s.Acc.ID
	// t := time.UTC()

	// milestone1 := &Milestone{WorkspaceID: wsid, ProjectID: pid, ID: newUIID(), Title: "Proof-of-concept", Status: "OPEN",  }
	return nil
}

func (s *service) RenameProject(id string, title string) (*Project, error) {
	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	p, err := s.r.GetProject(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	p.Title = title
	p.LastModified = time.Now().UTC()
	p.LastModifiedByName = s.Acc.Name
	s.r.StoreProject(p)
	return p, nil
}

func (s *service) UpdateProjectDescription(id string, d string) (*Project, error) {
	x, err := s.r.GetProject(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	x.Description = d
	x.LastModified = time.Now().UTC()
	x.LastModifiedByName = s.Acc.Name
	s.r.StoreProject(x)

	return x, nil
}

func (s *service) DeleteProject(id string) error {
	s.r.DeleteProject(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) GetProjects() []*Project {
	pp, err := s.r.FindProjectsByWorkspace(s.Member.WorkspaceID)
	if err != nil {
		log.Println(err)
	}
	return pp
}

// Milestones

func (s *service) CreateMilestoneWithID(id string, projectID string, title string) (*Milestone, error) {
	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	a, _ := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if a != nil {
		return nil, errors.New("already exists")
	}

	mm, _ := s.r.FindMilestonesByProject(s.Member.WorkspaceID, projectID)

	p := &Milestone{
		WorkspaceID:   s.Member.WorkspaceID,
		ProjectID:     projectID,
		ID:            id,
		Title:         title,
		Status:        "OPEN",
		Rank:          "",
		CreatedAt:     time.Now().UTC(),
		CreatedByName: s.Acc.Name,
		Color:         "WHITE",
	}

	n := len(mm)
	if n == 0 {
		rank, _ := lexorank.Rank("", "")
		p.Rank = rank
	} else {
		rank, _ := lexorank.Rank(mm[n-1].Rank, "")
		p.Rank = rank
	}

	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()
	s.r.StoreMilestone(p)

	return p, nil
}

func (s *service) MoveMilestone(id string, index int) (*Milestone, error) {

	if index < 0 || index > 1000 {
		return nil, errors.New("index invalid")
	}

	m, err := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	mm, _ := s.r.FindMilestonesByProject(s.Member.WorkspaceID, m.ProjectID)

	// Remove the item we are moving
	mmf := []*Milestone{}
	for _, x := range mm {
		if x.ID != id {
			mmf = append(mmf, x)
		}
	}

	var prevRank, nextRank string
	length := len(mmf)

	if length != 0 {
		if (index - 1) >= 0 {
			prevRank = mmf[index-1].Rank
		}

		if index < length {
			nextRank = mmf[index].Rank
		}
	}

	rank, _ := lexorank.Rank(prevRank, nextRank)

	m.Rank = rank
	m.LastModifiedByName = s.Acc.Name
	m.LastModified = time.Now().UTC()

	s.r.StoreMilestone(m)

	return m, nil
}

func (s *service) RenameMilestone(id string, title string) (*Milestone, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	p, err := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	p.Title = title
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreMilestone(p)

	return p, nil
}

func (s *service) DeleteMilestone(id string) error {
	s.r.DeleteMilestone(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) GetMilestonesByProject(id string) []*Milestone {
	pp, err := s.r.FindMilestonesByProject(s.Member.WorkspaceID, id)
	if err != nil {
		log.Println(err)
	}
	return pp
}

func (s *service) UpdateMilestoneDescription(id string, d string) (*Milestone, error) {
	x, err := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	x.Description = d
	x.LastModified = time.Now().UTC()
	x.LastModifiedByName = s.Acc.Name
	s.r.StoreMilestone(x)

	return x, nil
}

func (s *service) CloseMilestone(id string) (*Milestone, error) {
	p, err := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "CLOSED"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreMilestone(p)

	return p, nil
}

func (s *service) OpenMilestone(id string) (*Milestone, error) {
	p, err := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "OPEN"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreMilestone(p)

	return p, nil
}

func (s *service) ChangeColorOnMilestone(id string, color string) (*Milestone, error) {

	if !colorIsValid(color) {
		return nil, errors.New("invalid color")
	}

	p, err := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Color = color
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreMilestone(p)

	return p, nil
}

func (s *service) UpdateAnnotationsOnMilestone(id string, names string) (*Milestone, error) {

	f, err := s.r.GetMilestone(s.Member.WorkspaceID, id)
	if f == nil {
		return nil, err
	}

	if !areAnnotationsValid(names) {
		return nil, errors.New("invalid annotation")
	}

	f.Annotations = names
	f.LastModifiedByName = s.Acc.Name
	f.LastModified = time.Now().UTC()

	s.r.StoreMilestone(f)

	return f, nil
}

// Workflow

func (s *service) CreateWorkflowWithID(id string, projectID string, title string) (*Workflow, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	a, _ := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if a != nil {
		return nil, errors.New("already exists")
	}

	ww, _ := s.r.FindWorkflowsByProject(s.Member.WorkspaceID, projectID)

	p := &Workflow{
		WorkspaceID:   s.Member.WorkspaceID,
		ProjectID:     projectID,
		ID:            id,
		Title:         title,
		Rank:          "",
		CreatedAt:     time.Now().UTC(),
		CreatedByName: s.Acc.Name,
		Color:         "WHITE",
		Status:        "OPEN",
	}

	n := len(ww)
	if n == 0 {
		rank, _ := lexorank.Rank("", "")
		p.Rank = rank
	} else {
		rank, _ := lexorank.Rank(ww[n-1].Rank, "")
		p.Rank = rank
	}

	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreWorkflow(p)

	return p, nil
}

func (s *service) MoveWorkflow(id string, index int) (*Workflow, error) {

	if index < 0 || index > 1000 {
		return nil, errors.New("index invalid")
	}

	m, err := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	mm, _ := s.r.FindWorkflowsByProject(s.Member.WorkspaceID, m.ProjectID)

	// Remove the item we are moving
	mmf := []*Workflow{}
	for _, x := range mm {
		if x.ID != id {
			mmf = append(mmf, x)
		}
	}

	var prevRank, nextRank string
	length := len(mmf)

	if length != 0 {
		if (index - 1) >= 0 {
			prevRank = mmf[index-1].Rank
		}

		if index < length {
			nextRank = mmf[index].Rank
		}
	}

	rank, _ := lexorank.Rank(prevRank, nextRank)

	m.Rank = rank
	m.LastModifiedByName = s.Acc.Name
	m.LastModified = time.Now().UTC()

	s.r.StoreWorkflow(m)

	return m, nil
}

func (s *service) RenameWorkflow(id string, title string) (*Workflow, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	p, err := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	p.Title = title
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreWorkflow(p)

	return p, nil
}

func (s *service) DeleteWorkflow(id string) error {
	s.r.DeleteWorkflow(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) GetWorkflowsByProject(id string) []*Workflow {
	pp, err := s.r.FindWorkflowsByProject(s.Member.WorkspaceID, id)
	if err != nil {
		log.Println(err)
	}
	return pp
}

func (s *service) UpdateWorkflowDescription(id string, d string) (*Workflow, error) {
	x, err := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	x.Description = d
	x.LastModified = time.Now().UTC()
	x.LastModifiedByName = s.Acc.Name
	s.r.StoreWorkflow(x)

	return x, nil
}

func (s *service) ChangeColorOnWorkflow(id string, color string) (*Workflow, error) {

	if !colorIsValid(color) {
		return nil, errors.New("invalid color")
	}

	p, err := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Color = color
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreWorkflow(p)

	return p, nil
}

func (s *service) CloseWorkflow(id string) (*Workflow, error) {
	p, err := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "CLOSED"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreWorkflow(p)

	return p, nil
}

func (s *service) OpenWorkflow(id string) (*Workflow, error) {
	p, err := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "OPEN"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreWorkflow(p)

	return p, nil
}

func (s *service) UpdateAnnotationsOnWorkflow(id string, names string) (*Workflow, error) {

	f, err := s.r.GetWorkflow(s.Member.WorkspaceID, id)
	if f == nil {
		return nil, err
	}

	if !areAnnotationsValid(names) {
		return nil, errors.New("invalid annotation")
	}

	f.Annotations = names
	f.LastModifiedByName = s.Acc.Name
	f.LastModified = time.Now().UTC()

	s.r.StoreWorkflow(f)

	return f, nil
}

// SubWorkflow
func (s *service) CreateSubWorkflowWithID(id string, workflowID string, title string) (*SubWorkflow, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	a, _ := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if a != nil {
		return nil, errors.New("already exists")
	}

	mm, _ := s.r.FindSubWorkflowsByWorkflow(s.Member.WorkspaceID, workflowID)

	p := &SubWorkflow{
		WorkspaceID:   s.Member.WorkspaceID,
		WorkflowID:    workflowID,
		ID:            id,
		Title:         title,
		Rank:          "",
		CreatedAt:     time.Now().UTC(),
		CreatedByName: s.Acc.Name,
		Color:         "WHITE",
		Status:        "OPEN",
	}

	n := len(mm)
	if n == 0 {
		rank, _ := lexorank.Rank("", "")
		p.Rank = rank
	} else {
		rank, _ := lexorank.Rank(mm[n-1].Rank, "")
		p.Rank = rank
	}

	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()
	s.r.StoreSubWorkflow(p)

	return p, nil
}

func (s *service) MoveSubWorkflow(id string, toWorkflowID string, index int) (*SubWorkflow, error) {

	if index < 0 || index > 1000 {
		return nil, errors.New("index invalid")
	}

	m, err := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	mm, _ := s.r.FindSubWorkflowsByWorkflow(s.Member.WorkspaceID, toWorkflowID)

	// Remove the item we are moving
	mmf := []*SubWorkflow{}
	for _, x := range mm {
		if x.ID != id {
			mmf = append(mmf, x)
		}
	}

	var prevRank, nextRank string
	length := len(mmf)

	if length != 0 {
		if (index - 1) >= 0 {
			prevRank = mmf[index-1].Rank
		}

		if index < length {
			nextRank = mmf[index].Rank
		}
	}

	rank, _ := lexorank.Rank(prevRank, nextRank)

	m.Rank = rank
	m.WorkflowID = toWorkflowID
	m.LastModifiedByName = s.Acc.Name
	m.LastModified = time.Now().UTC()

	s.r.StoreSubWorkflow(m)

	return m, nil
}

func (s *service) RenameSubWorkflow(id string, title string) (*SubWorkflow, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	p, err := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	p.Title = title
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreSubWorkflow(p)

	return p, nil
}

func (s *service) DeleteSubWorkflow(id string) error {
	s.r.DeleteSubWorkflow(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) GetSubWorkflowsByProject(id string) []*SubWorkflow {
	pp, err := s.r.FindSubWorkflowsByProject(s.Member.WorkspaceID, id)
	if err != nil {
		log.Println(err)
	}
	return pp
}

func (s *service) UpdateSubWorkflowDescription(id string, d string) (*SubWorkflow, error) {
	x, err := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	x.Description = d
	x.LastModified = time.Now().UTC()
	x.LastModifiedByName = s.Acc.Name
	s.r.StoreSubWorkflow(x)

	return x, nil
}

func (s *service) ChangeColorOnSubWorkflow(id string, color string) (*SubWorkflow, error) {

	if !colorIsValid(color) {
		return nil, errors.New("invalid color")
	}

	p, err := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Color = color
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreSubWorkflow(p)

	return p, nil
}

func (s *service) CloseSubWorkflow(id string) (*SubWorkflow, error) {
	p, err := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "CLOSED"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreSubWorkflow(p)

	return p, nil
}

func (s *service) OpenSubWorkflow(id string) (*SubWorkflow, error) {
	p, err := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "OPEN"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreSubWorkflow(p)

	return p, nil
}

func (s *service) UpdateAnnotationsOnSubWorkflow(id string, names string) (*SubWorkflow, error) {

	f, err := s.r.GetSubWorkflow(s.Member.WorkspaceID, id)
	if f == nil {
		return nil, err
	}

	if !areAnnotationsValid(names) {
		return nil, errors.New("invalid annotation")
	}

	f.Annotations = names
	f.LastModifiedByName = s.Acc.Name
	f.LastModified = time.Now().UTC()

	s.r.StoreSubWorkflow(f)

	return f, nil
}

// Features

func (s *service) CreateFeatureWithID(id string, subWorkflowID string, milestoneID string, title string) (*Feature, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	pp, _ := s.r.GetFeature(s.Member.WorkspaceID, id)

	if pp != nil {
		return nil, errors.New("already exists")
	}

	mm, _ := s.r.FindFeaturesByMilestoneAndSubWorkflow(s.Member.WorkspaceID, milestoneID, subWorkflowID)

	p := &Feature{
		WorkspaceID:   s.Member.WorkspaceID,
		MilestoneID:   milestoneID,
		SubWorkflowID: subWorkflowID,
		ID:            id,
		Title:         title,
		Rank:          "",
		Description:   "",
		Status:        "OPEN",
		CreatedAt:     time.Now().UTC(),
		CreatedByName: s.Acc.Name,
		Color:         "WHITE",
	}

	n := len(mm)
	if n == 0 {
		rank, _ := lexorank.Rank("", "")
		p.Rank = rank
	} else {
		rank, _ := lexorank.Rank(mm[n-1].Rank, "")
		p.Rank = rank
	}

	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreFeature(p)

	return p, nil
}

func (s *service) DeleteFeature(id string) error {
	s.r.DeleteFeature(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) RenameFeature(id string, title string) (*Feature, error) {

	title, err := validateTitle(title)
	if err != nil {
		return nil, err
	}

	p, _ := s.r.GetFeature(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, errors.Wrap(err, "could not find")
	}

	p.Title = title
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreFeature(p)

	return p, nil
}

func (s *service) CloseFeature(id string) (*Feature, error) {
	p, err := s.r.GetFeature(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "CLOSED"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreFeature(p)

	return p, nil
}

func (s *service) OpenFeature(id string) (*Feature, error) {
	p, err := s.r.GetFeature(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Status = "OPEN"
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreFeature(p)

	return p, nil
}

func (s *service) ChangeColorOnFeature(id string, color string) (*Feature, error) {

	if !colorIsValid(color) {
		return nil, errors.New("invalid color")
	}

	p, err := s.r.GetFeature(s.Member.WorkspaceID, id)
	if p == nil {
		return nil, err
	}

	p.Color = color
	p.LastModifiedByName = s.Acc.Name
	p.LastModified = time.Now().UTC()

	s.r.StoreFeature(p)

	return p, nil
}

func (s *service) UpdateAnnotationsOnFeature(id string, names string) (*Feature, error) {

	f, err := s.r.GetFeature(s.Member.WorkspaceID, id)
	if f == nil {
		return nil, err
	}

	if !areAnnotationsValid(names) {
		return nil, errors.New("invalid annotation")
	}

	f.Annotations = names
	f.LastModifiedByName = s.Acc.Name
	f.LastModified = time.Now().UTC()

	s.r.StoreFeature(f)

	return f, nil
}

func (s *service) UpdateEstimateOnFeature(id string, estimate int) (*Feature, error) {

	f, err := s.r.GetFeature(s.Member.WorkspaceID, id)
	if f == nil {
		return nil, err
	}

	if estimate < 0 || estimate > 999 {
		return nil, errors.New("invalid estimate")
	}

	f.Estimate = estimate
	f.LastModifiedByName = s.Acc.Name
	f.LastModified = time.Now().UTC()

	s.r.StoreFeature(f)

	return f, nil
}

func (s *service) MoveFeature(id string, toMilestoneID string, toSubWorkflowID string, index int) (*Feature, error) {

	if index < 0 || index > 1000 {
		return nil, errors.New("index invalid")
	}

	m, err := s.r.GetFeature(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	mm, _ := s.r.FindFeaturesByMilestoneAndSubWorkflow(s.Member.WorkspaceID, toMilestoneID, toSubWorkflowID)

	// Remove the item we are moving
	mmf := []*Feature{}
	for _, x := range mm {
		if x.ID != id {
			mmf = append(mmf, x)
		}
	}

	var prevRank, nextRank string
	length := len(mmf)

	if length != 0 {
		if (index - 1) >= 0 {
			prevRank = mmf[index-1].Rank
		}

		if index < length {
			nextRank = mmf[index].Rank
		}
	}

	rank, _ := lexorank.Rank(prevRank, nextRank)
	m.Rank = rank
	m.MilestoneID = toMilestoneID
	m.SubWorkflowID = toSubWorkflowID
	m.LastModifiedByName = s.Acc.Name
	m.LastModified = time.Now().UTC()

	s.r.StoreFeature(m)

	return m, nil
}

func (s *service) GetFeaturesByProject(id string) []*Feature {
	pp, err := s.r.FindFeaturesByProject(s.Member.WorkspaceID, id)
	if err != nil {
		log.Println(err)
	}
	return pp
}

func (s *service) UpdateFeatureDescription(id string, d string) (*Feature, error) {
	x, err := s.r.GetFeature(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, err
	}

	x.Description = d
	x.LastModified = time.Now().UTC()
	x.LastModifiedByName = s.Acc.Name
	s.r.StoreFeature(x)

	return x, nil
}

// Feature comments

func (s *service) CreateFeatureCommentWithID(id string, featureID string, post string) (*FeatureComment, error) {

	f, err := s.r.GetFeature(s.Member.WorkspaceID, featureID)
	if err != nil {
		return nil, errors.New("feature not found")
	}

	m, err := s.r.GetMilestone(s.Member.WorkspaceID, f.MilestoneID)
	if err != nil {
		return nil, errors.New("milestone not found")
	}

	if len(post) > 10000 {
		return nil, errors.New("post_too_long")
	}

	t := time.Now().UTC()

	p := &FeatureComment{
		WorkspaceID:   s.Member.WorkspaceID,
		ID:            id,
		FeatureID:     featureID,
		ProjectID:     m.ProjectID,
		Post:          post,
		CreatedAt:     t,
		CreatedByName: s.Acc.Name,
		LastModified:  t,
	}

	s.r.StoreFeatureComment(p)

	owner := &FeatureCommentOwner{
		WorkspaceID:      s.Member.WorkspaceID,
		ID:               uuid.Must(uuid.NewV4(), nil).String(),
		FeatureCommentID: p.ID,
		MemberID:         s.Member.ID,
		ProjectID:        p.ProjectID,
	}

	s.r.StoreFeatureCommentOwner(owner)

	p.MemberID = owner.MemberID

	return p, nil
}

func (s *service) DeleteFeatureComment(id string) error {

	fco, err := s.r.GetFeatureCommentOwnerByFeatureComment(s.Member.WorkspaceID, id)
	if err != nil {
		return errors.New("feature comment owner not found")
	}

	if s.Member.ID != fco.MemberID {
		return errors.New("something went wrong when deleting comment")
	}

	s.r.DeleteFeatureComment(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) GetFeatureCommentsByProject(id string) []*FeatureComment {
	pp, err := s.r.FindFeatureCommentsByProject(s.Member.WorkspaceID, id)

	owners, err := s.r.FindFeatureCommentOwnersByProject(s.Member.WorkspaceID, id)

	// Populare MemberID on comments
	for _, p := range pp {
		for _, o := range owners {

			if p.ID == o.FeatureCommentID {
				p.MemberID = o.MemberID
				break
			} else {
				p.MemberID = ""
			}

		}
	}

	if err != nil {
		log.Println(err)
	}
	return pp
}

func (s *service) UpdateFeatureCommentPost(id string, post string) (*FeatureComment, error) {

	fc, err := s.r.GetFeatureComment(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, errors.New("feature comment not found")
	}

	fco, err := s.r.GetFeatureCommentOwnerByFeatureComment(s.Member.WorkspaceID, id)
	if err != nil {
		return nil, errors.New("feature comment owner not found")
	}

	if s.Member.ID != fco.MemberID {
		return nil, errors.New("something went wrong when deleting comment")
	}

	if len(post) > 10000 {
		return nil, errors.New("post_too_long")
	}

	fc.Post = post

	fc.MemberID = fco.MemberID
	fc.LastModified = time.Now().UTC()

	s.r.StoreFeatureComment(fc)

	return fc, nil

}

// -----------

func validateTitle(title string) (string, error) {
	title = govalidator.Trim(title, "")
	if len(title) < 1 {
		return title, errors.New("title too short")
	}
	if len(title) > 200 {
		return title, errors.New("title too long")
	}

	return title, nil
}

func (s *service) ConfirmEmail(key string) error {

	a, err := s.r.GetAccountByConfirmationKey(key)
	if err != nil {
		return err
	}

	if !a.EmailConfirmationPending {
		return nil
	}

	dupacc, _ := s.r.GetAccountByEmail(a.EmailConfirmationSentTo)
	if dupacc != nil && dupacc.ID != a.ID {
		return errors.New("email_taken")
	}

	a.EmailConfirmed = true
	a.Email = a.EmailConfirmationSentTo
	a.EmailConfirmationPending = false

	s.r.StoreAccount(a)

	return nil
}

func (s *service) UpdateEmail(email string) error {

	em := strings.ToLower(email)

	dupacc, _ := s.r.GetAccountByEmail(em)
	if dupacc != nil {
		return errors.New("email_taken")
	}

	a := s.Acc

	a.EmailConfirmationSentTo = em
	a.EmailConfirmationKey = uuid.Must(uuid.NewV4(), nil).String()
	a.EmailConfirmationPending = true

	s.r.StoreAccount(a)

	body, err := ChangeEmailBody(emailBody{s.config.AppSiteURL, a.EmailConfirmationSentTo, a.EmailConfirmationKey})
	if err != nil {
		log.Println(err)
	}

	err = s.SendEmail(s.config.SMTPServer, s.config.SMTPPort, s.config.SMTPUser, s.config.SMTPPass, s.config.EmailFrom, em, "Welcome to Featmap!", body)
	if err != nil {
		log.Println("error sending mail")
	}

	return nil
}

func (s *service) UpdateName(name string) error {

	a := s.Acc

	name = govalidator.Trim(name, "")

	if len(name) < 1 || len(name) > 200 {
		return errors.New("name_invalid")
	}

	a.Name = name

	s.r.StoreAccount(a)

	return nil
}

func (s *service) ResendEmail() error {
	a := s.Acc

	if !a.EmailConfirmationPending {
		return errors.New("email already confirmed")
	}

	body, err := ChangeEmailBody(emailBody{s.config.AppSiteURL, a.EmailConfirmationSentTo, a.EmailConfirmationKey})
	if err != nil {
		log.Println("RESEND: ", err)
		return err
	}
	err = s.SendEmail(s.config.SMTPServer,
		s.config.SMTPPort,
		s.config.SMTPUser,
		s.config.SMTPPass,
		s.config.EmailFrom,
		a.EmailConfirmationSentTo,
		"Featmap: verify your email address",
		body)
	if err != nil {
		log.Println("RESEND: ", err)
		return err
	}
	return nil
}

func (s *service) SendResetEmail(email string) error {

	a, err := s.r.GetAccountByEmail(email)
	if err != nil {
		return errors.New("email_not_found")
	}

	body, _ := ResetPasswordBody(resetPasswordBody{s.config.AppSiteURL, email, a.PasswordResetKey})

	err = s.SendEmail(s.config.SMTPServer, s.config.SMTPPort, s.config.SMTPUser, s.config.SMTPPass, s.config.EmailFrom, email, "Featmap: request to reset password", body)
	if err != nil {
		log.Println("error sending mail")
		return err
	}

	return nil
}

func (s *service) SetPassword(password string, key string) error {

	if len(password) < 6 || len(password) > 200 {
		return errors.New("password_invalid")
	}

	a, err := s.r.GetAccountByPasswordKey(key)
	if err != nil {
		return err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	a.Password = string(hash)
	if err != nil {
		return errors.New("encrypt_password")
	}

	s.r.StoreAccount(a)

	return nil
}

func levelIsValid(level string) bool {
	return level == "VIEWER" || level == "EDITOR" || level == "ADMIN" || level == "OWNER"
}

func colorIsValid(color string) bool {
	return color == "WHITE" ||
		color == "GREY" ||
		color == "RED" ||
		color == "ORANGE" ||
		color == "YELLOW" ||
		color == "GREEN" ||
		color == "TEAL" ||
		color == "BLUE" ||
		color == "INDIGO" ||
		color == "PURPLE" ||
		color == "PINK"
}

func (s *service) GetPersonasByProject(id string) []*Persona {
	pp, err := s.r.FindPersonasByProject(s.Member.WorkspaceID, id)
	if err != nil {
		log.Println(err)
	}
	return pp
}

// Workflow personas

func (s *service) GetWorkflowPersonasByProject(id string) []*WorkflowPersona {
	pp, err := s.r.FindWorkflowPersonasByProject(s.Member.WorkspaceID, id)
	if err != nil {
		log.Println(err)
	}
	return pp
}

func (s *service) DeleteWorkflowPersona(id string) error {
	s.r.DeleteWorkflowPersona(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) CreateWorkflowPersonaWithID(id string, workflowID string, personaID string) (*WorkflowPersona, error) {

	w, _ := s.r.GetWorkflow(s.Member.WorkspaceID, workflowID)

	if w == nil {
		return nil, errors.New("workflow does not exist")
	}

	p, _ := s.r.GetPersona(s.Member.WorkspaceID, personaID)
	if p == nil {
		return nil, errors.New("persona does not exist")
	}

	if w.ProjectID != p.ProjectID {
		return nil, errors.New("persona needs to be from the same project as workflow")
	}

	wp := &WorkflowPersona{
		WorkspaceID: s.Member.WorkspaceID,
		ProjectID:   w.ProjectID,
		WorkflowID:  w.ID,
		ID:          id,
		PersonaID:   personaID,
	}

	s.r.StoreWorkflowPersona(wp)

	return wp, nil
}

// Personas

func (s *service) CreatePersonaWithID(id string, projectID string, avatar string, name string, role string, description string, workflowID string, workflowPersonaID string) (*Persona, error) {
	proj, _ := s.r.GetProject(s.Member.WorkspaceID, projectID)

	if proj == nil {
		return nil, errors.New("project does not exist")
	}

	if !validAvatar(avatar) {
		return nil, errors.New("avatar not valid")
	}

	if len(name) == 0 || len(name) > 200 {
		return nil, errors.New("name not valid")
	}

	if len(role) > 200 {
		return nil, errors.New("role not valid")
	}

	if len(description) > 10000 {
		return nil, errors.New("description not valid")
	}

	p := &Persona{
		WorkspaceID: s.Member.WorkspaceID,
		ProjectID:   projectID,
		ID:          id,
		Avatar:      avatar,
		Name:        name,
		Role:        role,
		Description: description,
		CreatedAt:   time.Now().UTC(),
	}

	s.r.StorePersona(p)

	if workflowID == "" {
		return p, nil
	}

	wf, _ := s.r.GetWorkflow(s.Member.WorkspaceID, workflowID)
	if wf == nil {
		return nil, errors.New("workflow does not exist")
	}

	if wf.ProjectID != p.ProjectID {
		return nil, errors.New("not in the same project")
	}

	wp := &WorkflowPersona{
		WorkspaceID: s.Member.WorkspaceID,
		ProjectID:   projectID,
		WorkflowID:  workflowID,
		ID:          workflowPersonaID,
		PersonaID:   p.ID,
	}

	s.r.StoreWorkflowPersona(wp)

	return p, nil
}

func (s *service) DeletePersona(id string) error {
	s.r.DeletePersona(s.Member.WorkspaceID, id)
	return nil
}

func (s *service) UpdatePersona(id string, avatar string, name string, role string, description string) (*Persona, error) {
	pers, _ := s.r.GetPersona(s.Member.WorkspaceID, id)

	if pers == nil {
		return nil, errors.New("persona does not exist")
	}

	if !validAvatar(avatar) {
		return nil, errors.New("avatar not valid")
	}

	if len(name) == 0 || len(name) > 200 {
		return nil, errors.New("name not valid")
	}

	if len(role) > 200 {
		return nil, errors.New("role not valid")
	}

	if len(description) > 10000 {
		return nil, errors.New("description not valid")
	}

	pers.Avatar = avatar
	pers.Name = name
	pers.Role = role
	pers.Description = description

	s.r.StorePersona(pers)

	return pers, nil
}

func validAvatar(avatar string) bool {
	switch avatar {
	case "avatar00", "avatar01", "avatar02", "avatar03", "avatar04", "avatar05", "avatar06", "avatar07", "avatar08":
		return true
	}
	return false
}

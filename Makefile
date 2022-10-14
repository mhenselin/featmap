.PHONY: all

BINDATA=$(shell which go-bindata)

all:
	@echo "all ..."

.PHONY: tools-install assets webapp build run
tools-install:
ifndef BINDATA
	@echo "installing go-bindata"
	@go install -a -v github.com/go-bindata/go-bindata/...@latest
endif

assets: tools-install
	@echo "compiling migrations" && \
	go-bindata  -pkg migrations -o ./migrations/bindata.go  ./migrations/
	@echo "compiling templates" && \
	go-bindata  -pkg tmpl -o ./tmpl/bindata.go  ./tmpl/

webapp:
	@echo "compiling webapp" && \
    go-bindata  -pkg webapp -o ./webapp/bindata.go  ./webapp/build/...

build:
	@echo "building app" && \
	go build .

run:
	@echo "starting app" && \
	go run .

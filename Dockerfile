FROM golang:1.15-alpine as build
WORKDIR /src
RUN apk --update add --no-cache npm git
# This will download all certificates (ca-certificates) and builds it in a
# single file under /etc/ssl/certs/ca-certificates.crt (update-ca-certificates)
# I also add git so that we can download with `go mod download` and
# tzdata to configure timezone in final image
RUN apk --update add --no-cache ca-certificates openssl git tzdata && \
    update-ca-certificates
COPY ./webapp/package.json webapp/package.json
COPY ./webapp/package-lock.json webapp/package-lock.json
RUN cd ./webapp && \
    npm ci
COPY . .
RUN cd ./webapp && \
    npm run build
#RUN rm -rf ./webapp/node_modules

FROM build as gobuild
RUN go get -u github.com/jteeuwen/go-bindata/...
RUN go-bindata -pkg webapp -o ./webapp/bindata.go  ./webapp/build/...

RUN cd ./migrations && \
    go-bindata  -pkg migrations .
RUN go-bindata  -pkg tmpl -o ./tmpl/bindata.go  ./tmpl/

RUN CGO_ENABLED=0 go build -o /opt/featmap/featmap
RUN chmod 775 /opt/featmap/featmap

#FROM golang:1.15-alpine
FROM scratch
COPY --from=build /etc/ssl/certs /etc/ssl/certs
WORKDIR /
COPY --from=gobuild /opt/featmap/featmap /featmap

ENTRYPOINT ["./featmap"]

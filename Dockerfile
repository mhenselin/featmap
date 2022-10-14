FROM golang:1.15-alpine as builder
WORKDIR /src
RUN apk add --update npm git
RUN go get -u github.com/jteeuwen/go-bindata/...
COPY ./webapp/package.json webapp/package.json
COPY ./webapp/package-lock.json webapp/package-lock.json
RUN cd ./webapp && \
    npm ci
COPY . .
RUN cd ./webapp && \
    npm run build
RUN cd ./migrations && \
    go-bindata  -pkg migrations .
RUN go-bindata  -pkg tmpl -o ./tmpl/bindata.go  ./tmpl/ && \
    go-bindata  -pkg webapp -o ./webapp/bindata.go  ./webapp/build/...    

RUN go build -o /opt/featmap/featmap && \
    chmod 775 /opt/featmap/featmap

FROM golang:1.15-alpine
ENV FEATMAP_HTTP_PORT=5000

COPY --from=builder /opt/featmap/featmap /opt/featmap/featmap

WORKDIR /opt/featmap
ENTRYPOINT ["./featmap"]

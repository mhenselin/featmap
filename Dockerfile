FROM node as builder
WORKDIR /src/webapp
COPY ./webapp/package.json package.json
COPY ./webapp/package-lock.json package-lock.json
RUN npm ci
COPY ./webapp /src/webapp
RUN npm run build

FROM golang:1.19-alpine as gobuilder
RUN go install github.com/jteeuwen/go-bindata/...@latest
WORKDIR /src
COPY . .
COPY --from=builder /src/webapp/build /src/webapp/build
RUN cd ./migrations && \
    go-bindata  -pkg migrations .
RUN go-bindata  -pkg tmpl -o ./tmpl/bindata.go  ./tmpl/ && \
    go-bindata  -pkg webapp -o ./webapp/bindata.go  ./webapp/build/...    

RUN go build -o /opt/featmap/featmap && \
    chmod 775 /opt/featmap/featmap

FROM golang:1.19-alpine
ENV FEATMAP_HTTP_PORT=5000

COPY --from=gobuilder /opt/featmap/featmap /opt/featmap/featmap

WORKDIR /opt/featmap
ENTRYPOINT ["./featmap"]

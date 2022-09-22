#!/bin/bash

apt-get -y update && apt-get -y upgrade
apt-get -y install npm git

scriptDir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
cd "$scriptDir"
cd "../webapp"
#npm install
npm ci
npm run build

cd ..

go get -u github.com/jteeuwen/go-bindata/...
go-bindata -pkg webapp -o ./webapp/bindata.go  ./webapp/build/...

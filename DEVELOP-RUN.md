# run locally

## easiest way
* adjust .env file to use with docker compose
* docker compose up

## compile locally
* make sure, a database exists and conf.json is correct
* run ```npm ci && npm run build```
  * or run ```make webapp-build``` to build via docker
* run ```make build```
* run featmap (featmap.exe on windows)


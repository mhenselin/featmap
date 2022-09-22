#!/bin/bash

docker run --rm -it -v $(pwd)/:/go/src golang:1.15 bash /go/src/build/dowebapp.sh

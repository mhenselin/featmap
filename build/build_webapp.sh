scriptDir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
cd "$scriptDir"
cd "../webapp"
#npm install
npm ci
npm run build

#!/usr/bin/env bash
set -eo pipefail

source .env

NGINX_INDEX_FILE="/usr/share/nginx/html/index.html"

clientEnvVars=$(env | grep REACT_APP_)
clientEnvVars=$(echo $clientEnvVars | sed 's/=/":"/g')
clientEnvVars=$(echo $clientEnvVars | sed 's/^/"/g')
clientEnvVars=$(echo $clientEnvVars | sed 's/$/"/g')
clientEnvVars=$(echo $clientEnvVars | sed 's/ /,/g')

sed -i "s/\"__ENV__\"/$clientEnvVars/g" $NGINX_INDEX_FILE

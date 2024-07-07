#!/usr/bin/env bash
set -eo pipefail

source .env

NGINX_INDEX_FILE="/usr/share/nginx/html/index.html"

# Extract environment variables that start with REACT_APP_ and format them as JSON
clientEnvVars=$(env | grep '^REACT_APP_' | awk -F= '{print "\""$1"\":\""$2"\""}' | paste -sd, -)
clientEnvVars="{$clientEnvVars}"

# Replace the placeholder with the formatted environment variables in the index file
sed -i "s@\"__ENV__\"@${clientEnvVars}@g" $NGINX_INDEX_FILE

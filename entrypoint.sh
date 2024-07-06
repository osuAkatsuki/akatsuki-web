#!/usr/bin/env bash
set -eo pipefail

if [ -z "$APP_COMPONENT" ]; then
  echo "Please set APP_COMPONENT"
  exit 1
fi

if [ -z "$APP_ENV" ]; then
  echo "Please set APP_ENV"
  exit 1
fi

if [[ $PULL_SECRETS_FROM_VAULT -eq 1 ]]; then
  akatsuki vault get akatsuki-web $APP_ENV -o .env
  source .env
fi

node '/usr/share/nginx/html/injectEnv.js'

nginx -g "daemon off;"

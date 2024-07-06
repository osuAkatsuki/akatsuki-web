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
  echo "Pulling secrets from vault"
  akatsuki vault get akatsuki-web $APP_ENV -o .env
  echo "Secrets pulled from vault"
  source .env
  echo "Secrets sourced"
fi

yarn add dotenv
node '/usr/share/nginx/html/injectEnv.js'

nginx -g "daemon off;"

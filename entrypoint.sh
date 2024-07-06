#!/usr/bin/env bash
set -e

if [[ -n "$KUBERNETES" ]]; then
  source /vault/secrets/secrets.txt
  node '/usr/share/nginx/html/injectEnv.js'
fi

nginx -g "daemon off;"

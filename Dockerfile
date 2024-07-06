FROM node:18.15.0-bullseye AS dependency

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install project dependencies
COPY . .
RUN yarn install

# Validate typescript is correct
RUN node_modules/.bin/tsc

# Generate a production build to serve statically
RUN yarn build

# Add script to inject REACT_APP_* env vars into index.html
COPY scripts/injectEnv.js /usr/src/app/build/injectEnv.js

# Serve build dist statically via nginx
FROM ubuntu:23.10

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install the Akatsuki CLI
RUN apt install -y nginx git

RUN wget https://bootstrap.pypa.io/get-pip.py \
    && python3.10 get-pip.py \
    && pip install git+https://github.com/osuAkatsuki/akatsuki-cli \
    && rm get-pip.py

# Install nodejs (needed for injectEnv.js script)
# TODO: this could be improved by rewriting it in bash
COPY --from=dependency /usr/local /usr/local
COPY --from=dependency /usr/lib /usr/lib

WORKDIR /usr/src/app

# Copy nginx config and static files
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=dependency /usr/src/app/build /usr/share/nginx/html

# Move entrypoint script to image
COPY ./entrypoint.sh ./entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "./entrypoint.sh" ]

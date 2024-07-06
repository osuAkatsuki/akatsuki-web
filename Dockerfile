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

# Serve build dist statically via nginx
FROM nginx

WORKDIR /usr/src/app

# Install akatsuki CLI
RUN apt update && apt install -y python3-pip git
RUN pip install --break-system-packages git+https://github.com/osuAkatsuki/akatsuki-cli

# Copy nginx config and static files
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=dependency /usr/src/app/build /usr/share/nginx/html

# Move entrypoint script to image
COPY ./entrypoint.sh ./entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "./entrypoint.sh" ]

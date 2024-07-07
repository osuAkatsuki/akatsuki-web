#!/usr/bin/make

build: # build all containers
	docker build -t akatsuki-web:latest .

run:
	docker run --env-file=.env -d -p 8080:8080 akatsuki-web:latest

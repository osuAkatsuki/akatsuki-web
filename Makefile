#!/usr/bin/make

build: # build all containers
	docker build -t akatsuki-web:latest .

#!/usr/bin/make

build: # build all containers
	docker build -t interns-frontend:latest -t registry.digitalocean.com/akatsuki/interns-frontend:latest .

push:
	docker push registry.digitalocean.com/akatsuki/interns-frontend:latest

install:
	helm install \
		--atomic \
		--wait --timeout 480s \
		--values chart/values.yaml \
		interns-frontend-staging \
		../akatsuki/common-helm-charts/microservice-base/

uninstall:
	helm uninstall \
		--wait --timeout 480s \
		interns-frontend-staging

upgrade:
	helm upgrade \
		--atomic \
		--wait --timeout 480s \
		--values chart/values.yaml \
		interns-frontend-staging \
		../akatsuki/common-helm-charts/microservice-base/

diff:
	helm diff upgrade \
		--allow-unreleased \
		--values chart/values.yaml \
		interns-frontend-staging \
		../akatsuki/common-helm-charts/microservice-base/

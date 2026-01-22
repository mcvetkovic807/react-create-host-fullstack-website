# -----------------------------
# Default target
# -----------------------------
default: help

# -----------------------------
# Variables
# -----------------------------
COMPOSE=docker-compose -f docker/composefiles/docker-compose.yml
MONGO_SERVICE = mongodb
MONGO_SHELL = mongosh
ENV_FILE = back-end/src/.env
include $(ENV_FILE)
export

# -----------------------------
# Help
# -----------------------------
.PHONY: help
help: ## Show available make targets
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# -----------------------------
# Lifecycle
# -----------------------------
.PHONY: start
start: build up ## Build and start local dev environment

.PHONY: stop
stop: ## Stop local environment
	$(COMPOSE) down --remove-orphans

.PHONY: restart
restart: stop start ## Restart local environment

# -----------------------------
# Build
# -----------------------------
.PHONY: build
build: ## Build Docker image
	$(COMPOSE) build

# -----------------------------
# Run
# -----------------------------
.PHONY: up
up: ## Start containers
	$(COMPOSE) up -d

# -----------------------------
# Logs
# -----------------------------
.PHONY: logs
logs: ## Tail container logs
	$(COMPOSE) logs -f

# -----------------------------
# MongoDB helpers
# -----------------------------
.PHONY: mongo-shell
mongo-shell: ## Open MongoDB shell (equivalent to `mongo`)
	docker exec -it $(MONGO_SERVICE) \
		$(MONGO_SHELL) -u $(MONGO_USER) -p $(MONGO_PASS) \
		--authenticationDatabase $(MONGO_AUTHDB)

.PHONY: mongo-dbs
mongo-dbs: ## Show databases
	docker exec $(MONGO_SERVICE) \
		$(MONGO_SHELL) -u $(MONGO_USER) -p $(MONGO_PASS) \
		--authenticationDatabase $(MONGO_AUTHDB) \
		--eval "show dbs"

.PHONY: mongo-collections
mongo-collections: ## Show collections in a database (default: testdb)
	docker exec $(MONGO_SERVICE) \
		$(MONGO_SHELL) -u $(MONGO_USER) -p $(MONGO_PASS) \
		--authenticationDatabase $(MONGO_AUTHDB) \
		$(MONGO_DB) --eval "show collections"

.PHONY: mongo-drop-db
mongo-drop-db: ## Drop a database (⚠ destructive)
	docker exec $(MONGO_SERVICE) \
		$(MONGO_SHELL) -u $(MONGO_USER) -p $(MONGO_PASS) \
		--authenticationDatabase $(MONGO_AUTHDB) \
		$(MONGO_DB) --eval "db.dropDatabase()"

## Run a JS file inside Mongo shell
mongo-run:
	docker exec -i $(MONGO_SERVICE) \
		$(MONGO_SHELL) -u $(MONGO_USER) -p $(MONGO_PASS) \
		--authenticationDatabase $(MONGO_AUTHDB) < back-end/src/mongo.js

mongo-reset:
	docker compose down -v
	docker compose up -d

mongo-ping:
	docker exec $(MONGO_SERVICE) \
		$(MONGO_SHELL) --quiet \
		"mongodb://$(MONGO_USER):$(MONGO_PASS)@$(MONGO_HOST):$(MONGO_PORT)/?authSource=$(MONGO_AUTHDB)" \
		--eval "db.runCommand({ ping: 1 })"

docker-logs-mongo:
	docker logs -f $(MONGO_SERVICE)

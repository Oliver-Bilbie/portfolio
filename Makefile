.PHONY: terraform build

default: all

all: build-api terraform build-client deploy

update:
	@echo "[INFO] Updating dependencies"
	@npm update

terraform:
	@echo "[INFO] Deploying infrastructure"
	@cd terraform && terraform init
	@cd terraform && terraform apply
	@echo "[INFO] Infrastructure deployed 🚀"

build-client:
	@echo "[INFO] Installing dependencies"
	@npm install

	@echo "[INFO] Generating placeholder screenshots"
	@npm run screenshot

	@echo "[INFO] Building client files"
	@rm -rf ./build
	@mkdir -p ./build
	@cp -r ./src/* ./build
	@sed -i 's|%CONTACT_API%|$(shell cd terraform && terraform output -raw contact_api)|g' ./build/scripts/endpoints.js

	@echo "[INFO] Minifying client files"
	@find build -name "*.js" -type f | while read file; do \
		npx terser "$$file" -o "$$file" -c -m; \
	done;

	@echo "[INFO] Client has been built"

build-api:
	@echo "[INFO] Building API"
	@cd api && cargo lambda build --release --output-format zip
	@echo "[INFO] API has been built"

deploy:
	@echo "[INFO] Uploading client files"
	@aws s3 sync --delete ./build s3://portfolio-host-bucket

	@echo "[INFO] Resetting CDN cache"
	@aws cloudfront create-invalidation --distribution-id $(shell cd terraform && terraform output -raw cloudfront_distribution) --paths "/*"

	@echo "[INFO] Client deployed 🚀"

dev:
	@echo "[INFO] Running local development server on 127.0.0.1:8080"
	@npm start

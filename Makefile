.PHONY: terraform client

default: all

all: terraform client

terraform:
	@echo "[INFO] Deploying infrastructure"
	@cd terraform && terraform init
	@cd terraform && terraform apply
	@echo "[INFO] Infrastructure deployed 🚀"

client:
	@echo "[INFO] Installing dependencies"
	@npm install
	@echo "[INFO] Building client files"
	@mkdir -p ./build
	@cp -r ./src/* ./build
	@find build -name "*.js" -type f | while read file; do \
		npx terser "$$file" -o "$$file" -c -m; \
	done;
	@echo "[INFO] Uploading client files"
	@aws s3 sync --delete ./build s3://portfolio-host-bucket
	@echo "[INFO] Resetting CDN cache"
	@aws cloudfront create-invalidation --distribution-id $(shell cd terraform && terraform output -raw cloudfront_distribution) --paths "/*"
	@echo "[INFO] Client deployed 🚀"

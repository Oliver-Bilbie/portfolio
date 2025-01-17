.PHONY: terraform client

default: all

all: terraform client

terraform:
	@echo "[INFO] Deploying infrastructure"
	@cd terraform && terraform init
	@cd terraform && terraform apply
	@echo "[INFO] Infrastructure deployed 🚀"

client:
	@echo "[INFO] Uploading client files"
	@aws s3 sync --delete ./src s3://portfolio-host-bucket
	@echo "[INFO] Resetting CDN cache"
	@aws cloudfront create-invalidation --distribution-id $(shell cd terraform && terraform output -raw cloudfront_distribution) --paths "/*"
	@echo "[INFO] Client deployed 🚀"

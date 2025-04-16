.PHONY: terraform build

default: all

all: terraform build deploy

update:
	@echo "[INFO] Updating dependencies"
	@npm update

terraform:
	@echo "[INFO] Deploying infrastructure"
	@cd terraform && terraform init
	@cd terraform && terraform apply
	@echo "[INFO] Infrastructure deployed 🚀"

build:
	@if [ -z "$(MY_EMAIL)" ]; then \
		echo "[ERROR] Environment variable MY_EMAIL must be set first"; \
		exit 1; \
	fi

	@echo "[INFO] Installing dependencies"
	@npm install

	@echo "[INFO] Building client files"
	@rm -rf ./build
	@mkdir -p ./build
	@cp -r ./src/* ./build
	@sed -i 's|%MY_EMAIL%|$(MY_EMAIL)|g' ./build/index.html

	@echo "[INFO] Minifying client files"
	@find build -name "*.js" -type f | while read file; do \
		npx terser "$$file" -o "$$file" -c -m; \
	done;

	@echo "[INFO] Compressing client files"
	@find build -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) | while read file; do \
		brotli -f -q 11 "$$file" -o "$$file.br"; \
		gzip -f -k "$$file"; \
	done

	@echo "[INFO] Client has been built"

deploy:
	@for enc in br gz; do \
		echo "[INFO] Uploading $$enc encoded files individually with correct headers"; \
		find build -type f -name "*.$$enc" | while read file; do \
			origfile=$${file%.$$enc}; \
			relpath=$${origfile#build/}; \
			mime=$$(file --mime-type -b "$$origfile"); \
			encoding=$$( [ "$$enc" = "br" ] && echo br || echo gzip ); \
			aws s3 cp "$$file" "s3://portfolio-host-bucket/$$relpath" \
				--content-encoding "$$encoding" \
				--content-type "$$mime" \
				--metadata-directive REPLACE; \
		done; \
	done

	@echo "[INFO] Uploading client files"
	@aws s3 sync --delete ./build s3://portfolio-host-bucket

	@echo "[INFO] Resetting CDN cache"
	@aws cloudfront create-invalidation --distribution-id $(shell cd terraform && terraform output -raw cloudfront_distribution) --paths "/*"

	@echo "[INFO] Client deployed 🚀"

dev:
	@echo "[INFO] Running local development server on 127.0.0.1:8080"
	@npm start

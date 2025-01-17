terraform {
  backend "s3" {
    region         = "eu-west-1"
    bucket         = "oliver-bilbie-tf-state-bucket"
    key            = "portfolio/terraform.tfstate"
    dynamodb_table = "oliver-bilbie-tf-lock-table"
    encrypt        = true
  }
}

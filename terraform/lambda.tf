resource "aws_lambda_function" "contact" {
  function_name    = "${var.app_name}-contact"
  filename         = "${path.module}/../api/target/lambda/contact/bootstrap.zip"
  source_code_hash = filebase64sha256("${path.module}/../api/target/lambda/contact/bootstrap.zip")
  role             = aws_iam_role.contact_lambda_role.arn
  handler          = "bootstrap"
  runtime          = "provided.al2023"
  timeout          = 10
  memory_size      = 128
}

resource "aws_iam_role" "contact_lambda_role" {
  name               = "${var.app_name}-contact-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json

  inline_policy {
    name   = "${var.app_name}-contact-lambda-policy"
    policy = data.aws_iam_policy_document.contact_lambda_policy.json
  }

  inline_policy {
    name   = "${var.app_name}-lambda-logging"
    policy = data.aws_iam_policy_document.lambda_logging.json
  }
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_logging" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}

data "aws_iam_policy_document" "contact_lambda_policy" {
  statement {
    effect    = "Allow"
    actions   = ["ses:SendEmail"]
    resources = ["*"]
  }
}

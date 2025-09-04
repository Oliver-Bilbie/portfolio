resource "aws_apigatewayv2_api" "api" {
  name          = "${var.app_name} API"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["*"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "prod"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 4
    throttling_rate_limit  = 2
  }
}

resource "aws_apigatewayv2_route" "contact_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /contact"

  target = "integrations/${aws_apigatewayv2_integration.contact_integration.id}"
}

resource "aws_apigatewayv2_integration" "contact_integration" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.contact.arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_lambda_permission" "contact_permission" {
  statement_id  = "AllowAPIGatewayConnect"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*"
}

output "contact_api" {
  value = "${aws_apigatewayv2_api.api.api_endpoint}/${aws_apigatewayv2_stage.stage.name}/contact"
}

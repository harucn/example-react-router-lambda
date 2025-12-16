terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.26.0"
    }
  }
  required_version = ">= 1.14.2"
}

provider "aws" {
  region = local.aws_region
}

locals {
  aws_region = "ap-northeast-1"
}

resource "aws_lambda_function" "rr_sample_app" {
  function_name    = "rr-sample-app"
  runtime          = "nodejs22.x"
  architectures    = ["arm64"]
  role             = aws_iam_role.lambda_role.arn

  filename         = "./app.zip"
  source_code_hash = filebase64sha256("./app.zip")
  handler = "run.sh"
  layers  = ["arn:aws:lambda:ap-northeast-1:753240598075:layer:LambdaAdapterLayerArm64:24"]
  environment {
    variables = {
      AWS_LAMBDA_EXEC_WRAPPER = "/opt/bootstrap"
    }
  }
}

resource "aws_lambda_function_url" "frontend_url" {
  function_name      = aws_lambda_function.rr_sample_app.function_name
  authorization_type = "NONE"
}

resource "aws_iam_role" "lambda_role" {
  name = "rr-sample-app-lambda-role"
  assume_role_policy = jsonencode(({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  }))
}

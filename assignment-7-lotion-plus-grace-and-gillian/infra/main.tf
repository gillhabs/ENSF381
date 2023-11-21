terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "ca-central-1"
}

# the locals block is used to declare constants that 
# you can use throughout your code
locals {

  function_name_get    = "get-notes-30145994"
  function_name_save   = "save-note-30145994"
  function_name_delete = "delete-note-30145994"
  handler_name         = "main.lambda_handler"
  artifact_name_get    = "get_artifact.zip"
  artifact_name_save   = "save_artifact.zip"
  artifact_name_delete = "delete_artifact.zip"
}


# create a role for the Lambda save function to assume
# every service on AWS that wants to call other AWS services should first assume a role and
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "lambda-save" {
  name               = "iam-for-lambda-${local.function_name_save}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


# create a role for the Lambda get function to assume
# every service on AWS that wants to call other AWS services should first assume a role and
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "lambda-get" {
  name               = "iam-for-lambda-${local.function_name_get}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


# create a role for the Lambda delete function to assume
# every service on AWS that wants to call other AWS services should first assume a role and
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "lambda-delete" {
  name               = "iam-for-lambda-${local.function_name_delete}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


# create archive file from /functions/save-note/main.py
data "archive_file" "lambda-save" {
  type        = "zip"
  source_file = "../functions/save-note/main.py"
  output_path = "save_artifact.zip"
}


# create archive file from /functions/delete-note/main.py
data "archive_file" "lambda-delete" {
  type        = "zip"
  source_file = "../functions/delete-note/main.py"
  output_path = "delete_artifact.zip"
}


# create archive file from /functions/get-notes/main.py
data "archive_file" "lambda-get" {
  type        = "zip"
  source_file = "../functions/get-notes/main.py"
  output_path = "get_artifact.zip"
}


# create a Lambda function for saving
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "save-note-30145994" {
  role             = aws_iam_role.lambda-save.arn
  function_name    = local.function_name_save
  handler          = local.handler_name
  filename         = local.artifact_name_save
  source_code_hash = data.archive_file.lambda-save.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}


# create a Lambda function for getting
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "get-notes-30145994" {
  role             = aws_iam_role.lambda-get.arn
  function_name    = local.function_name_get
  handler          = local.handler_name
  filename         = local.artifact_name_get
  source_code_hash = data.archive_file.lambda-get.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}


# create a Lambda function for deleting
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "delete-note-30145994" {
  role             = aws_iam_role.lambda-delete.arn
  function_name    = local.function_name_delete
  handler          = local.handler_name
  filename         = local.artifact_name_delete
  source_code_hash = data.archive_file.lambda-delete.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}


# create a policy for publishing save logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs-save" {
  name        = "lambda-logging-${local.function_name_save}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem"
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.lotion-30142405.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}


# create a policy for publishing getting logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs-get" {
  name        = "lambda-logging-${local.function_name_get}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:GetItem",
        "dynamodb:Query"


      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}


# create a policy for publishing deleting logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs-delete" {
  name        = "lambda-logging-${local.function_name_delete}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:DeleteItem"
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.lotion-30142405.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}


# attach the above policy to the save function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs_save" {
  role       = aws_iam_role.lambda-save.name
  policy_arn = aws_iam_policy.logs-save.arn
}


# attach the above policy to the save function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs_get" {
  role       = aws_iam_role.lambda-get.name
  policy_arn = aws_iam_policy.logs-get.arn
}


# attach the above policy to the save function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs_delete" {
  role       = aws_iam_role.lambda-delete.name
  policy_arn = aws_iam_policy.logs-delete.arn
}


# create a save Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url-save" {
  function_name      = aws_lambda_function.save-note-30145994.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}


# create a get Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url-get" {
  function_name      = aws_lambda_function.get-notes-30145994.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}


# create a delete Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url-delete" {
  function_name      = aws_lambda_function.delete-note-30145994.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}


# show the save Function URL after creation
output "lambda_url-save" {
  value = aws_lambda_function_url.url-save.function_url
}


# show the get Function URL after creation
output "lambda_url-get" {
  value = aws_lambda_function_url.url-get.function_url
}


# show the delete Function URL after creation
output "lambda_url-delete" {
  value = aws_lambda_function_url.url-delete.function_url
}

# Dynamodb table 
# read the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table
resource "aws_dynamodb_table" "lotion-30142405" {
  name         = "lotion-30142405"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  # we only need a student id to find an item in the table; therefore, we 
  # don't need a sort key here
  hash_key  = "email"
  range_key = "id"

  # the hash_key data type is string
  attribute {
    name = "email"
    type = "S"
  }

    attribute {
    name = "id"
    type = "S"
  }
}



# Tooling setup

Project requires Node and Gulp to build.

Install Node. Then use NPM to install Gulp:

      npm install -g gulp

# Environment setup

Install project dependencies with:

      npm install

# Building the project

## Dev environment

Build the project with:

      gulp

or:

      gulp dev

## Prod environment

Build the project with

      gulp prod

# Updating project packages

Install npm-check-updates globally with:

      npm install -g npm-check-updates

Then check for latest project dependencies and set versions to package.json with:

      ncu -u

Finally, update the lockfile and install the new versions with:

      npm install

# Docker

## Local builds

      docker build -t mossly.io .

## Run image in a container

      docker run -p 8080:80 mossly.io

Access the container locally at

      http://localhost:8080/

# AWS

## Configure AWS CLI

Configure an access key in AWS portal.

* Login to the portal
* Click your profile image
* Click Securty Credentials
* Under Access Keys, click "Create access key"

Configure AWS CLI with default putput format of json

      aws configure

## Connect Locally to ECR Repo

Get your AWS account ID

      aws sts get-caller-identity --query Account --output text

Connect your local Docker instance to the ECR URL:

      aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com

## Build and push

Build local image if you haven't already

      docker build -t mossly.io .

Tag it for ECR

      docker tag mossly.io:latest <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/mossly.io/frontend:latest

Push to ECR

      docker push <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/mossly.io/frontend:latest


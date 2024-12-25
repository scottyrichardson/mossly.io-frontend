# Mossly.io Frontend

This project uses NodeJS and gulp to build a deployable artifact located in `dist`. The artifact gets deployed in a Docker image to an AWS ECR registry. It is then deployed to App Runner that sits behind a CloudFront distribution.

**Build and deployment is handled automatically by CI/CD actions in this repo**. The process to manually deploy is detailed below.

## Prerequisites

- Node.js
- Docker (for containerization)
- AWS CLI (for deployment)

## NodeJS

Install required packages:

```bash
# Install Gulp
npm install -g gulp npm-check-updates

# Install project dependencies:
npm install
```

### Building the Project

```bash
gulp
# or
gulp prod
```

### Updating Dependencies

Check and update dependencies:

```bash
# Update package.json versions
ncu -u

# Install updated packages
npm install
```

## Docker

Build and tag image:

```bash
docker build -t mossly.io .
```

Run container locally:

```bash
docker run -p 8080:80 mossly.io
```

Access locally at `http://localhost:8080/`

## AWS

### CLI

1. Create access key in AWS Portal:

   - Login to AWS Portal
   - Navigate to profile → Security Credentials
   - Create new access key under "Access Keys" section

2. Configure AWS CLI with access key:

```bash
aws configure
```

### ECR (Elastic Container Registry)

1. Get AWS account ID:

```bash
aws sts get-caller-identity --query Account --output text
```

2. Authenticate with ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com
```

3. Build and push image:

```bash
# Build local image
docker build -t mossly.io .

# Tag for ECR
docker tag mossly.io:latest <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/mossly.io/frontend:latest

# Push to ECR
docker push <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/mossly.io/frontend:latest
```

### App Runner

Deploy new image to App Runner:

```bash
aws apprunner start-deployment \
            --service-arn <app-runner-service-arn> \
            --region <app-runner-region>
```

### CloudFront

Invalidate CloudFront cache:

```bash
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

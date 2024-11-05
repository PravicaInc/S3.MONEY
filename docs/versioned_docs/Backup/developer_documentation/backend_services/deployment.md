---
sidebar_position: 3
---

# Deployment

On the AWS side, set up

- An S3 bucket to store smart contracts and token icons
DynamoDB tables to store data (see the database) file for schema details)
- ECR repositories for both the backend and watcher
- AWS App Runner for the backend's deployment
- EventBridge, SQS queue, and AWS Lambda for the watcher
an IAM profile to access these services (see the sample profile)
- An IAM user for AWS access keys

Place the names of the S3 bucket and DynamoDB tables in `backend/backend-src/constants.ts` and `watcher/src/constants.ts`. For local development/testing, place the AWS credentials and region in `~/.aws/credentials` against a profile name (for example, s3moneydev).
---
sidebar_position: 5
---

# AWS Deployment

Deployment is done by creating docker images for the backend server and event watcher, and then tagging and pushing those images to AWS ECR. Substitute your AWS account id and region as appropriate in the following commands.


- First, login:

```
aws ecr get-login-password --profile s3moneydev | docker login \
  --username AWS --password-stdin 22043219.dkr.ecr.us-east-1.amazonaws.com
```

- Build and deploy the backend:

```
docker build -f Dockerfile-backend -t s3money .
docker tag s3money:latest 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-backend-dev:latest
docker push 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-backend-dev:latest
```

- Build and deploy the watcher:

```
docker build -f Dockerfile-watcher -t s3moneywatcher .
docker tag s3moneywatcher:latest 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-watcher-dev:latest
docker push 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-watcher-dev:latest
```

- Enable EventBridge's scheduler and the AWS Lambda trigger on SQS messages if needed.

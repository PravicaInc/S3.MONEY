# S3.MONEY Backend Services

## Contract Creator & Manager

This service is used to create tokens and manage the relations feature of
the service.  It depends on

* Amazon S3, to stores smart contract icons and zip files of the generated contracts
* Amazon Elastic Container Registry, for docker images used for deployment
* DynamoDB, to store information about deployed smart contracts, user roles in contracts, and relations
* App Runner, for service deployment

The service is implemented using Express JS and is written in
TypeScript.  It is deployed using a Docker image to ECR, which
automatically triggers a deployment to App Runner.  It is not meant to
be accessed by end users directly; the frontend (a separately deployed
single-page application) makes API calls using JSON as the data
format.


## Event Watcher

This service is used to fetch events from SUI's blockchain api for all
contracts deployed by the Contract Creator backend.  It runs
independently of the rest of the system; its only tasks are to fetch
events and save them in DynamoDB in a constant loop.

It depends on

* DynamoDB, to store events and balances
* EventBridge Schedule, to send a wake-up message every two minutes over SQS
* AWS Lambda, which is triggered by the SQS message

This service is also deployed using a Docker image pushed to ECR.

# Deployment

On the AWS side, set up

* an S3 bucket to store smart contracts and token icons
* DynamoDB tables to store data (see the [database](DATABASE.md)) file for schema details)
* ECR repositories for both the backend and watcher
* AWS App Runner for the backend's deployment
* EventBridge, SQS queue, and AWS Lambda for the watcher
* an IAM profile to access these services (see the [sample](SAMPLE-IAM-PROFILE.json) profile)
* an IAM user for AWS access keys

Place the names of the S3 bucket and DynamoDB tables in
`backend/backend-src/constants.ts` and `watcher/src/constants.ts`.
For local development/testing, place the AWS credentials and region in
`~/.aws/credentials` against a profile name (for example,
`s3moneydev`).

## Local Operation

Assuming an AWS credentials profile named `s3moneydev` has the access key with the policies to read/write from S3 and DynamoDB, run

    cd backend
    npm install # once
    npm run build
    env AWS_PROFILE=s3moneydev npm start

    cd watcher
    npm install # once
    npm run build-local
    while :; do env AWS_PROFILE=s3moneydev npm start; sleep 120; done

**Note**: This service depends on a Sui client binary from the
[testnet
v1.22.0](https://github.com/MystenLabs/sui/releases/tag/testnet-v1.22.0)
release to build smart contracts.  The
`backend/scripts/install-sui.sh` script executed as part of `npm
start` installs the binary in `/usr/local/bin` if it is not already
present.  The script is meant for use by the deployed backend, and
will only work on x86-64 Linux.  When running the service locally on
macOS or Windows, you will need to install the binary somewhere in
your path.

## AWS Deployment

Deployment is done by creating docker images for the backend server
and event watcher, and then tagging and pushing those images to AWS
ECR.  Substitute your AWS account id and region as appropriate in the
following commands.

First, login:

    aws ecr get-login-password --profile s3moneydev | docker login \
      --username AWS --password-stdin 22043219.dkr.ecr.us-east-1.amazonaws.com

Build and deploy the backend:

    docker build -f Dockerfile-backend -t s3money .
    docker tag s3money:latest 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-backend-dev:latest
    docker push 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-backend-dev:latest


Build and deploy the watcher:

    docker build -f Dockerfile-watcher -t s3moneywatcher .
    docker tag s3moneywatcher:latest 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-watcher-dev:latest
    docker push 22043219.dkr.ecr.us-east-1.amazonaws.com/s3m-watcher-dev:latest

Enable EventBridge's scheduler and the AWS Lambda trigger on SQS messages if needed.


## Environment Variables
To run the server, you need to set up environment variables. These variables are stored in a file named .env in the root directory of the project. A sample .env.example file is provided with all the required variables.

##### Setting Up .env File
Start by copying the .env.example file to create your .env file.
You can do this manually or use a command-line tool:
``` bash
cp .env.example .env
```
Open the .env file in a text editor and fill in the values for each variable according to your environment and configuration. After filling in the required variables, save the .env file.
##### Important Notes: 
Treat .env file as confidential and do not commit it to version control systems like Git.
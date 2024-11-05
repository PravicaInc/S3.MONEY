---
sidebar_position: 1
---

# Contract Creator & Manager

This service is used to create tokens and manage the relations feature of the service. It depends on

- Amazon S3, to stores smart contract icons and zip files of the generated contracts
- Amazon Elastic Container Registry, for docker images used for deployment
- DynamoDB, to store information about deployed smart contracts, user roles in contracts, and relations
- App Runner, for service deployment

The service is implemented using Express JS and is written in TypeScript. It is deployed using a Docker image to ECR, which automatically triggers a deployment to App Runner. It is not meant to be accessed by end users directly; the frontend (a separately deployed single-page application) makes API calls using JSON as the data format.

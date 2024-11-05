---
sidebar_position: 2
---

# Event Watcher

This service is used to fetch events from SUI's blockchain api for all contracts deployed by the Contract Creator backend. It runs independently of the rest of the system; its only tasks are to fetch events and save them in DynamoDB in a constant loop.

It depends on

- DynamoDB, to store events and balances
- EventBridge Schedule, to send a wake-up message every two minutes over SQS
- AWS Lambda, which is triggered by the SQS message

This service is also deployed using a Docker image pushed to ECR.

---
sidebar_position: 4
---

# Local Operation

Assuming an AWS credentials profile named s3moneydev has the access key with the policies to read/write from S3 and DynamoDB, run

```
cd backend
npm install # once
npm run build
env AWS_PROFILE=s3moneydev npm start

cd watcher
npm install # once
npm run build-local
while :; do env AWS_PROFILE=s3moneydev npm start; sleep 120; done
```

**Note**: This service depends on a Sui client binary from the testnet v1.22.0 release to build smart contracts. The backend/scripts/install-sui.sh script executed as part of npm start installs the binary in /usr/local/bin if it is not already present. The script is meant for use by the deployed backend, and will only work on x86-64 Linux. When running the service locally on macOS or Windows, you will need to install the binary somewhere in your path.

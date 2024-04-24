---
sidebar_position: 2
---

# Create new stablecoin

![Create New Stablecoin](@site/static/img/create-new-stablecoin-flow.png)

- The user links their wallet to the frontend and completes a form outlining the token they wish to create.
- The frontend sends this contract data to the backend via the /create endpoint
- The contract details, including ticker, names, and roles, are sent as JSON format. This JSON data is verified, and based on it, a smart contract is generated.
- The backend uses the sui command-line tool to save the data in DynamoDB, uploads a zip file of the contract to Amazon S3, and then sends the compiled data back to the frontend.
- If the user decides to cancel the deployment, the frontend calls the /cancel endpoint on the backend, removing the contract details from DynamoDB and Amazon S3.
- If the contract is successfully deployed on the blockchain, the frontend receives deployment transaction details from the wallet and forwards them to the backend using the /published endpoint. 

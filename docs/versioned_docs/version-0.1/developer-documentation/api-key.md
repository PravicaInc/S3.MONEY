---
sidebar_position: 2
---

# Dev API Key

As a developer integrating with S3.money, it's crucial to understand how to securely authenticate your requests using the API key. This document outlines the steps to obtain an authentication token and use it for accessing backend APIs.

## Step 1: Obtain Your API Key

Before you can authenticate, ensure you have your API key from the S3.money platform. Refer to the [documentation](./api-key-sharing.md) on how to securely share and retrieve your API key.

## Step 2: Authenticate with the API Key

To authenticate your requests, you first need to obtain an authorization token using your API key. Use the following endpoint to do so:

### Request

Send a GET request to the endpoint, including your API key in the request headers. Do update the `<BASE_URL>` and `<YOUR_API_KEY_HERE>` with the URL, and your API key you retrieved from step 1.

```curl
curl --location '<BASE_URL>/v2/apiKey/authenticateWithApiKey' \
  --header 'api-key: <YOUR_API_KEY_HERE>'
```

### Response

You will get a response

```json
{
  "status": "ok",
  "token": "your_generated_auth_token"
}
```

## Step 3: Using token & API key

Once you have the auth token, you can use it alongside your API key to authenticate your requests to the backend APIs. All requests to the backend should include both the API key and the auth token in the headers.

### Example request

Do update the `<BASE_URL>`, `<AUTH_TOKEN>` and `<YOUR_API_KEY_HERE>` with the URL, token, and your API key.

```curl
curl --location '<BASE_URL>/v2/stablecoins/list/' \
--header 'Authorization: Bearer <AUTH_TOKEN>' \
--header 'api-key: <YOUR_API_KEY_HERE>'
```

For a comprehensive list of available API endpoints and detailed documentation, please refer to our [Exposed APIs](/api).

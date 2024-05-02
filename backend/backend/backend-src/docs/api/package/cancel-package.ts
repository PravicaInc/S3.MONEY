export default module.exports = {
  post: {
    tags: ['Package'],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
              },
              ticker: {
                type: 'string',
                example: '$TCs',
              },
              decimals: {
                type: 'number',
                example: 8,
              },
              created: {
                type: 'boolean',
                example: false,
              },
              initialSupply: {
                type: 'string',
                example: '1000',
              },
              maxSupply: {
                type: 'string',
                example: '1000000',
              },
              txid: {
                type: 'string',
                example: '0x1234567890abcdef',
              },
              package_zip: {
                type: 'string',
                example: 'https://example.com/package.zip',
              },
              packageName: {
                type: 'string',
                example: 'test-package',
              },
              icon_url: {
                type: 'string',
                example: 'https://example.com/icon.png',
              },
              ticker_name: {
                type: 'string',
                example: 'Test Ticker',
              },
            },
            additionalProperties: false,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'ok',
                },
                message: {
                  type: 'string',
                  example: 'deleted',
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Invalid input',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'error',
                },
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
}

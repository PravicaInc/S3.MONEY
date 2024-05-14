export default module.exports = {
  post: {
    tags: ['Package'],
    deprecated: true,
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'address',
              'ticker',
              'decimals',
              'created',
              'initialSupply',
              'maxSupply',
              'packageRoles',
              'data',
            ],
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
                type: 'integer',
                example: 8,
              },
              txid: {
                type: 'string',
                example: '0x1234567890abcdef',
              },
              data: {
                type: 'object',
                properties: {
                  digest: {
                    type: 'string',
                    example: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
                  },
                  confirmedLocalExecution: {
                    type: 'boolean',
                    example: true,
                  },
                  transaction: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          messageVersion: {
                            type: 'string',
                            example: 'v1',
                          },
                          sender: {
                            type: 'string',
                            example: '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73',
                          },
                        },
                      },
                    },
                  },
                },
              },
              created: {
                type: 'boolean',
                example: true,
              },
              initialSupply: {
                type: 'string',
                example: '1000',
              },
              maxSupply: {
                type: 'string',
                example: '1000000',
              },
              packageRoles: {
                type: 'object',
                required: ['burn', 'cashIn', 'cashOut', 'freeze', 'mint', 'pause'],
                properties: {
                  mint: {
                    type: 'string',
                    example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                  },
                  burn: {
                    type: 'string',
                    example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                  },
                  freeze: {
                    type: 'string',
                    example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                  },
                  pause: {
                    type: 'string',
                    example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                  },
                  cashIn: {
                    type: 'string',
                    example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                  },
                  cashOut: {
                    type: 'string',
                    example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Successful Package creation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'ok' },
                message: { type: 'string', example: 'saved' },
              },
            },
          },
        },
      },
      '400': {
        description: 'Error in package creation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'error' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

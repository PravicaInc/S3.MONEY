export default module.exports = {
  get: {
    tags: ['Package'],
    parameters: [
      {
        in: 'path',
        name: 'address',
        required: true,
        schema: {
          type: 'string',
          example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        },
      },
      {
        in: 'path',
        name: 'param',
        required: true,
        schema: {
          type: 'string',
          example: '$TCs',
        },
      },
      {
        in: 'query',
        name: 'summary',
        schema: {
          type: 'boolean',
          example: true,
        },
      },
    ],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'ok' },
                packages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      package_name: { type: 'string', example: 'test-package' },
                      decimals: { type: 'number', example: 8 },
                      maxSupply: { type: 'string', example: '1000000' },
                      initialSupply: { type: 'string', example: '1000' },
                      address_roles: {
                        type: 'string',
                        example: '[burn,cashOut,freeze,deployer,cashIn,mint,pause]',
                      },
                      package_zip: {
                        type: 'string',
                        example: 'packages/0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e/tcs.zip',
                      },
                      icon_url: { type: 'string', example: 'https://example.com/icon.png' },
                      ticker: { type: 'string', example: '$TCs' },
                      txid: { type: 'string', example: '0x1234567890abcdef' },
                      deploy_status: { type: 'string', example: 'published' },
                      deploy_date: { type: 'string', example: '2024-05-02T11:56:52.087Z' },
                      package_roles: {
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
                      },
                      deploy_addresses: {
                        type: 'object',
                        properties: {
                          packageId: {
                            type: 'string',
                            example: '',
                          },
                          token_policy: {
                            type: 'string',
                            example: '',
                          },
                          token_supply: {
                            type: 'string',
                            example: '',
                          },
                          treasury_cap: {
                            type: 'string',
                            example: '',
                          },
                          token_policy_cap: {
                            type: 'string',
                            example: '',
                          },
                          pauser: {
                            type: 'string',
                            example: '',
                          },
                          deployer: {
                            type: 'string',
                            example: '',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Error response',
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

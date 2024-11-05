export default module.exports = {
  post: {
    tags: ['Package'],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'address',
              'decimals',
              'description',
              'fileName',
              'icon_url',
              'initialSupply',
              'maxSupply',
              'name',
              'network',
              'packageName',
              'roles',
              'ticker',
            ],
            properties: {
              ticker: {
                type: 'string',
                example: '$TSC',
              },
              network: {
                type: 'string',
                example: 'mainnet',
              },
              name: {
                type: 'string',
                example: 'Test Stablecoin',
              },
              decimals: {
                type: 'integer',
                example: 8,
              },
              address: {
                type: 'string',
                example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
              },
              initialSupply: {
                type: 'string',
                example: '1000',
              },
              maxSupply: {
                type: 'string',
                example: '1000000',
              },
              fileName: {
                type: 'string',
                example: 'file.png',
              },
              roles: {
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
              packageName: {
                type: 'string',
                example: 'test-package',
              },
              description: {
                type: 'string',
                example: 'Test description',
              },
              icon_url: {
                type: 'string',
                example: 'https://example.com/icon.png',
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
                status: {
                  type: 'string',
                  example: 'ok',
                },
                modules: {
                  type: 'string',
                  example:
                    '[LgQICDIMCGw2eAgIOoAIAAHgEJAAlDYXNoSW5DYXALVHJlYXNCAgCBAUABwABAAAEB]',
                },
                dependencies: {
                  type: 'string',
                  example:
                    '["0x0000000000000000000000000000001","0x0000000000000000000000000000000000000000000002"]',
                },
                error: {
                  type: 'string',
                  example: '',
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Package already published',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Bad Request',
                },
                message: {
                  type: 'string',
                  example: 'package already published',
                },
              },
            },
          },
        },
      },
    },
  },
};

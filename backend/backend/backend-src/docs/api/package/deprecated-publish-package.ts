export default module.exports = {
  post: {
    tags: ['Package'],
    deprecated: true,
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['address', 'ticker', 'decimals', 'created', 'initialSupply', 'maxSupply', 'packageRoles'],
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
                status: {type: 'string', example: 'ok'},
                message: {type: 'string', example: 'saved'},
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
                status: {type: 'string', example: 'error'},
                message: {type: 'string'},
              },
            },
          },
        },
      },
    },
  },
}

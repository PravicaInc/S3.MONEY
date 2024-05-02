export default module.exports = {
  get: {
    tags: ['Events'],
    deprecated: true,
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
    ],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {type: 'string', example: 'ok'},
                balances: {
                  type: 'object',
                  properties: {
                    balance: {type: 'number', example: 29000},
                    last_timestamp: {type: 'string', example: '2024-04-15T14:10:21.688Z'},
                    ticker: {type: 'string', example: '$TC'},
                    address_package: {
                      type: 'string',
                      example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e::tc',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Invalid address',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {type: 'string', example: 'error'},
                message: {type: 'string', example: 'invalid address: <address>'},
              },
            },
          },
        },
      },
    },
  },
}

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
          description: 'The address for which to get allocations',
        },
        example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      {
        in: 'path',
        name: 'ticker',
        required: true,
        schema: {
          type: 'string',
          description: 'The ticker symbol of the token',
        },
        example: '$TC',
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
                events: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      allocation_type: {type: 'string', example: 'allocated'},
                      amount: {type: 'number', example: 100},
                      last_timestamp: {type: 'string', example: '2024-04-15T14:10:21.688Z'},
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

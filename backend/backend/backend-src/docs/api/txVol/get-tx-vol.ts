export default module.exports = {
  get: {
    tags: ['Tx Volume'],
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
        name: 'ticker',
        required: true,
        schema: {
          type: 'string',
          example: 'TOKEN',
        },
      },
      {
        in: 'query',
        name: 'range',
        required: true,
        schema: {
          type: 'string',
          description: 'The range for which to get transaction volume (e.g., "1 day", "1 week")',
        },
        example: '1 day',
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
                addressPackage: {
                  type: 'string',
                  example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e::Token A',
                },
                volumes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      timestamp: {type: 'string', example: '2024-04-29T12:00:00Z'},
                      volume: {type: 'number', example: 100},
                    },
                  },
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Invalid request',
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

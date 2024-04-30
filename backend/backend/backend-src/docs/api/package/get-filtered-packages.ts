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
          example: 'ETH',
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
                status: {type: 'string', example: 'ok'},
                packages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      packageName: {type: 'string', example: 'test-package'},
                      address: {
                        type: 'string',
                        example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                      },
                      created: {type: 'boolean', example: true},
                      icon_url: {type: 'string', example: 'https://example.com/icon.png'},
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

export default module.exports = {
  get: {
    tags: ['Package'],
    deprecated: true,
    parameters: [
      {
        in: 'path',
        name: 'address',
        required: true,
        schema: {
          type: 'string',
          description: 'The address of the package',
        },
        example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      {
        in: 'query',
        name: 'summary',
        schema: {
          type: 'boolean',
          description: 'Flag to include summary information',
        },
        example: true,
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

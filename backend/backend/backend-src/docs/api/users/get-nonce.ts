export default module.exports = {
  get: {
    tags: ['Users'],
    parameters: [
      {
        in: 'path',
        name: 'address',
        required: true,
        schema: {
          type: 'string',
          example:
            '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        },
        description: 'The address of the user',
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
                status: {
                  type: 'string',
                  example: 'ok',
                },
                nonce: {
                  type: 'string',
                  example:
                    '6d8777ce145b82be7f3828513f1603a98abd0c1cd8bcdc8fbc926e7ffbe5bebc',
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
                status: {
                  type: 'string',
                  example: 'error',
                },
                message: {
                  type: 'string',
                  example: 'Error message',
                },
              },
            },
          },
        },
      },
    },
  },
};

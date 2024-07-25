export default module.exports = {
  post: {
    tags: ['Users'],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              nonce: {
                type: 'string',
                example:
                  '6d8777ce145b82be7f3828513f1603a98abd0c1cd8bcdc8fbc926e7ffbe5cbebc',
              },
              signature: {
                type: 'string',
                example:
                  '$ALq8/y+jx8Iq3R04fsGitPZyKnkMyBPOYsbUxdjR9ZBYgLcmqHmBE8SAIPtufIEGOtSTSK7M91KKht8OgmLdX8QXnvKTN1RkegX1/UlEagqiZa5PhfNPDTU8RVtnz4x8klw==',
              },
            },
            additionalProperties: false,
          },
        },
      },
    },
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
                token: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg1MjhmMDIyMjZhMWZkNDk5NDNjNTg1ZDk4YWZkZTVlNWFiMDMwNjI4OTJjOGI4MTA0ZjkzOWZmZWVkMGY1ZjZkIiwiaWF0IjoxNzIxODU0NzkzfQ.HrFdOdYDnC8YTEurwjHBXlS_ffoHAT9nkDyN1MOIVsE',
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Bad Request',
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
                  example: 'Nonce not found',
                },
              },
            },
          },
        },
      },
      '500': {
        description: 'Internal Server Error',
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
                  example: 'Nonce not found',
                },
              },
            },
          },
        },
      },
    },
  },
};

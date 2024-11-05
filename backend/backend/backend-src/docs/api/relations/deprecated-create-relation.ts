export default module.exports = {
  post: {
    tags: ['Relation'],
    deprecated: true,
    parameters: [
      {
        in: 'path',
        name: 'pkgAddress',
        required: true,
        schema: {
          type: 'string',
          example: '0xd744a3c19ff687bc0b953a245c5b7bb1abd69bb56587a8249a92dfa110e85ee7',
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Treasury' },
              address: {
                type: 'string',
                format: 'address',
                example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
              },
            },
            required: ['label', 'address'],
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
                status: { type: 'string', example: 'ok' },
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

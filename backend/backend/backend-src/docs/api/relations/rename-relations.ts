export default module.exports = {
  patch: {
    tags: ['Relation'],
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
      {
        in: 'path',
        name: 'slug',
        required: true,
        schema: {
          type: 'string',
          example: 'treasury',
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
              label: { type: 'string', example: 'New Label' },
            },
            required: ['label'],
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


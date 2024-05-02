export default module.exports = {
  get: {
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
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {type: 'string', example: 'ok'},
                related: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      slug: {type: 'string', example: 'treasury'},
                      wallet_address: {
                        type: 'string',
                        example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                      },
                      label: {type: 'string', example: 'Treasury'},
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

export default module.exports = {
  post: {
    tags: ['Package'],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['address', 'fileName'],
            properties: {
              address: {
                type: 'string',
                example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
              },
              fileName: {
                type: 'string',
                example: 'icon.png',
              },
            },
            additionalProperties: false,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Successful presigned URL generation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {type: 'string', example: 'ok'},
                url: {type: 'string', format: 'uri', example: 'https://example.com/presigned-url'},
              },
            },
          },
        },
      },
      '400': {
        description: 'Error in generating presigned URL',
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

export default module.exports = {
  get: {
    tags: ['Environment'],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {type: 'string', example: 'ok'},
              },
            },
          },
        },
      },
    },
  },
}

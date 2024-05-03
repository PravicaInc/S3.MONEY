export default module.exports = {
  get: {
    tags: ['Events'],
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
                events: {
                  type: 'object',
                  properties: {
                    status: {type: 'string', example: 'ok'},
                    events: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          address_package: {
                            type: 'string',
                            example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e::tc',
                          },
                          ticker: {
                            type: 'string',
                            example: '$TC',
                          },
                          amount: {
                            type: 'number',
                            example: 29999999990,
                          },
                          sender: {
                            type: 'string',
                            example: '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73',
                          },
                          package_address: {
                            type: 'string',
                            example: '0x5b4bb859db014ea8bb75c87f2cd03e4b90a3182f92ff1f13d1975204f34cb863::tc',
                          },
                          recipient: {
                            type: 'string',
                            example: '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
                          },
                          event: {
                            type: 'string',
                            example: 'EventMint',
                          },
                        },
                      },
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

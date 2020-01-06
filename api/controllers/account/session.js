module.exports = {


  friendlyName: 'Session',


  description: 'Session account.',


  inputs: {
    appToken: {
      required: true,
      type: 'string',
      description: 'App Authentication Key'
    }
  },


  exits: {
    empty: {
      statusCode: 401
    },
    invalid: {
      statusCode: 401
    },
    success: {
      statusCode: 200
    },
  },


  fn: async function (inputs, exits) {

    const token = inputs.appToken;

    if (!token) {
      return exits.empty({
        message: 'Unauthenticated'
      });
    }

    user = await User.findOne({
      appToken: token
    });

    if (!user) {
      return exits.invalid({
        message: 'Invalid app token'
      });
    }

    // All done.
    return exits.success({
      success: true,
      message: 'Session restored',
      user: user,
      token: token
    });

  }


};

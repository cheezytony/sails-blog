const bcrypt = require('bcrypt');

module.exports = {


  friendlyName: 'Login',


  description: 'Login account.',


  inputs: {

    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }

  },


  exits: {
    invalid: {
      statusCode: 409,
      description: 'Invalid login details'
    },
    success: {
      statusCode: 200,
      description: 'Login successful'
    }
  },


  fn: async function (inputs, exits) {

    var user = await User.findOne({
      email: inputs.email
    });

    if (!user) {
      return exits.invalid({
        success: false,
        message: 'Invalid email',
        errors: {
          email: 'Invalid email'
        }
      });
    }

    if (!bcrypt.compareSync(inputs.password, user.password)) {
      return exits.invalid({
        success: false,
        message: 'Invalid password',
        errors: {
          password: 'Invalid password'
        }
      });
    }

    const token = bcrypt.hashSync((new Date).toString(), 10);

    // Update User Token
    user = await User.updateOne({
      email: user.email
    }).set({
      appToken: token
    });

    // All done.
    return exits.success({
      success: true,
      message: 'Logged in',
      user: user
    });


  }


};

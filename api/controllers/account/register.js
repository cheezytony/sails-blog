const bcrypt = require('bcrypt');

module.exports = {


  friendlyName: 'Register',


  description: 'Register account.',


  inputs: {

    firstName: {
      type: 'string',
      required: true,
      description: ''
    },
    lastName: {
      type: 'string',
      required: true,
      description: ''
    },
    email: {
      type: 'string',
      required: true,
      description: ''
    },
    phone: {
      type: 'string',
      required: true,
      description: ''
    },
    dateOfBirth: {
      type: 'string',
      required: true,
      description: ''
    },
    password: {
      type: 'string',
      required: true,
      description: ''
    }

  },


  exits: {
    invalid: {
      statusCode: 409,
      description: 'Unable to create error'
    },
    success: {
      statusCode: 200,
      description: 'User created successfully'
    }
  },


  fn: async function (inputs, exits) {

    var user;
    var error;

    const token = bcrypt.hashSync((new Date).toString(), 10);

    try {
      user = await User.create({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        phone: inputs.phone,
        dateOfBirth: inputs.dateOfBirth,
        password: bcrypt.hashSync(inputs.password, 10),
        appToken: token
      }).fetch();

      console.log(user);

    } catch(e) {
      // statements
      console.log(e);
      error = e;
    }

    // Error Occured
    if (!user) {
      return exits.invalid({
        message: 'Unable to create user',
        error
      });
    }

    // All done.
    return exits.success({
      message: 'User created',
      user
    });

  }


};

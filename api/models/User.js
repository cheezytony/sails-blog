/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    firstName: {
      type: 'string',
      required: true,
    },
    lastName: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      unique: true,
    },
    phone: {
      type: 'string',
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    emailVerifiedAt: {
      type: 'number',
      required: false
    },
    appToken: {
      type: 'string',
      required: false
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    posts: {
      collection: 'post',
      via: 'user'
    },
    like: {
      collection: 'like',
      via: 'user'
    },
    comments: {
      collection: 'comment',
      via: 'user'
    },
    commentslikes: {
      collection: 'commentlike',
      via: 'user'
    },
    replies: {
      collection: 'reply',
      via: 'user'
    }

  },

  validationMessages: {
    email: {
      required: 'please provide your email address',
      unique: 'this email address has already been registered',
    },
    phone: {
      required: 'please provide your phone number',
      unique: 'this phone number has already been registered',
    },
  },


  customToJSON: function() {
    return _.omit(this, ['password', 'appToken']);
  },


};


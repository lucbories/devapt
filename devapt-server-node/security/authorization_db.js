'use strict';

var databases = require('../models/databases'),
    Q = require('q'),
    models = require('../models/models')
    ;


// EXPORT AUTHENTICATION OBJECT
module.exports = {
  init: function(arg_server)
  {
    // this.ready_promise = ;
    
    return this.ready_promise;
  },
  
  
  authenticate: function(arg_login, arg_password)
  {
    var query = {
      where: { 'login': arg_login },
      attributes: ['login', 'password']
    };
    
    var success_cb = function(arg_user)
    {
      console.log(arg_user, 'authenticate.user');
      if (arg_user.password === arg_password)
      {
        return true;
      }
      return false;
    };
    
    var failure_cb = function()
    {
      return false;
    };
    
    var promise = users_model.findOne(query);
    promise.then(success_cb, failure_cb);
    
    return promise;
  },
  
  
  login: function(arg_login, arg_password)
  {
    return this.authenticate(arg_login, arg_password);
  },
  
  
  logout: function(arg_login)
  {
    return Q(false);
  },
  
  
  get_token: function(arg_login, arg_password)
  {
    return Q(null);
  },
  
  
  renew_token: function(arg_login, arg_token)
  {
    return Q(null);
  },
  
  
  check_token: function(arg_login, arg_token)
  {
    return Q(null);
  }
};
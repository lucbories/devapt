'use strict';

var lowdb = require('lowdb'),
    Q = require('q'),
    
    apps_config = require('../../apps/apps.json')
    ;


var jsonfile = apps_config.security.authentication.file;
var app_base_path = '../';
var json_full_path = app_base_path + 'devapt-tutorial-1/private/' + jsonfile;
// console.info(json_full_path, 'jsonfile path');

// OPEN DATABASE
var db_settings = {
  autosave:true,
  async:true
};
var db = lowdb(json_full_path, db_settings);



// EXPORT AUTHENTICATION OBJECT
module.exports = {
  init: function(arg_server)
  {
    console.info('init authentication (jsonfile)');
    return Q(true);
  },
  
  
  authenticate: function(arg_login, arg_password)
  {
    // console.log(arg_login, 'authenticate:arg_login');
    // console.log(arg_password, 'authenticate:arg_password');
    
    var query = {
      'login': arg_login
    };
    
    var success_cb = function(arg_user, arg_pwd)
    {
      // console.log(arg_user, 'authenticate.user found');
      if (arg_user.password === arg_pwd)
      {
        return true;
      }
      
      // console.log(arg_user.password, 'arg_user.password');
      // console.log(arg_pwd, 'arg_password');
      return false;
    };
    
    try{
      var users = db('users').find(query);
      // console.log(users, 'authenticate.users');
      
      if (users)
      {
        var result = success_cb(users, arg_password);
        return Q(result);
      }
    }
    catch(e)
    {
    }
    
    // console.log(query, 'authenticate.user not found');
    return Q(false);
  },
  
  
  login: function(arg_login, arg_password)
  {
    return this.authenticate(arg_login, arg_password);
  }/*,
  
  
  logout: function(arg_login)
  {
    return Q(false);
  },
  
  
  get_token: function(arg_login, arg_password)
  {
    return null;
  },
  
  
  renew_token: function(arg_login, arg_token)
  {
    return null;
  },
  
  
  check_token: function(arg_login, arg_token)
  {
    return null;
  }*/
};
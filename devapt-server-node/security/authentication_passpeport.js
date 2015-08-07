'use strict';

var Sequelize = require('sequelize'),
    passport = require('passport'),
    q = require('q'),
    LocalStrategy = require('passport-local').Strategy,
    auth_db_api = require('./authentication_db'),
    app_config = require('../config/app_config');


/*
    // GET APP CONFIG
    var cfg_auth = app_config.application.security.authentication;
    // console.log(cfg_auth, 'cfg_auth');
    
    var cfg_auth_cx = app_config.application.connexions[cfg_auth.connexion];
    // console.log(cfg_auth_cx, 'cfg_auth_cx');
    
    var settings = {
      usernameField: 'login',
      passwordField: 'password'
    };
    
    var authenticate_cb =  function(arg_login, arg_password, done) {
        auth_db_api.authenticate(arg_login, arg_password).then
        auth_db_api.users_model.findOne({ username: arg_login },
          function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(arg_password)) { return done(null, false); }
            return done(null, user);
          });
      };
    var local_strategy = new LocalStrategy(settings, authenticate_cb);
    
passport.use(local_strategy);



app.use(passport.initialize());
// app.use(passport.session());


passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser())


*/


// EXPORT AUTHENTICATION OBJECT
module.exports = {
  
  init: function(arg_app, arg_server)
  {
    return q.defer().resolve(false);
  },
  /*
  authenticate: function(arg_login, arg_password)
  {
    return false;
  },
  
  login: function(arg_login, arg_password)
  {
    return false;
  },
  
  logout: function(arg_login)
  {
    return false;
  },
  
  get_token: function(arg_login, arg_password)
  {
    return null;
  },
  
  renew_token: function(arg_login, arg_token)
  {
    return null;
  }*/
};
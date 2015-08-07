'use strict';

var Sequelize = require('sequelize'),
    app_config = require('../config/app_config');


// GET APP CONFIG
var cfg_auth = app_config.application.security.authentication;
// console.log(cfg_auth, 'cfg_auth');

var cfg_auth_cx = app_config.application.connexions[cfg_auth.connexion];
// console.log(cfg_auth_cx, 'cfg_auth_cx');
  
var cfg_auth_db_name = cfg_auth_cx.database_name;
var cfg_auth_db_user = cfg_auth_cx.user_name;
var cfg_auth_db_password = cfg_auth_cx.user_pwd;
var cfg_auth_db_options = {
  dialect:'mysql', // TODO TRADUCE SETTING DRIVER TO DIALECT
  host:cfg_auth_cx.host,
  port:cfg_auth_cx.port
};

// DEFINE AUTH DATABASE
var auth_db = new Sequelize(cfg_auth_db_name, cfg_auth_db_user, cfg_auth_db_password, cfg_auth_db_options);


// EXPORT AUTHENTICATION DATABASE
module.exports = auth_db;
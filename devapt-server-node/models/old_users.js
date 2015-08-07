'use strict';

var Sequelize = require('sequelize'),
    databases = require('./databases'),
    app_config = require('../config/app_config');


// GET APP CONFIG
// var cfg_auth = app_config.application.security.authentication;
var auth_db = databases.get_auth_database();
// console.log(auth_db, 'auth_db');


// DEFINE USER MODEL
this.users_id_field_name = 'id_user';

var users_fields = {
  users_id_user: { field:'id_user', type:Sequelize.INTEGER, primaryKey:true, autoIncrement: true },
  users_login: { field:'login', type:Sequelize.STRING, unique:true, allowNull: false },
  users_firstname: { field:'firstname', type:Sequelize.STRING, allowNull: false },
  users_lastname: { field:'lastname', type:Sequelize.STRING, allowNull: false },
  users_email: { field:'email', type:Sequelize.STRING, validate: {isEmail:true}, allowNull: false  },
  users_password: { field:'password', type:Sequelize.STRING, allowNull: false }
};

var users_settings = {
  timestamps: false,
  tableName: 'users'
};


// CREATE MODEL
var User = auth_db ? auth_db.sequelize.define('User', users_fields, users_settings) : null;


// GET PRIMARY KEY NAME
// var pk_name = User.primaryKeyAttribute;


// EXPORT AUTHENTICATION OBJECT
module.exports = User;
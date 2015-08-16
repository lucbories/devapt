'use strict';

var Sequelize = require('sequelize'),
    Q = require('q'),
    databases = require('./databases'),
    assert = require('assert'),
    app_config = require('../config/app_config');


// INIT DATABASES REPOSITORY
var models = {};
var associations = [];


// GET MODELS
var cfg_models = app_config.application.models;


// EXPORT API
module.exports = {
  init: function(arg_server)
  {
    var self = this;
    
    console.log('init models');
    
    // LOAD MODELS
    console.log('load models');
    Object.keys(cfg_models).forEach(
      function(arg_value, arg_index, arg_array)
      {
        // if ( !!!arg_value.autoload )
        // {
          self.load_model(arg_value, arg_server, false);
        // }
      }
    );
    
    // LOAD ASSOCIATIONS
    console.log('load models associations');
    var association_record = null;
    associations.forEach(
      function(arg_value, arg_index, arg_array)
      {
        association_record = associations[arg_index];
        self.load_association(association_record);
      }
    );
    
    return Q(true);
  },
  
  
  /*
    // ASSOCIATION CONFIGURATION RECORD FORMAT
        EXAMPLE OF roles ASSOCIATION LOADED CONFIGURATION
          associations.roles.mode=many_to_many
          associations.roles.model=MODEL_AUTH_MANY_USERS_ROLES
          associations.roles.left_key=id_user
          associations.roles.right_model=MODEL_AUTH_USERS_ROLES
          associations.roles.right_key=id_role
          associations.roles.right_fields[]=roles_id_role
          associations.roles.right_fields[]=role_label
          
        AUTO FILLED BY MODEL LOADING:
          associations.roles.left_model=...
          associations.roles.left_table=...
   */
  load_association: function(arg_asso_cfg)
  {
    var self = this;
    
    // console.log(arg_asso_cfg, 'arg_asso_cfg');
    
    // GET ASSOCIATION MODE
    var mode = arg_asso_cfg.mode;
    
    // GET LEFT PART
    var left_model_name = arg_asso_cfg.left_model;
    var left_model_record = self.get_model(left_model_name);
    var left_model_key = arg_asso_cfg.left_key;
    assert.ok(left_model_record && left_model_record.model, 'bad association left model for name [' + left_model_name + ']');
    var left_model_obj = left_model_record.model;
    
    // GET RIGHT PART
    var right_model_name = arg_asso_cfg.right_model;
    var right_model_record = self.get_model(right_model_name);
    var right_model_key = arg_asso_cfg.right_key;
    var right_model_fields = arg_asso_cfg.right_fields;
    assert.ok(right_model_record && right_model_record.model, 'bad association right model for name [' + right_model_name + ']');
    var right_model_obj = right_model_record.model;
    
    // GET MANY PART
    var many_model_name = arg_asso_cfg.model;
    var many_model_obj = self.get_model(many_model_name);
    assert.ok(many_model_obj && many_model_obj.model, 'bad association many model for name [' + many_model_name + ']');
    many_model_obj = many_model_obj.model;
    
    
    if (mode === 'many_to_many')
    {
      // console.log('add many_to_many with %s: left:%s right:%s', many_model_table, left_model_table, right_model_table);
      
      // SET ASSOCIATION ON THE LEFT SIDE (QUERYABLE MODEL)
      var asso_settings_left = {
        through: {
          model:many_model_obj
        },
        as:arg_asso_cfg.name,
        foreignKey: left_model_key,
        constraints: false
      };
      left_model_record.includes.push( { model: right_model_obj, as:arg_asso_cfg.name, attributes:right_model_fields } );
      left_model_obj.belongsToMany(right_model_obj, asso_settings_left);
      
      
      // SET RIGHT ASSOCIATION
      var asso_settings_right = {
        through: {
          model:many_model_obj
        },
        foreignKey: right_model_key,
        constraints: false
      };
      right_model_obj.belongsToMany(left_model_obj, asso_settings_right);
    }
  },
  
  
  load_fields: function(arg_model_name, arg_crud_table, arg_fields_cfg)
  {
    console.info('loading fields for model', arg_model_name);
    
    var self = this;
    
    var cfg_field = null;
    var cfg_type = null;
    var cfg_label = null;
    var cfg_is_editable = false
    var cfg_is_visible = true
    var cfg_sql_is_primary_key = false
    var cfg_sql_is_expression = false
    var cfg_sql_column = null;
    var cfg_sql_table = null;
    
    var fields = {};
    
    var field = null;
    
    Object.keys(arg_fields_cfg).forEach(
      function(arg_value, arg_index, arg_array)
      {
        cfg_field = arg_fields_cfg[arg_value];
        
        cfg_type = self.get_field_type(cfg_field.type);
        cfg_label = cfg_field.label;
        cfg_is_editable = self.to_boolean(cfg_field.is_editable, false);
        cfg_is_visible = self.to_boolean(cfg_field.is_visible, true);
        cfg_sql_is_primary_key = self.to_boolean(cfg_field.sql_is_primary_key, false);
        cfg_sql_is_expression = self.to_boolean(cfg_field.sql_is_expression, false);
        cfg_sql_column = cfg_field.sql_column;
        cfg_sql_table = cfg_field.sql_table ? cfg_field.sql_table : arg_crud_table;
        
        if (cfg_sql_table === arg_crud_table)
        {
          field = {
            field: cfg_sql_column ? cfg_sql_column : arg_value,
            type:cfg_type,
            primaryKey: cfg_sql_is_primary_key,
            autoIncrement:cfg_sql_is_primary_key,
            allowNull:false
          };
        }
        else
        {
          console.error('bad model [%s] configuration for field [%s]', arg_model_name, arg_value);
          console.log(cfg_field, 'cfg_field');
          console.log(cfg_sql_table, 'cfg_sql_table');
          throw Error('error');
          return;
        }
        
        fields[arg_value] = field;
        // console.log(field, 'field');
      }
    );
    
    return fields;
  },
  
  
  load_model: function(arg_model_name, arg_server, arg_load_associations)
  {
    console.info('loading model', arg_model_name);
    
    var self = this;
    
    if (arg_model_name in cfg_models)
    {
      var cfg_model = cfg_models[arg_model_name];
      var cfg_fields = cfg_model.fields;
      // console.log(cfg_model, 'cfg_model');
      
      
      // var driver = cfg_model.driver // IGNORED: NOT USED ON NODES
      var cx_name = cfg_model.connexion;
      // var engine_name = cfg_model['engine.name']; // IGNORED, FOR CLIENT ONLY
      // var engine_source= cfg_model['engine.source']; // IGNORED, FOR CLIENT ONLY
      
      
      // GET ASSOCIATIONS
      var cfg_associations = cfg_model.associations;
      // console.log(cfg_associations, 'cfg_associations');
      // var includes = [];
      
      
      // SET ACCESS
      var role_read = cfg_model.role_read;
      var role_create = cfg_model.role_create;
      var role_update = cfg_model.role_update;
      var role_delete = cfg_model.role_delete;
      var crud_table = cfg_model.crud_table;
      var roles = {
        create:role_create,
        read:role_read,
        update:role_update,
        destroy:role_delete
      };
      
      
      // LOOP ON FIELDS
      var fields = self.load_fields(arg_model_name, crud_table, cfg_fields);
      
      
      // CREATE MODEL
      var settings = {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        // charset:'utf-8',
        tableName: crud_table
      };
      var db = databases.get_database(cx_name);
      var model = db ? db.sequelize.define(arg_model_name, fields, settings) : null;
      
      
      // LOOP ON ASSOCIATIONS
      var association_record = null;
      if (cfg_associations)
      {
        Object.keys(cfg_associations).forEach(
          function(arg_value, arg_index, arg_array)
          {
            association_record = cfg_associations[arg_value];
            association_record.name = arg_value;
            association_record.left_model = arg_model_name;
            association_record.left_table = crud_table;
            if (arg_load_associations)
            {
              self.load_association(association_record);
            }
            else
            {
              associations.push(association_record);
            }
          }
        );
      }
      
      
      // REGISTER MODEL
      if (model)
      {
        return self.add_model(cx_name, arg_model_name, arg_server, model, roles, []);
      }
    }
    
    console.error(cfg_models, 'models.cfg_models');
    return Q(false);
  },
  
  
  to_boolean: function(arg_value, arg_default)
  {
    
    switch(arg_value)
    {
      case true: return true;
      case false: return false;
      case '1': return true;
      case '0': return false;
      case 'true': return true;
      case 'false': return false;
      case 'on': return true;
      case 'off': return false;
      case 'enabled': return true;
      case 'disabled': return false;
    }
    
    return arg_default;
  },
  
  
  get_field_type: function(arg_type)
  {
    // console.info('get field type', arg_type);
    
    switch(arg_type)
    {
      case 'Integer': return Sequelize.INTEGER;
      case 'String': return Sequelize.STRING;
      case 'Email': return Sequelize.STRING;
      case 'Password': return Sequelize.STRING;
    }
    
    return Sequelize.STRING;
  },
  
  
  get_field_validate: function(arg_type)
  {
    // console.info('get field validate', arg_type);
    
    switch(arg_type)
    {
      case 'Email': return {isEmail:true};
      // case 'Password': return Sequelize.STRING;
    }
    
    return null;
  },
  
  
  add_model: function(arg_cx_name, arg_model_name, arg_server, arg_model, arg_roles, arg_includes)
  {
    console.info('adding model', arg_model_name);
    
    if (arg_model_name in models)
    {
      return Q(true);
    }
    
    // REGISTER A DATABASE
    models[arg_model_name] = {
      database:arg_cx_name,
      name:arg_model_name,
      model:arg_model,
      roles:arg_roles,
      includes: arg_includes
    }
    
    return Q(true);
  },
  
  
  get_model: function(arg_model_name)
  {
    console.info('getting model', arg_model_name);
    
    if (arg_model_name in models)
    {
      return models[arg_model_name];
    }
    
    return null;
  },
  
  
  get_models: function()
  {
    return Object.keys(models);
  }
}
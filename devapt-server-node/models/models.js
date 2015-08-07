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
    
    // LOAD MODELS
    Object.keys(cfg_models).forEach(
      function(arg_value, arg_index, arg_array)
      {
        self.load_model(arg_value, arg_server, false);
      }
    );
    
    // LOAD ASSOCIATIONS
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
        associations.join_users.mode=many_to_many
        ; associations.join_users.left.model=MODEL_AUTH_ROLES_USERS (this model)
        ; associations.join_users.left.key=id_user (primary key field)
        associations.join_users.right.model=MODEL_AUTH_USERS
        ; associations.join_users.right.table=users (default model crud table)
        ; associations.join_users.right.key=id_user
        
        // User.hasMany(Role, {through: 'user_has_roles', foreignKey: 'user_role_user_id'});
   */
  load_association: function(arg_asso_cfg)
  {
    // GET ASSOCIATION MODE
    var name = arg_asso_cfg.name;
    var mode = arg_asso_cfg.mode;
    
    // GET MODELS
    var left_model = self.get_model(arg_asso_cfg.left.model);
    assert.ok(left_model, 'bad association left model for name [' + arg_asso_cfg.left.model + ']');
    
    var right_model = self.get_model(arg_asso_cfg.right.model);
    assert.ok(right_model, 'bad association right modelfor name [' + arg_asso_cfg.right.model + ']');
    
    // GET TABLES AND FIELDS
    // var left_table = arg_asso_cfg.left.table;
    var left_key = arg_asso_cfg.left.key;
    
    // var right_table = arg_asso_cfg.right.table;
    var right_key = arg_asso_cfg.right.key;
    
    var middle_table = arg_asso_cfg.middle.table;
    
    if (mode === 'many_to_many')
    {
      console.log('add many_to_many from %s: %s %s', middle_table, arg_asso_cfg.left.model, arg_asso_cfg.right.model);
      
      left_model.model.belongsToMany(right_model.model, { through: middle_table, foreignKey: left_key });
      right_model.model.belongsToMany(left_model.model, { through: middle_table, foreignKey: right_key });
    }
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
      // var driver = cfg_model.driver // IGNORED: NOT USED ON NODES
      var cx_name = cfg_model.connexion;
      var role_read = cfg_model.role_read;
      var role_create = cfg_model.role_create;
      var role_update = cfg_model.role_update;
      var role_delete = cfg_model.role_delete;
      var crud_table = cfg_model.crud_table;
      // var engine_name = cfg_model['engine.name']; // IGNORED, FOR CLIENT ONLY
      // var engine_source= cfg_model['engine.source']; // IGNORED, FOR CLIENT ONLY
      
      
      // ASSOCIATIONS
      var cfg_associations = cfg_model.associations;
      
      
      /*
       // It is possible to create foreign keys:
       bar_id: {
         type: Sequelize.INTEGER,
      
         references: {
           // This is a reference to another model
           model: Bar,
      
           // This is the column name of the referenced model
           key: 'id',
      
           // This declares when to check the foreign key constraint. PostgreSQL only.
           deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
         }
       }*/
      
      
      // SET ACCESS
      var roles = {
        create:role_create,
        read:role_read,
        update:role_update,
        destroy:role_delete
      };
      
      
      // LOOP ON FIELDS
      var loop_asso = null;
      Object.keys(cfg_fields).forEach(
        function(arg_value, arg_index, arg_array)
        {
          cfg_field = cfg_fields[arg_value];
          
          cfg_type = self.get_field_type(cfg_field.type);
          cfg_label = cfg_field.label;
          cfg_is_editable = self.to_boolean(cfg_field.is_editable, false);
          cfg_is_visible = self.to_boolean(cfg_field.is_visible, true);
          cfg_sql_is_primary_key = self.to_boolean(cfg_field.sql_is_primary_key, false);
          cfg_sql_is_expression = self.to_boolean(cfg_field.sql_is_expression, false);
          cfg_sql_column = cfg_field.sql_column;
          cfg_sql_table = cfg_field.sql_table ? cfg_field.sql_table : crud_table;
          
          if (cfg_sql_table === crud_table)
          {
            field = {
              field: cfg_sql_column ? cfg_sql_column : arg_value,
              type:cfg_type,
              primaryKey: cfg_sql_is_primary_key,
              autoIncrement:cfg_sql_is_primary_key,
              allowNull:false
            };
          }
          else if (cfg_associations && (cfg_sql_table in cfg_associations) )
          {
            loop_asso = cfg_associations[cfg_sql_table];
            
            field = {
              field: loop_asso.source.column,
              type: Sequelize.INTEGER,
              
              references: {
                // This is a reference to another model
                model: loop_asso.model,
            
                // This is the column name of the referenced model
                key: loop_asso.target.column,
            
                // This declares when to check the foreign key constraint. PostgreSQL only.
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
              }
            };
            fields[arg_value] = field;
            // console.log(field, 'joined field');
            
            field = {
              field: cfg_sql_column ? cfg_sql_column : arg_value,
              type: Sequelize.INTEGER,
              
              get: function()
              {
                // this.
                console.log('get joined values for %s', arg_value);
              }
            };
            // console.log(field, 'joined field');
          }
          else
          {
            console.error('bad model [%s] configuration for field [%s]', arg_model_name, arg_value);
            console.log(cfg_field, 'cfg_field');
            console.log(cfg_sql_table, 'cfg_sql_table');
            throw Error('error');
            return;
          }
          
          // console.log(field, 'field');
          
          fields[arg_value] = field;
        }
      );
      
      
      // CREATE MODEL
      var settings = {
        timestamps: false,
        tableName: crud_table
      };
      var db = databases.get_database(cx_name);
      var model = db ? db.sequelize.define(arg_model_name, fields, settings) : null;
      
      
      // LOOP ON ASSOCIATIONS
      var association_record = null;
      if (cfg_associations)
      {
        cfg_associations.forEach(
          function(arg_value, arg_index, arg_array)
          {
             association_record = cfg_associations[arg_index];
             association_record.name = arg_value;
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
      
      // LOOP ON CONNEXIONS
      return self.add_model(cx_name, arg_model_name, arg_server, model, roles);
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
  
  
  add_model: function(arg_cx_name, arg_model_name, arg_server, arg_model, arg_roles)
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
      roles:arg_roles
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
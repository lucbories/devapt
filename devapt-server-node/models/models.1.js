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
    
    Object.keys(cfg_models).forEach(
      function(arg_value, arg_index, arg_array)
      {
        self.load_model(arg_value, arg_server, false);
      }
    );
    
    var association_record = null;
    var left_model = null;
    var right_model = null;
    var right_table = null;
    var right_key = null;
    associations.forEach(
      function(arg_value, arg_index, arg_array)
      {
        association_record = associations[arg_index];
        
        left_model = self.get_model(association_record.left_model);
        assert.ok(left_model, 'bad association left model');
        
        right_model = self.get_model(association_record.right_model);
        assert.ok(right_model, 'bad association right model');
        
        if (association_record.association === 'belongsToMany')
        {
          console.log('add belongsToMany from %s.%s to %s.%s.%s', association_record.left_model, association_record.left_field, association_record.right_model, right_table, right_key);
          
          right_table = association_record.right_table;
          right_key = association_record.right_key;
          left_model.model.belongsToMany(right_model.model, { /*as: 'Tasks',*/ through: right_table, foreignKey: right_key });
        }
      }
    );
    
    return Q(true);
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
      
      // ADD JOINNED TABLES
      // var cfg_joins = 'joins' in cfg_model ? cfg_model.joins : null; // TODO
      var cfg_joins = cfg_model.joins; // TODO
      // User.hasMany(Role, {through: 'user_has_roles', foreignKey: 'user_role_user_id'});
      var joins_by_table = {};
      var loop_join = null;
      // var loop_target_table_alias = null;
      if (cfg_joins)
      {
        Object.keys(cfg_joins).forEach(
          function(arg_value, arg_index, arg_array)
          {
            loop_join = cfg_joins[arg_value];
            // console.log(loop_join, 'loop_join');
            
            if (! loop_join.model) { console.error('no join.model for join [%s]', arg_value); return; }
            if (! loop_join.source) { console.error('no join.source for join [%s]', arg_value); return; }
            if (! loop_join.target) { console.error('no join.target for join [%s]', arg_value); return; }
            if (! loop_join.target.table) { console.error('no join.target.table for join [%s]', arg_value); return; }
            
            joins_by_table[loop_join.target.table] = loop_join;
            
            if (loop_join.target.table_alias)
            {
              joins_by_table[loop_join.target.table_alias] = loop_join;
            }
          }
        );
      }
      // console.log(cfg_joins, 'cfg_joins');
      // console.log(joins_by_table, 'joins_by_table');
      
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
      // joins.users.mode=inner
      // joins.users.model=MODEL_AUTH_USERS
      // joins.users.source.column=id_user
      // joins.users.target.table=users
      // joins.users.target.table_alias=join_users
      // joins.users.target.column=id_user
      
      
      // SET ACCESS
      var roles = {
        create:role_create,
        read:role_read,
        update:role_update,
        destroy:role_delete
      };
      
      // ASSOCIATIONS
      var associations_records = []; //{ association:'belongsTo/...', left_model:'', left_field:'', right_model:'', right_table:'', right_key:'' }
      var association_record = null;
      
      // LOOP ON FIELDS
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
          else if (cfg_sql_table in joins_by_table)
          {
            loop_join = joins_by_table[cfg_sql_table];
            
            field = {
              field: loop_join.source.column,
              type: Sequelize.INTEGER,
              
              references: {
                // This is a reference to another model
                model: loop_join.model,
            
                // This is the column name of the referenced model
                key: loop_join.target.column,
            
                // This declares when to check the foreign key constraint. PostgreSQL only.
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
              }
            };
            fields[arg_value] = field;
            // console.log(field, 'joined field');
            
            // REGISTER ASSOCIATION
            association_record = {
              association:'belongsToMany',
              left_model:arg_model_name,
              left_field:arg_value,
              right_model:loop_join.model,
              right_table:loop_join.target.table,
              right_key:loop_join.target.column
            };
            associations_records.push(association_record);
            
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
            console.log(joins_by_table, 'joins_by_table');
            console.log(cfg_joins, 'cfg_joins');
            throw Error('error');
            return;
          }
          
          // console.log(field, 'field');
          
          fields[arg_value] = field;
        }
      );
      
      
      var settings = {
        timestamps: false,
        tableName: crud_table
      };
      
      
      // CREATE MODEL
      var db = databases.get_database(cx_name);
      var model = db ? db.sequelize.define(arg_model_name, fields, settings) : null;
      
      
      // LOOP ON ASSOCIATIONS
      if (arg_load_associations)
      {
        var right_model = null;
        var right_table = null;
        var right_key = null;
        associations_records.forEach(
          function(arg_value, arg_index, arg_array)
          {
              association_record = associations_records[arg_index];
              if (association_record.left_model === arg_model_name)
              {
                if (association_record.association === 'belongsToMany')
                {
                  right_model = self.get_model(association_record.right_model);
                  assert.ok(right_model, 'bad association model');
                  // console.log(right_model.model, 'right_model');
                  
                  right_table = association_record.right_table;
                  right_key = association_record.right_key;
                  model.belongsToMany(right_model.model, { /*as: 'Tasks',*/ through: right_table, foreignKey: right_key });
                }
              }
          }
        );
      }
      else
      {
        associations_records.forEach(
          function(arg_value, arg_index, arg_array)
          {
            association_record = associations_records[arg_index];
            associations.push(association_record);
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
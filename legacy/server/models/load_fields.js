'use strict';

var Sequelize = require('sequelize'),
    Q = require('q'),
    databases = require('./databases'),
    assert = require('assert'),
    app_config = require('../config/app_config');




// EXPORT API
module.exports = function load_fields(arg_model_name, arg_crud_table, arg_fields_cfg)
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
}

'use strict';

var assert = require('assert');



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


// EXPORT API
module.exports = function load_association(arg_asso_cfg)
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
}
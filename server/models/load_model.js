'use strict';

import Q from 'q'
import assert from 'assert'
import Sequelize from 'sequelize'

import * as databases from './databases'
import { store, config } from '../common/store/index'




// EXPORT API
export function load_model(arg_model_name, arg_server, arg_load_associations)
{
  console.info('loading model', arg_model_name);
  var self = this;
  
  // GET MODELS
  if (config.has_model(arg_model_name))
  {
    var cfg_model = config.get_model(arg_model_name);
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
  
  var cfg_models = config.get_models();
  console.error(cfg_models, 'models.cfg_models');
  return Q(false);
}
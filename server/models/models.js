'use strict';

var Sequelize = require('sequelize'),
    Q = require('q'),
    assert = require('assert'),
    
    app_config = require('../config/app_config'),
    to_boolean = require('../utils/to_boolean'),
    
    databases = require('./databases'),
    load_model = require('./load_model'),
    load_fields = require('./load_fields'),
    load_association = require('./load_association')
    ;


// INIT DATABASES REPOSITORY
var models = {};
var associations = [];




// EXPORT API
module.exports = {
  init: function(arg_server)
  {
    var self = this;
    console.log('init models');
    
    // GET MODELS
    var cfg_models = app_config.get_models();
    
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
  
  
  load_model: load_model,
  
  load_fields: load_fields,
  
  load_association: load_association,
  
  to_boolean: to_boolean,
  
  
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
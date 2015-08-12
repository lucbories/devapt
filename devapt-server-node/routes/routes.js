'use strict';

var Q = require('q'),
    databases = require('../models/databases'),
    models = require('../models/models'),
    authentication = require('../security/authentication')//,
    // autorization = require('../security/authorization')
    ;


var init_cb = function(arg_server)
{
  var models_names = models.get_models();
  var model = null;
  var db = null;
  var roles = null;
  
  models_names.forEach(
    function(arg_value, arg_index, arg_array)
    {
      console.info('loading routes for model [%s]', arg_value);
      
      // GET AND CHECK MODEL
      model = models.get_model(arg_value);
      if (!model)
      {
        console.error('route loading failure for model: [%s]', arg_value);
        return Q(false);
      }
      
      // GET AND CHECK DATABASE
      db = databases.get_database(model.database);
      if (!model)
      {
        console.error('route loading failure for database: [%s]', model.database);
        return Q(false);
      }
      
      // GET ACCESS ROLES
      roles = model.roles;
      
      // CREATE REST RESOURCE
      model.includes.forEach(
        function(arg_value, arg_index, arg_array)
        {
          var loop_model = arg_array[arg_index].model;
          // console.log(loop_model, 'loop_model');
          // console.log((typeof loop_model), '(typeof loop_model)');
          if ( (typeof loop_model).toLocaleLowerCase() === 'string' )
          {
            model.includes[arg_index].model = models.get_model(loop_model).model;
          }
        }
      );
      console.log(model.includes, 'model.includes');
      var epilogue_settings = {
        model: model.model,
        endpoints: ['/' + arg_value, '/' + arg_value + '/:' + model.model.primaryKeyAttribute],
        include: model.includes
      };
      var model_resource = db.epilogue.resource(epilogue_settings);
      
      
      // CONFIGURE REST RESOURCE ACCESSES
      var ForbiddenError = db.epilogue.Errors.ForbiddenError;
      
      var check_authorization = function(arg_request)
      {
        return true;
      };
      
        // CREATE ACCESS
      model_resource.create.auth(function(req, res, context) {
          throw new ForbiddenError("can't create an item for model [" + arg_value + "]");
      });
      
        // LIST ACCESS
      model_resource.list.auth(function(req, res, context)
        {
          if (! authentication.check_request(req))
          {
            throw new ForbiddenError("Authentication failure to read items for model [" + arg_value + "]");
          }
          if (! check_authorization(req))
          {
            throw new ForbiddenError("Authorization failure to read items of model [" + arg_value + "]");
          }
          
          console.info('items reading is accepted for model [' + arg_value + ']');
          return context.continue;
        }
      );
      
        // READ ACCESS
      model_resource.read.auth(function(req, res, context)
        {
          if (! authentication.check_request(req))
          {
            throw new ForbiddenError("Authentication failure to read an item for model [" + arg_value + "]");
          }
          if (! check_authorization(req))
          {
            throw new ForbiddenError("Authorization failure to read an item of model [" + arg_value + "]");
          }
          
          console.info('reading is accepted for model [' + arg_value + ']');
          return context.continue;
        }
      );
      
        // UPDATE ACCESS
      model_resource.update.auth(function(req, res, context) {
          throw new ForbiddenError("can't update an item for model [" + arg_value + "]");
      });
      
        // DELETE ACCESS
      model_resource.delete.auth(function(req, res, context) {
          throw new ForbiddenError("can't delete an item for model [" + arg_value + "]");
      });
    }
  )
  
  return Q(true);
};


// EXPORT
module.exports = {
  init: init_cb
}

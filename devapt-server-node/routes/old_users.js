'use strict';

var Q = require('q'),
    models = require('../models/models');


// GET MODEL
var model_users = models.get_model('MODEL_AUTH_USERS');
console.log(model_users, 'model_users');


var init_cb = function(arg_epilogue)
{
  // CREATE REST RESOURCE
  var epilogue_settings = {
    model: model_users.model,
    endpoints: ['/users', '/users/:' + model_users.model.primaryKeyAttribute]
  };
  var users_resource = arg_epilogue.resource(epilogue_settings);
  
  
  // CONFIGURE REST RESOURCE ACCESSES
  var ForbiddenError = arg_epilogue.Errors.ForbiddenError;
  users_resource.create.auth(function(req, res, context) {
      throw new ForbiddenError("can't create a user");
  });
  // users_resource.read.auth(function(req, res, context) {
  //     throw new ForbiddenError("can't read a user");
  // });
  users_resource.update.auth(function(req, res, context) {
      throw new ForbiddenError("can't update a user");
  });
  users_resource.delete.auth(function(req, res, context) {
      throw new ForbiddenError("can't delete a user");
  });
  
  return Q(true);
};


// EXPORT
module.exports = {
  init: init_cb
}

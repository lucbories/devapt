'use strict';

var app_config = require('./config/app_config'),
    authentication = require('./security/authentication'),
    authorization = require('./security/authorization'),
    restify = require('restify'),
    databases = require('./models/databases'),
    models = require('./models/models'),
    routes = require('./routes/routes'),
    Q = require('q')
    ;

// GET APP CONFIG
// var cfg_app = app_config.application;


// CREATE REST SERVER
var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
/*
req.username=...
req.authorization={
  scheme: <Basic|Signature|...>,
  credentials: <Undecoded value of header>,
  basic: {
    username: $user
    password: $password
  }
}
*/
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.requestLogger());


// INITIALIZE DATABASES
var db_ready_promise = databases.init(server);


// INITIALIZE MODELS
var models_ready = db_ready_promise.then(
  function()
  {
    return models.init(server);
  }
);


// INITIALIZE REST ROUTES
var routes_promise = models_ready.then(
  function()
  {
    return routes.init(server);
  }
);


// INITIALIZE AUTHENTICATION
var authentication_promise = routes_promise.then(
  function()
  {
    return authentication.init(server);
  }
);


// INITIALIZE AUTHORIZATION
var authorization_promise = authentication_promise.then(
  function()
  {
    return authorization.init(server);
  }
);


// RESOURCES ROUTES
var get_resource = function(arg_name)
{
  return { name:arg_name, resource_type:'test' };
};

authorization_promise.then(
  function()
  {
    server.get('/resources/:name', function (req, res, next)
      {
        var resource_name = req.params.name;
        var resource_json = get_resource(resource_name);
        res.send(resource_json);
        return next();
      }
    );
  }
);


// RUN TESTS
var test_promise = authorization_promise.then(
  function()
  {
    require('./tests/test_auth').test();
    
    var login = 'test1';
    var result_promise = authorization.has_user_role(login, 'ROLE_AUTH_MENU_MAIN');
    result_promise.then(
      function(result)
      {
        console.log(result ? 'true' : 'false', login + ' has ROLE_AUTH_MENU_MAIN ?');
      },
      function(msg)
      {
        console.error(msg, login + ' has ROLE_AUTH_MENU_MAIN ? ERROR MSG');
      }
    );
    
    return Q(true);
  }
);



// var perf_rest_json = require('./tests/perf_rest_json');
// perf_rest_json.run_1();
/*
models_ready.then(
  function()
  {
    var models_records = require('./models/models');
    var model_users_record = models_records.get_model('MODEL_AUTH_GROUPS');
    var model_roles_record = models_records.get_model('MODEL_AUTH_USERS');
    var model_users_roles_record = models_records.get_model('MODEL_AUTH_GROUPS_USERS');
    
    // var items = model3_record.model.findAll({limit:3, include:[{all:true}], where:where_clause, raw: true }).then(
    var items = model3_record.model.findAll({limit:3, include:[{all:true}], raw: true }).then(
    // var items = model1_record.model.findAll({limit:3, include:[{all:true}], raw: true }).then(
    // var items = model2_record.model.findAll({limit:3, include:[{model:model1_record.model}], raw: true }).then(
    // var items = model3_record.model.findAll({limit:3, include:[{model:model1_record.model, attributes:['label']}], raw: true }).then(
    // var items = model2_record.model.findAll({limit:3, raw: true }).then(
      function(arg_results)
      {
        arg_results.forEach(
          function (arg_model, arg_index, arg_array)
          {
            console.log(arg_model, 'model');
          }
        );
      }
    );
  }
);*/



// EXPORT A PROMISE
module.exports = {
  ready_promise: test_promise, // Q.all([db_ready_promise, models_ready, routes_promise, authentication_promise]),
  server: server
}

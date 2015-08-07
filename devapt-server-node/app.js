'use strict';

var app_config = require('./config/app_config'),
    authentication = require('./security/authentication'),
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
var models_ready = models.init(server);


// INITIALIZE REST ROUTES
var routes_promise = routes.init(server);


// INITIALIZE AUTHENTICATION
var authentication_promise = authentication.init(server);


// RUN TESTS
var auth_test = require('./tests/test_auth').test();
// var perf_rest_json = require('./tests/perf_rest_json');
// perf_rest_json.run_1();


// EXPORT A PROMISE
module.exports = {
  ready_promise: Q.all([db_ready_promise, models_ready, routes_promise, authentication_promise]),
  server: server
}

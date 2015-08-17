'use strict';

var Q = require('q'),
    assert = require('assert'),
    restify = require('restify'),
    
    apps_config = require('../apps/apps.json'),
    
    apps = require('./apps')
    ;


// GET SERVER CONFIG
var server = apps_config.server;
// var server_hostname = ;
// var server_hostname = ;
var server_port = 8080;




// CREATE REST SERVER
console.info('creating server');
var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.requestLogger());


// ERROR HANDLING
server.on('InternalServerError',
  function (req, res, err, cb)
  {
    console.error(err, 'Internal server error');
    err._customContent = 'something is wrong!';
    return cb();
  }
);


// INITIALIZE ALL APPS
var apps_promise = apps.init(server);



// LISTEN
apps_promise.then(
  function()
  {
    server.listen(server_port,
      function()
      {
        console.info('%s listening at %s', server.name, server.url);
      }
    );
  }
);
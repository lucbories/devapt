'use strict';

import create_store from '../common/store/create_store'

let store = create_store();

var Q = require('q'),
    assert = require('assert'),
    restify = require('restify'),
    
    // apps_config = require('../apps/apps.json'),
    
    apps = require('./apps')
    ;


// GET SERVER CONFIG
// var server = store.server;
// var server_hostname = ;
// var server_hostname = ;
var server_port = store.config().get('port')




// CREATE REST SERVER
console.info('creating server');
var server = restify.createServer();

// var acceptable = server.acceptable.concat(['application/x-es-module */*', 'application/x-es-module']);
// console.log(acceptable, 'acceptable');
// server.use(restify.acceptParser(acceptable));
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
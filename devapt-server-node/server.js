'use strict';

var app = require('./app');


// LISTEN
app.ready_promise.then(function() {
    app.server.listen(8080, function() {
      console.log('%s listening at %s', app.server.name, app.server.url);
    });
  });
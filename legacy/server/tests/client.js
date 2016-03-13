var restify = require('restify'),
	assert = require('assert');

var client = restify.createJsonClient({
  url: 'http://localhost:8080',
  version: '*'
});


var url = '/resources/test122';

client.get(url,
  function(err, req, res, obj)
  {
  	assert.ifError(err);
  	console.log('%j', obj);
  }
);

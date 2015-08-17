'use strict';

var restify = require('restify'),
	assert = require('assert'),
  Q = require('q');


var client = restify.createJsonClient(
  {
    url: 'http://localhost:8080',
    version: '*'
  }
);

var auth_username = 'demo';
var auth_password = 'fe01ce2a7fbac8fafaed7c982a04e229';
client.basicAuth(auth_username, auth_password);

module.exports =
{
  run_1: function()
  {
    // var rest_1_url = '/MODEL_AUTH_PROFILES_ROLES?roles_id_role=58&username=demo&password=fe01ce2a7fbac8fafaed7c982a04e229';
    var rest_1_url = '/MODEL_AUTH_PROFILES_ROLES?roles_id_role=58';
    var rest_1_data = [{"id_profile_role":24,"profiles_id_profile":1,"roles_id_role":58,"profiles_label":1,"roles_label":58},{"id_profile_role":18,"profiles_id_profile":2,"roles_id_role":58,"profiles_label":2,"roles_label":58},{"id_profile_role":5,"profiles_id_profile":8,"roles_id_role":58,"profiles_label":8,"roles_label":58}];
    var rest_1_msg = 'perf rest url bad result for [' + rest_1_url + ']';
    
/*    var rest_1_url_cb = function(err, req, res, data) {
      assert.ifError(err);
      
      // console.log('%j', data, 'result');
      assert.deepEqual(rest_1_data, data, rest_1_msg);
    };*/
    
    var ts_start = Date.now();
    var loop_index = 0;
    var loop_count = 10;
    var promises = [];
    var loop_promise = null;
    for( ; loop_index < loop_count ; loop_index++)
    {
      loop_promise = Q.defer();
      promises.push(loop_promise);
    	client.get(rest_1_url, function(err, req, res, data)
        {
          assert.ifError(err);
          // console.log('%j', data, 'result');
          assert.deepEqual(rest_1_data, data, rest_1_msg);
          // res.on('end', function()
          //   {
              loop_promise.resolve(true);
          //   }
          // );
        }
      );
    }
    
    Q.all(promises).then(
      function()
      {
        var ts_end = Date.now();
        
        var duration = ts_end - ts_start;
        console.info("test perf 1 duration [%d]", duration);
      }
    );
  }
};
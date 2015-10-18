'use strict';

var authentication = require('../security/authentication')
    ;


// EXPORT
exports = module.exports = function load_security_routes(arg_server)
{
  console.info('load security routes');
  
  
  // REGISTER SECURITY ROUTES FOR ALL APPLICATIONS
  var route_url = '/security/authenticate';
  var route_cb = function (arg_req, arg_res, arg_next)
  {
    var failure_cb = function(arg_msg)
    {
      var failure_msg = 'Authentication failure';
      // var error = new ForbiddenError(failure_msg + ":[" + arg_msg + ']');
      // return arg_next(error);
      console.error(failure_msg);
      arg_res.status(401);
      arg_res.send(failure_msg);
      return arg_next();
    };
    
    var success_cb = function(arg_authenticated)
    {
      var authentication_ok_msg = 'Authentication is accepted';
      var authentication_ko_msg = 'Authentication is rejected';
      if (! arg_authenticated)
      {
        console.error(authentication_ko_msg);
        arg_res.status(401);
        arg_res.send(authentication_ko_msg);
        return arg_next();
      }
      arg_res.status(200);
      arg_res.send(authentication_ok_msg);
      return arg_next();
    }
    
    // PREPARE AND SEND OUTPUT
    authentication.check_request(arg_req).then(success_cb, failure_cb);
  };
  
  arg_server.get(route_url, route_cb);
  console.info('new security route [%s] configuration route [%s]', 'authenticate', route_url);
}

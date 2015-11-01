
import epilogue_module from 'epilogue'

import { store, config } from '../common/store/index'
import authentication from '../security/authentication'
import authorization from '../security/authorization'



// ERRORS
var ForbiddenError = epilogue_module.Errors.ForbiddenError;
var NotFoundError = epilogue_module.Errors.NotFoundError;



// CALLBACK FUNCTION TO CHECK AUTHENTICATION AND AUTHORIZATION
export default function check_security_for_resources(arg_resource_name, arg_role, arg_action_name)
{
  return function(arg_req, arg_res, arg_next)
  {
    if (! arg_resource_name)
    {
      arg_resource_name = arg_req.params.name;
    }
    console.info('check security for [' + arg_action_name + '] on resource [' + arg_resource_name + '] with role [' + arg_role + ']');
    
    var authentication_msg = 'Authentication is rejected to ' + arg_action_name + ' for resource [' + arg_resource_name + ']';
    var authorization_msg = 'Authorization is rejected to ' + arg_action_name + ' for resource [' + arg_resource_name + ']';
    var failure_msg = 'Failure for ' + arg_action_name + ' for resource [' + arg_resource_name + ']';
    
    var failure_cb = function(arg_msg)
    {
        var error = new ForbiddenError(failure_msg + ":[" + arg_msg + ']');
        return arg_next(error);
    };
    
    var success_cb = function(arg_authenticated)
    {
      if (! arg_authenticated)
      {
        console.error(authentication_msg);
        var error = new ForbiddenError(authentication_msg);
        return arg_next(error);
      }
      console.info('items ' + arg_action_name + ' authentication is accepted for resource [' + arg_resource_name + ']');
      
      authorization.check_authorization(arg_req, arg_role).then(
        function(arg_authorized)
        {
          if (! arg_authorized)
          {
            console.error(authorization_msg);
            var error = new ForbiddenError(authorization_msg);
            return arg_next(error);
          }
        
          console.info('items ' + arg_action_name + ' authorization is accepted for resource [' + arg_resource_name + ']');
          return arg_next();
        },
        failure_cb
      );
    }
    
    authentication.check_request(arg_req).then(success_cb, failure_cb);
  }
}

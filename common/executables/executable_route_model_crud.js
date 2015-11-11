import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import epilogue from 'epilogue'

import { store, config } from '../store/index'

import ExecutableRoute from './executable_route'



let context = 'common/services/executable_route_model_crud'
let ForbiddenError = epilogue.Errors.ForbiddenError;


export default class ExecutableRouteModelCrud extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
	get_route_cb(arg_application, arg_cfg_route)
	{
		let self = this
		
		
		// EPILOGUE CALLBACK FUNCTION TO CHECK AUTHENTICATION AND AUTHORIZATION
		/*var security_epilogue_cb = function(arg_model_name, arg_role, arg_action_name)
		{
			return function(arg_req, arg_res, arg_context)
			{
				console.info('check security for [' + arg_action_name + '] on model [' + arg_model_name + '] with role [' + arg_role + ']');
				
				var authentication_msg = 'Authentication is rejected to ' + arg_action_name + ' for model [' + arg_model_name + ']';
				var authorization_msg = 'Authorization is rejected to ' + arg_action_name + ' for model [' + arg_model_name + ']';
				var failure_msg = 'Failure for ' + arg_action_name + ' for model [' + arg_model_name + ']';
				
				var failure_cb = function(arg_msg)
				{
					return  arg_context.error( new ForbiddenError(failure_msg + ":[" + arg_msg + ']') );
				}
				
				var success_cb = function(arg_authenticated)
				{
					if (! arg_authenticated)
					{
						console.error(authentication_msg);
						// throw new ForbiddenError(authentication_msg);
						return arg_context.error( new ForbiddenError(authentication_msg) );
					}
					console.info('items ' + arg_action_name + ' authentication is accepted for model [' + arg_model_name + ']');
					
					authorization.check_authorization(arg_req, arg_role).then(
						function(arg_authorized)
						{
							if (! arg_authorized)
							{
								console.error(authorization_msg);
								// throw new ForbiddenError(authorization_msg);
								return arg_context.error( new ForbiddenError(authorization_msg) );
							}
							
							console.info('items ' + arg_action_name + ' authorization is accepted for model [' + arg_model_name + ']');
							
						},
						failure_cb
					)
				}
				
				authentication.check_request(arg_req).then(success_cb, failure_cb);
			}
		}*/
		
		
		var security_epilogue_cb = function(arg_model_name, arg_role, arg_action_name)
		{
			return function(arg_req, arg_res, arg_context)
			{
				return arg_context.continue();
			}
		}
		
		
		return function exec_http(req, res, next)
		{
			self.enter_group('ExecutableRouteModelCrud.exec_http')
			
			// CHECK ARGS
			assert(T.isString(arg_cfg_route.model_name), context + ':bad model name')
			assert(T.isObject(arg_cfg_route.model_roles), context + ':bad model roles')
			assert(T.isObject(arg_cfg_route.model), context + ':bad model object')
			
			let epilogue_resource = arg_cfg_route.model.get_epilogue_resource(this.server)
			
			// REGISTER CREATE ACCESS CHECK
			epilogue_resource.create.auth( security_epilogue_cb(arg_cfg_route.model_name, arg_cfg_route.model_roles.create, 'create items') );
			
			// REGISTER LIST ACCESS CHECK
			epilogue_resource.list.auth( security_epilogue_cb(arg_cfg_route.model_name, arg_cfg_route.model_roles.read, 'list items') );
			
			// REGISTER READ ACCESS CHECK
			epilogue_resource.read.auth( security_epilogue_cb(arg_cfg_route.model_name, arg_cfg_route.model_roles.read, 'read an item') );
			
			// REGISTER UPDATE ACCESS CHECK
			epilogue_resource.update.auth( security_epilogue_cb(arg_cfg_route.model_name, arg_cfg_route.model_roles.update, 'update items') );
			
			// REGISTER DELETE ACCESS CHECK
			epilogue_resource.delete.auth( security_epilogue_cb(arg_cfg_route.model_name, arg_cfg_route.model_roles.delete, 'delete items') );
		}
	}
}

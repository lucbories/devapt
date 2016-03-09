import T from 'typr'
import assert from 'assert'


import ExecutableRoute from './executable_route'



let context = 'common/executables/executable_route_model_crud'



/**
 * CRUD operations route registering class.
 */
export default class ExecutableRouteModelCrud extends ExecutableRoute
{
    /**
     *  Create a route registration executable for CRUD operations
     */
	constructor()
	{
		super(context)
	}
	
    
	/**
     * Process a route registering.
     * @override
     * @param {object} arg_server - Server instance.
     * @param {object} arg_application - Application instance.
     * @param {object} arg_cfg_route - plain object route configuration.
     * @param {object} arg_data - plain object contextual datas.
     * @returns {object} promise with a boolean resolved value (true:success, false: failure).
     */
	process_route(arg_server, arg_application, arg_cfg_route, arg_data)
	{
		let self = this
		self.enter_group('ExecutableRouteModelCrud.process_route')
		
		
		// EPILOGUE CALLBACK FUNCTION TO CHECK AUTHENTICATION AND AUTHORIZATION
		/*var security_epilogue_cb2 = function(arg_model_name, arg_role, arg_action_name)
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
		
			
		const app_models = arg_application.resources.get_all('models')
		
		app_models.forEach(
			(model) => {
				// CHECK ARGS
				assert(T.isObject(model), context + ':bad model object')
				assert(T.isString(model.$name), context + ':bad model name')
				assert(T.isObject(model.roles), context + ':bad model roles')
				
				self.info('add route for model [' + model.$name + ']')
				
				let model_name = model.$name
				let model_roles = model.roles
				let epilogue_resource = model.get_epilogue_resource(arg_server, arg_cfg_route.full_route)
				
				// REGISTER CREATE ACCESS CHECK
				epilogue_resource.create.auth( security_epilogue_cb(model_name, model_roles.create, 'create items') )
				
				// REGISTER LIST ACCESS CHECK
				epilogue_resource.list.auth( security_epilogue_cb(model_name, model_roles.read, 'list items') )
				
				// REGISTER READ ACCESS CHECK
				epilogue_resource.read.auth( security_epilogue_cb(model_name, model_roles.read, 'read an item') )
				
				// REGISTER UPDATE ACCESS CHECK
				epilogue_resource.update.auth( security_epilogue_cb(model_name, model_roles.update, 'update items') )
				
				// REGISTER DELETE ACCESS CHECK
				epilogue_resource.delete.auth( security_epilogue_cb(model_name, model_roles.delete, 'delete items') )
			}
		)
		
		
		self.leave_group('ExecutableRouteModelCrud.process_route')
	}
}

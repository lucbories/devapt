
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'
import epilogue_module from 'epilogue'

import logs from '../utils/logs'
import Instance from '../utils/instance'
import { store, config, runtime } from '../store/index'

import authentication from '../../server/security/authentication'
import authorization from '../../server/security/authorization'

import Service from './service'



let context = 'common/services/rest_api_models_query'
let debug = debug_fn(context)

const ForbiddenError = epilogue_module.Errors.ForbiddenError
const NotFoundError = epilogue_module.Errors.NotFoundError



export default class RestApiModelsQueryService extends Service
{
	constructor(arg_svc_name)
	{
		super(arg_svc_name)
		
		this.activated_models = []
	}
	
	
	
	activate(arg_app_obj)
	{
		// CHECK ARGS
		assert( T.isObject(arg_app_obj) && arg_app_obj.$type == 'applications', context + ':bad application object')
		
		logs.info(context, 'activate application [' + arg_app_obj.name + ']')
		
		if ( ! this.enable() )
		{
			logs.info(context, 'service is disabled')
			return false
		}
		// assert(, context + ':service is disabled')
		
		// LOOP ON APPLICATION MODELS
		arg_app_obj.get_models_names().forEach(
			(model_name) => {
				this.load_model(model_name)
			}
		)
		
		
		// LOOP ON MODELS
		/*let applications = runtime.get_applications();
		applications.forEach(
			(app_name) => {
				let app_config = runtime.get_application(app_name)
				
				// LOOP ON MODELS
				let models_ids = app_config.getIn('instances', 'by_type')
				models_ids.forEach(
					(model_id) => {
						let model_instance = app_config.getIn('instances', 'by_id', model_id)
						// TO FINISH
					}
				)
			}
		)*/
		
		return true
	}
	
	
	load_model(arg_model_name)
	{
		logs.info(context, 'load model [' + arg_model_name + ']')
		
		// TEST IF ALREADY LOADED
		if ( this.activated_models.indexOf(arg_model_name) > -1 )
		{
			logs.info(context, 'model [' + arg_model_name + '] is already loaded')
			return
		}
		
		// GET MODEL INSTANCE
		let model = runtime.get_instance('models', arg_model_name)
		assert( T.isObject(model), context + ':bad model object')
		assert( T.isObject(model.db), context + ':bad model.db object')
		assert( T.isObject(model.db.epilogue), context + ':bad model.db.epilogue object')
		
		
		// CREATE EPILOGUE RESOURCE
		let epilogue_settings = {
			model: model,
			endpoints: ['/' + arg_model_name, '/' + arg_model_name + '/:' + model.primaryKeyAttribute],
			include: model.includes/*,
			search: {
			param: 'searchOnlyUsernames',
			operator: '$gt', // $like as default or $ne, $not, $gte, $gt, $lte, $lt, $like (default), $ilike/$iLike, $notLike, $notILike
			attributes: [ 'username' ]
			},
			sort: {
			default: '-email,username',
			param: 'orderby',
			attributes: [ 'username' ]
			},
			pagination: false // default: true with use of offset and count or page and count
			*/
		}
		model.epilogue_resource = model.db.epilogue.resource(epilogue_settings);
		
		
		// REGISTER CREATE ACCESS CHECK
		model.epilogue_resource.create.auth( security_epilogue_cb(arg_model_name, arg_roles.create, 'create items') );
		
		// REGISTER LIST ACCESS CHECK
		model.epilogue_resource.list.auth( security_epilogue_cb(arg_model_name, arg_roles.read, 'list items') );
		
		// REGISTER READ ACCESS CHECK
		model.epilogue_resource.read.auth( security_epilogue_cb(arg_model_name, arg_roles.read, 'read an item') );
		
		// REGISTER UPDATE ACCESS CHECK
		model.epilogue_resource.update.auth( security_epilogue_cb(arg_model_name, arg_roles.update, 'update items') );
		
		// REGISTER DELETE ACCESS CHECK
		model.epilogue_resource.delete.auth( security_epilogue_cb(arg_model_name, arg_roles.delete, 'delete items') );
		
		
		// REGISTER ACTIVATED MODEL
		this.activated_models.push(arg_model_name)
	}
}


// EPILOGUE CALLBACK FUNCTION TO CHECK AUTHENTICATION AND AUTHORIZATION
var security_epilogue_cb = function(arg_model_name, arg_role, arg_action_name)
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
    };
    
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
          return arg_context.continue();
        },
        failure_cb
      );
    }
    
    authentication.check_request(arg_req).then(success_cb, failure_cb);
  }
}

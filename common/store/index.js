import T from 'typr'

import create_store from './create_store';



export const store = create_store();


export const config  = function() { return store.getState().config_reducer.present.get('config').toMap() }
export const runtime = function() { return store.getState().runtime_reducer.present.get('runtime').toMap() }
export let history = [];


// CONFIG: GET APPLICATIONS
config.get_applications = function() { return config().getIn( ['apps'] ).toMap().keySeq().toArray() }
config.has_application  = function(arg_name) { return config().hasIn( ['apps', arg_name] ) }
config.get_application  = function(arg_name) { return config().getIn( ['apps', arg_name] ).toMap().toJS() }


// CONFIG: GET RESOURCES LIST
config.get_resources  = function() { return config().getIn( ['resources', 'by_name'              ] ).toMap().keySeq().toArray() }
config.get_views      = function() { return config().getIn( ['resources', 'by_type', 'views'     ] ).toMap().keySeq().toArray() }
config.get_models     = function() { return config().getIn( ['resources', 'by_type', 'models'    ] ).toMap().keySeq().toArray() }
config.get_menubars   = function() { return config().getIn( ['resources', 'by_type', 'menubars'  ] ).toMap().keySeq().toArray() }
config.get_menus      = function() { return config().getIn( ['resources', 'by_type', 'menus'     ] ).toMap().keySeq().toArray() }
config.get_connexions = function() { return config().getIn( ['resources', 'by_type', 'connexions'] ).toMap().keySeq().toArray() }
config.get_loggers    = function() { return config().getIn( ['resources', 'by_type', 'loggers'   ] ).toMap().keySeq().toArray() }


// CONFIG: HAS A RESOURCE
config.has_resource   = function(arg_name) { return config().hasIn( ['resources', 'by_name',  arg_name] ) }
config.has_resource_by_type = function(arg_type, arg_name)
{
	let name = config().getIn( ['resources', 'by_type', arg_type, arg_name] )
	return name ? config.has_resource(name) : null
}
config.has_view       = function(arg_name) { return config.has_resource_by_type( ['views',      arg_name] ) }
config.has_model      = function(arg_name) { return config.has_resource_by_type( ['models',     arg_name] ) }
config.has_menubar    = function(arg_name) { return config.has_resource_by_type( ['menubars',   arg_name] ) }
config.has_menu       = function(arg_name) { return config.has_resource_by_type( ['menus',      arg_name] ) }
config.has_connexion  = function(arg_name) { return config.has_resource_by_type( ['connexions', arg_name] ) }
config.has_logger     = function(arg_name) { return config.has_resource_by_type( ['loggers',    arg_name] ) }


// CONFIG: GET A RESOURCE
config.get_resource   = function(arg_name) { return config().getIn( ['resources', 'by_name', arg_name] ).toMap().toJS() }
config.get_resource_by_type = function(arg_type, arg_name)
{
	let name = config().getIn( ['resources', 'by_type', arg_type, arg_name] )
	return name ? config.get_resource(name) : null
}
config.get_view       = function(arg_name) { return config.get_resource_by_type('views',      arg_name) }
config.get_model      = function(arg_name) { return config.get_resource_by_type('models',     arg_name) }
config.get_menubar    = function(arg_name) { return config.get_resource_by_type('menubars',   arg_name) }
config.get_menu       = function(arg_name) { return config.get_resource_by_type('menus',      arg_name) }
config.get_connexion  = function(arg_name) { return config.get_resource_by_type('connexions', arg_name) }
config.get_logger     = function(arg_name) { return config.get_resource_by_type('loggers',    arg_name) }



// RUNTIME: GET APPLICATIONS
runtime.get_applications = function() { return runtime().getIn( ['applications'] ).toMap().keySeq().toArray() }
runtime.has_application  = function(arg_name) { return runtime().hasIn( ['applications', arg_name] ) }
runtime.get_application  = function(arg_name) { return runtime().getIn( ['applications', arg_name] ).toMap().toJS() }


// RUNTIME: GET SERVICES
// runtime.get_services = function() { return runtime().getIn( ['applications'] ).toMap().keySeq().toArray() }
// runtime.has_service  = function(arg_name) { return runtime().hasIn( ['applications', arg_name] ) }
// runtime.get_service  = function(arg_name) { return runtime().getIn( ['applications', arg_name] ).toMap().toJS() }


// RUNTIME SERVER
let server = null
runtime.get_server = () => { return server }
runtime.set_server = (arg_server) => { server = arg_server }



// RETURN DIFFERENT (KEYS PATH, VALUE) BETWEEN TWO JS CONFIG
const diff = function(config_1, config_2)
{
	if (! config_1)
	{
		return config_2 ? config_2 : null
	}
	
	if (! config_2)
	{
		return config_1 ? config_1 : null
	}
	
	if ( T.isObject(config_1) && ! T.isObject(config_2) )
	{
		return null
	}
	
	if ( ! T.isObject(config_1) && T.isObject(config_2) )
	{
		return null
	}
	
	if ( T.isArray(config_1) && ! T.isArray(config_2) )
	{
		return null
	}
	
	if ( ! T.isArray(config_1) && T.isArray(config_2) )
	{
		return null
	}
	
	let keys_1 = Object.keys(config_1)
	let keys_2 = Object.keys(config_2)
	
	// LOOP ON CONFIG 1
	keys_1.forEach(
		(key_1) => {
			let value_1 = config_1[key_1]
			if (keys_2.indexOf(key_1) < 0)
			{
				return value_1
			}
			
			let value_2 = config_2[key_1]
			if ( T.isObject(value_2) )
			{
				return diff(value_1, value_2)
			}
		}
	)
}


export default { store, config, runtime, diff }

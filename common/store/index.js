// import T from 'typr'

// import create_store from './create_store';

// import { dispatch_store_config_update_value, dispatch_store_config_remove_value } from './config/actions'
// import { dispatch_store_runtime_update_value, dispatch_store_runtime_remove_value } from './runtime/actions'

// import * as diff from '../utils/obj_diff';
import * as st from './store'
import * as decorated_config from './store_config'
import * as decorated_runtime from './store_runtime'



export const store = st.store
export const config = st.config
export const runtime = st.runtime

// console.log(store, 'store')
// console.log(config, 'config')
// console.log(runtime, 'runtime')

export default { store, config, runtime }

/*
export const store = create_store();


export const config  = function() { return store.getState().config_reducer.present.get('config').toMap() }
export const runtime = function() { return store.getState().runtime_reducer.present.get('runtime').toMap() }
export let history = [];



// INIT COLLECTIONS TYPES
store.collections         = ['servers', 'applications', 'modules', 'plugins', 'security', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
store.config_collections  = ['servers', 'applications', 'modules', 'plugins', 'security']
store.runtime_collections = ['servers', 'applications', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
store.has_collection      = function(arg_name) { return store.collections.indexOf(arg_name) > -1 }



// DEFINE CONFIG COLLECTIONS ACCESSORS
config.get_collection       = function(arg_name) { return config().get(arg_name).toMap() }
config.get_collection_names = function(arg_name) { return config().get(arg_name).toMap().keySeq().toArray() }
config.has_collection       = function(arg_name) { return store.config_collections.indexOf(arg_name) > -1 }

config.get_collection_item  = function(arg_name, arg_item_name) { return config().getIn( [arg_name, arg_item_name] ).toMap() }
config.has_collection_item  = function(arg_name, arg_item_name) { return config().hasIn( [arg_name, arg_item_name] ) }
config.set_collection_item  = function(arg_name, arg_item_name, arg_settings)
{
	dispatch_store_config_update_value(store, [arg_name, arg_item_name], arg_settings)
}
config.unset_collection_item  = function(arg_name, arg_item_name)
{
	dispatch_store_config_remove_value(store, [arg_name, arg_item_name])
}

config.get_instance_cfg = config.get_collection_item
config.set_instance_cfg = config.set_collection_item
config.has_instance_cfg = config.has_collection_item
config.unset_instanc_cfg = config.unset_collection_item



// DEFINE RUNTIME COLLECTIONS ACCESSORS
runtime.get_collection       = function(arg_name) { return config().get(arg_name).toMap() }
runtime.get_collection_names = function(arg_name) { return config().get(arg_name).toMap().keySeq().toArray() }
runtime.has_collection       = function(arg_name) { return store.config_collections.indexOf(arg_name) > -1 }

runtime.get_collection_item  = function(arg_name, arg_item_name) { return config().getIn( [arg_name, arg_item_name] ).toMap() }
runtime.has_collection_item  = function(arg_name, arg_item_name) { return config().hasIn( [arg_name, arg_item_name] ) }
runtime.set_collection_item  = function(arg_name, arg_item_name, arg_instance)
{
	dispatch_store_runtime_update_value(store, ['runtime', 'instances', arg_name, arg_item_name], arg_instance)
}
runtime.unset_collection_item  = function(arg_name, arg_item_name)
{
	dispatch_store_runtime_remove_value(store, ['runtime', 'instances', arg_name, arg_item_name])
}

runtime.get_instance = runtime.get_collection_item
runtime.set_instance = runtime.set_collection_item
runtime.has_instance = runtime.has_collection_item
runtime.unset_instanc = runtime.unset_collection_item



// CONFIG: GET APPLICATIONS
config.get_applications = function() { return config().getIn( ['applications'] ).toMap().keySeq().toArray() }
config.has_application  = function(arg_name) { return config().hasIn( ['applications', arg_name] ) }
config.get_application  = function(arg_name) { return config().getIn( ['applications', arg_name] ).toMap().toJS() }


// CONFIG: GET RESOURCES LIST
config.get_resources  = function(arg_set_name)
{
	let path = ['resources', 'by_name']
	if (arg_set_name)
	{
		path = ['resources', 'by_type', arg_set_name]
	}
	return config().getIn(path).toMap().keySeq().toArray()
}
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
runtime.get_services = function() { return runtime().getIn( ['instances', 'by_type', 'services'] ).map(id => runtime().getIn( ['instances', 'by_id', id] ) ).toArray() }
// runtime.has_service  = function(arg_name) { return runtime().hasIn( ['applications', arg_name] ) }
// runtime.get_service  = function(arg_name) { return runtime().getIn( ['applications', arg_name] ).toMap().toJS() }


// RUNTIME SERVER
// let server = null
// runtime.get_server = () => { return server }
// runtime.set_server = (arg_server) => { server = arg_server }


export default { store, config, runtime, diff }
*/
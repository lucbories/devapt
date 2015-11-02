import T from 'typr'

import { store, config, runtime } from './store';

import { dispatch_store_config_update_value, dispatch_store_config_remove_value } from './config/actions'
import { dispatch_store_runtime_update_value, dispatch_store_runtime_remove_value } from './runtime/actions'



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

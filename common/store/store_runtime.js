import T from 'typr'

import { store, config, runtime } from './store';

import { dispatch_store_runtime_update_value, dispatch_store_runtime_remove_value } from './runtime/actions'



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


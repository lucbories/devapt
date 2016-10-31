// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import ServicesPlugin from '../plugins/services_plugin'


const default_plugins_map = {
	'middleware':               '../server/services/middleware/mw_service',
	'metrics_http':             '../server/services/metrics_http/metrics_service',
	'metrics_host':             '../server/services/metrics_host/metrics_service',
	'metrics_nodejs':           '../server/services/metrics_nodejs/metrics_service',
	'metrics_bus':              '../server/services/metrics_bus/metrics_service',
	'logs':                     '../server/services/logs/logs_service',
	'topology':                 '../server/services/topology/topology_service',
	'messages':                 '../server/services/messages/messages_service',
	'rest_api_models_query':    '../server/services/crud/crud_service',
	'rest_api_models_modifier': '../server/services/crud/crud_service',
	'rest_api_resources_query': '../server/services/resource/resources_service',
	'resources_query':          '../server/services/resource/resources_service',
	'html_assets':              '../server/services/assets/assets_service',
	'security':                 '../server/services/security/security_service'
}


const context = 'server/default_plugins/services_default_plugin'



/**
 * Plugin class for default services.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class DefaultServicesPlugin extends ServicesPlugin
{
	constructor(arg_manager)
	{
		super(arg_manager, 'DefaultServices', '1.0.0')
	}
	
	
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':create:bad class string')
		assert( T.isString(arg_name), context + ':create:bad name string')
		assert( T.isObject(arg_settings), context + ':create:bad settings object')
		
		const found = (arg_class_name in default_plugins_map)
		assert( found, context + ':create:feature name not found')
		
		const feature = default_plugins_map[arg_class_name]
		
		let class_object = feature
		if ( T.isString(feature) )
		{
			class_object = this.load_feature_class(__dirname + '/../' + feature)
		}
		
		assert( T.isFunction(class_object), context + ':create:bad feature class object')
		
		// console.log(arg_class_name, context + ':create:class')
		
		const i = new class_object(arg_name, arg_settings, arg_state)
		// console.log(i, context + ':create:instance')
		
		return i
	}
	
	
	has(arg_class_name)
	{
		return (arg_class_name in default_plugins_map)
	}
}



import T from 'typr'
import assert from 'assert'

import ServicesPlugin from '../../common/plugins/services_plugin'


const default_plugins_map = {
	'middleware': '../common/services/middleware/mw_service',
	'metrics': '../common/services/metrics/metrics_service',
	'logs': '../common/services/logs/logs_service',
	'rest_api_models_query': '../common/services/crud/crud_service',
	'rest_api_models_modifier': '../common/services/crud/crud_service',
	'rest_api_resources_query': '../common/services/resource/resources_service',
	'html_assets': '../common/services/assets/assets_service'
}


const context = 'plugins/default/services_default_plugin'



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

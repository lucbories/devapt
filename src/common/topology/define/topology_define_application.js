// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Collection from '../../base/collection'
import topology_registry from '../registry/index'
import TopologyDefineItem from './topology_define_item'
// import topology_define_world from './index'


let context = 'common/topology/define/topology_define_application'



/**
 * @file Application class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class TopologyDefineApplication extends TopologyDefineItem
{
    /**
     * TopologyDefineApplication constructor.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"applications":{
	 * 		"applicationA":{
	 * 			"url":"/../",
	 * 	
	 * 			"provided_services":{
	 * 				"devtools_store": { servers":["Server1"] },
	 * 				"devtools_panel": { "servers":["Server1"] },
	 * 				"metrics_http": { "servers":["Server2", "Server3] },
	 * 			},
	 * 			"used_services":["messages"],
	 * 			
	 * 			"used_packages": ["devtools"],
	 * 			"used_plugins":["foundation6"],
	 * 			
	 * 			"license":"APACHE-LICENSE-2.0"
	 * 		},
	 * 		"applicationB":{
	 * 			...
	 * 		}
	 * 	}
	 * 
     * @param {string} arg_name - application name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'TopologyDefineApplication', log_context)
		
		this.is_topology_define_application = true

		this.topology_type = 'applications'
		
		this.app_url				= this.get_setting('url', undefined)
		this.app_license			= this.get_setting('license', undefined)
		this.app_provided_services	= this.get_setting('provided_services', undefined)
		this.app_used_services 		= this.get_setting('used_service', undefined)
		this.app_used_packages		= this.get_setting('used_packages', undefined)
		this.app_used_plugins		= this.get_setting('used_plugins', undefined)
		
		this.info('Application is created')
	}
}

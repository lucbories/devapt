// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_plugin'



/**
 * @file TopologyDefinePlugin class: describe a Plugin topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefinePlugin extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefinePlugin instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"plugins":{
	 * 		"pluginA":{
	 *			"type":"...", // rendering
	 * 			"file":"..."
	 * 		},
	 * 		"pluginB":{
	 *			"type":"...",
	 * 			"package":"..."
	 * 		}
	 * 	}
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'TopologyDefinePlugin', log_context)
		
		this.is_topology_define_plugin = true

		this.topology_type = 'plugins'
		
		this.topology_plugin_type = this.get_setting('type', undefined)
		this.topology_plugin_file = this.get_setting('file', undefined)
		this.topology_plugin_package = this.get_setting('package', undefined)

		this.info('Plugin is created')
	}
}

// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_node'



/**
 * @file TopologyDefineServer class: describe a node topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineServer extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineServer instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"servers":{
	 * 		"serverA":{
	 * 			"type":"express",
	 * 			"port":8080,
	 * 			"protocole":"http",
	 * 			"middlewares":[],
	 * 			"use_socketio":true,
	 * 			
	 * 			"security": {
	 * 				"authentication": {
	 * 					"enabled":false,
	 * 					"plugins":["file_users"]
	 * 				}
	 *			}
	 * 		},
	 * 		"serverB":{
	 *			...
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
		super(arg_name, arg_settings, 'TopologyDefineServer', log_context)
		
		this.is_topology_define_node = true

		this.topology_type = 'servers'
		
		this.server_type 			= this.get_setting('type', undefined)
		this.server_port			= this.get_setting('port', undefined)
		this.server_protocole 		= this.get_setting('protocole', undefined)
		this.server_middlewares 	= this.get_setting('middlewares', undefined)
		this.server_use_socketio 	= this.get_setting('use_socketio', false)
		// this.server_security = this.get_setting('security', undefined)

		this.info('Server is created')
	}
}

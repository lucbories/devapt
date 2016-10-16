// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'

// COMMON IMPORTS
import Collection from '../../base/collection'
import TopologyDefineItem from './topology_define_item'
import TopologyDefineServer from './topology_define_server'


let context = 'common/topology/define/topology_define_node'



/**
 * @file TopologyDefineNode class: describe a node topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineNode extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineNode instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"nodes":{
	 * 		"nodeA":{
	 *			:"...",
	 * 			:"..."
	 * 		},
	 * 		"nodeB":{
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
		super(arg_name, arg_settings, 'TopologyDefineNode', log_context)
		
		this.is_topology_define_node = true

		this.topology_type = 'nodes'

		this.declare_collection('servers', 'server', TopologyDefineServer)
		
		this.info('Node is created')
	}
}

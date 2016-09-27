// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'

// COMMON IMPORTS
import TopologyRuntimeItem from './topology_runtime_item'


let context = 'common/topology/runtime/topology_runtime_menubar'



/**
 * @file Menubar class: describe a Menubar topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyRuntimeMenubar extends TopologyRuntimeItem
{
	/**
	 * Create a TopologyRuntimeMenubar instance.
	 * @extends TopologyRuntimeItem
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
		super(arg_name, arg_settings, 'Menubar', log_context)
		
		this.is_topology_menubar = true

		this.topology_type = 'menubars'
	}
	


	/**
	 * Load Topology item settings.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		super.load()
	}
}

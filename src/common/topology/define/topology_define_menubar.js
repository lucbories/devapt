// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'
import TopologyDefineMenu from './topology_define_menu'


let context = 'common/topology/define/topology_define_menubar'



/**
 * @file Menubar class: describe a Menubar topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineMenubar extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineMenubar instance.
	 * @extends TopologyDefineItem
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		// console.log('TopologyDefineMenubar.arg_settings', arg_settings.toJS ? arg_settings.toJS() : arg_settings)

		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'TopologyDefineMenubar', log_context)
		
		this.is_topology_define_menubar = true

		this.topology_type = 'menubars'
		
		this.declare_collection('menus', 'menu', TopologyDefineMenu)
	}
}

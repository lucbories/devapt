// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_command'



/**
 * @file TopologyDefineCommand class: describe a node topology command (menu action for example).
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineCommand extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineCommand instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"commands":{
	 * 		"cmdA":{
	 * 			"url":"myUrl",
	 * 			"view":"myView",
	 * 			"menubar":"myMenubar",
	 * 			"label":"myLabel"
	 * 		},
	 * 		"cmdB":{
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
		super(arg_name, arg_settings, 'TopologyDefineCommand', log_context)
		
		this.is_topology_define_command = true

		this.topology_type = 'commands'
		
		this.command_type 			= this.get_setting('type', undefined)
		this.command_url 			= this.get_setting('url', undefined)
		this.command_url_target		= this.get_setting('url_target', 'body')
		this.command_view 			= this.get_setting('view', undefined)
		this.command_menubar 		= this.get_setting('menubar', undefined)
		this.command_label 			= this.get_setting('label', undefined)

		this.info('Command is created')
	}
}

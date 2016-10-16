// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'
import TopologyDefineDatasource from './topology_define_datasource'
import TopologyDefineModel from './topology_define_model'
import TopologyDefineView from './topology_define_view'
import TopologyDefineMenu from './topology_define_menu'
import TopologyDefineMenubar from './topology_define_menubar'
import TopologyDefineService from './topology_define_service'


const context = 'common/topology/define/topology_define_package'



/**
 * @file TopologyDefinePackage resource class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefinePackage extends TopologyDefineItem
{
	/**
	 * Create a package resource instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"packages":{
	 * 		"packageA":{
	 *			"services":"...",
	 * 			"datasources":"...",
	 * 			"models":"...",
	 * 			"views":"...",
	 * 			"menus":"...",
	 * 			"menubars":"..."
	 * 		},
	 * 		"packageB":{
	 * 			...
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
		super(arg_name, arg_settings, 'TopologyDefinePackage', log_context)
		
		this.is_topology_define_package = true

		this.topology_type = 'packages'

		this.declare_collection('services',    'service',     TopologyDefineService/*, init_service_cb*/)
		this.declare_collection('datasources', 'datasource',  TopologyDefineDatasource)
		this.declare_collection('models',      'model',       TopologyDefineModel)
		this.declare_collection('views',       'view',        TopologyDefineView)
		this.declare_collection('menus',       'menu',        TopologyDefineMenu)
		this.declare_collection('menubars',    'menubar',     TopologyDefineMenubar)
		
		this.info('Package is created')
	}
}

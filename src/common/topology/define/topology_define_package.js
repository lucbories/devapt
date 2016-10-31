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
import TopologyDefineCommand from './topology_define_command'


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
		// console.log('TopologyDefinePackage.arg_settings', arg_settings.toJS ? arg_settings.toJS() : arg_settings)

		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'TopologyDefinePackage', log_context)
		
		this.is_topology_define_package = true

		this.topology_type = 'packages'

		this.declare_collection('commands',    'command',     TopologyDefineCommand)
		this.declare_collection('services',    'service',     TopologyDefineService)
		this.declare_collection('datasources', 'datasource',  TopologyDefineDatasource)
		this.declare_collection('models',      'model',       TopologyDefineModel)
		this.declare_collection('views',       'view',        TopologyDefineView)
		this.declare_collection('menus',       'menu',        TopologyDefineMenu)
		this.declare_collection('menubars',    'menubar',     TopologyDefineMenubar)
		
		this.info('Package is created')
	}



	/**
	 * Find a resource.
	 * 
	 * @param {string} arg_name - resource name (mandatory).
	 * @param {string} arg_type - resource type name (optional).
	 * 
	 * @returns {TopologyDefineItem|undefined} - resource instance.
	 */
	find_resource(arg_name, arg_type=undefined)
	{
		// console.log('package.find_resource ' + arg_name + ' in package ' + this.get_name() + ' for type ' + arg_type)
		// if (arg_name == 'topology_physical')
		// {
		// 	console.log('package.find_resource views=%a', this.views().latest.get_all_names() )
		// }

		if (arg_type)
		{
			let result = undefined
			switch(arg_type) {
				case 'command':
				case 'commands':    return this.command(arg_name)

				case 'service':
				case 'services':    return this.service(arg_name)

				case 'datasource':
				case 'datasources': return this.datasource(arg_name)

				case 'model':
				case 'models':      return this.model(arg_name)
				
				case 'view':
				case 'views':       /*result = this.view(arg_name)*/
					this.views().get_latest_items().forEach(
						(view)=>{
							if (arg_name == view.get_name())
							{
								result = view
								console.log('package.find_resource ' + arg_name + ' FOUND')
							}
						}
					)
					// console.log('package.find_resource ' + arg_name + ' in package ' + this.get_name() + ' for views', result)
					if (!result)
					{
						console.log('package.find_resource ' + arg_name + ' NOT FOUND')
					}
					return result

				case 'menu':
				case 'menus':       return this.menu(arg_name)

				case 'menubar':
				case 'menubars':    result = this.menubar(arg_name)
					// console.log('package.find_resource ' + arg_name + ' in package ' + this.get_name() + ' for menubars', result)
					return result
			}
			return undefined
		}

		return this.service(arg_name)
			|| this.datasource(arg_name)
			|| this.model(arg_name)
			|| this.view(arg_name)
			|| this.menu(arg_name)
			|| this.menubar(arg_name)
	}
}

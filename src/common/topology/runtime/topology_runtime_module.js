// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Collection from '../../base/collection'
import TopologyRuntimeItem from './topology_runtime_item'
import Database from './topology_runtime_database'
import ModelSchema from './topology_runtime_model_schema'
import View from './topology_runtime_view'
import Menu from './topology_runtime_menu'
import Menubar from './topology_runtime_menubar'


const context = 'common/topology/runtime/topology_runtime_module'



/**
 * @file Module resource class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Module extends TopologyRuntimeItem
{
	/**
	 * Create a module resource instance.
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
		super(arg_name, arg_settings, 'Module', log_context)
		
		this.is_topology_module = true

		this.topology_type = 'modules'
		this.resources = new Collection()
	}

	
	
	/**
	 * Load module settings.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		assert( T.isObject(this.$settings), context + ':bad settings object')
		assert( T.isFunction(this.$settings.has), context + ':load:bad settings object')
		
		// ENABLE APP SERVICES
		if (! this.$settings.has('resources_by_name') )
		{
			this.debug('no resource for module')
			return
		}
		const cfg = this.$settings.get('resources_by_name').toMap()
		Object.keys(cfg.toJS()).forEach(
			(res_name) => {
				const res_cfg = cfg.get(res_name)

				// DEBUG
				// console.log(res_name, 'res_name')
				// console.log(res_cfg, 'res_cfg')
				
				let resource = this.create_resource(res_name, res_cfg)
				resource.load()
				this.resources.add(resource)
				this.topology_children[res_name] = resource
			}
		)
	}
	
	

	/**
	 * Create a module resource.
	 * 
	 * @param {string} arg_name - resource name.
	 * @param {object} arg_settings - resource settings.
	 * 
	 * @returns {Resource|Database|View|Model|Menu|Menubar} - an Resource instance.
	 */
	create_resource(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		const res_collection =arg_settings.get('collection')
		assert( T.isString(res_collection), context + ':bad collection string')
		
		switch(res_collection)
		{
			case 'databases': return new Database(arg_name, arg_settings)
			case 'views': return new View(arg_name, arg_settings)
			case 'models': return new ModelSchema(arg_name, arg_settings)
			case 'menus': return new Menu(arg_name, arg_settings)
			case 'menubars': return new Menubar(arg_name, arg_settings)
		}
		
		return new TopologyRuntimeItem(arg_name, arg_settings)
	}
}

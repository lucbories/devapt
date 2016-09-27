// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Collection from '../../base/collection'
import TopologyRuntimeItem from './topology_runtime_item'
import topology_registry from '../registry/index'
import topology_runtime from './index'


let context = 'common/topology/runtime/topology_runtime_application'



/*
"applications":{
		"tutorial-auth":{
			"url":"tutorial-auth/api/v1",
			
			"services":{
				"provides":{
					"svc1":["*"],
					"svc2":["*"],
					"svc3":[],
					"svc4":[],
					"svc5":false,
					"svc6":false
				},
				"consumes":{
				}
			},
			
			"modules": ["security"],
			"plugins":[],
			"resources":[],
			
			"assets":{
				"css":[],
				"js":[],
				"img":[],
				"index":""
			},
			"license":"APACHE-LICENSE-2.0"
		},...
*/

/**
 * @file Application class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Application extends TopologyRuntimeItem
{
    /**
     * Application constructor.
	 * @extends TopologyRuntimeItem
	 * 
     * @param {string} arg_name - Application name.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_name)
	{
		const cfg = topology_registry.root
		assert( topology_registry.has_collection('applications'), context + ':not found store.applications')
		let settings = cfg.hasIn(['applications', arg_name]) ? cfg.getIn(['applications', arg_name]) : {}
		
		super(arg_name, settings, 'Application', context)
		
		this.is_topology_application = true
		
		assert( T.isString(this.$settings.get('url')), context + ':bad url string')
		assert( T.isString(this.$settings.get('license')), context + ':bad license string')
		this.url = this.$settings.get('url')
		this.license = this.$settings.get('license')
		
		this.provided_services = new Collection()
		this.consumed_services = new Collection()
		this.modules = new Collection()
		this.plugins = new Collection()
		this.resources = new Collection()
		this.assets = new Collection()
		
		this.info('Application is created')
	}
	
    
	
	/**
     * Load configuration and build application.
	 * 
	 * @returns {nothing}
     */
	load()
	{
		this.info('Application is loading')
		this.enter_group('load')
		
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		
		// TODO: ENABLE CONSUMED SERVICES
		this.info('enable consumed services (todo)')
		assert( this.$settings.hasIn(['services', 'consumes']), context + ':bad settings.services.consumes key')
		const consumes = this.$settings.getIn(['services', 'consumes'])
		assert( T.isObject(consumes), context + ':bad settings.services.consumes object')
		consumes.forEach(
			(service_cfg, service_name) => {
				/*let service =*/ topology_runtime.services.find_by_name(service_name)
				
				// TODO PROCESS CONSUMED SERVICES
				// assert( T.isObject(service) && service.is_service, context + ':bad service object')
				
				// if (service)
				// {
				// 	service.activate(this, service_cfg)
				// 	service.enable()
				// 	this.consumed_services.add(service)
				// }
			}
		)
		
		
		// ENABLE USED MODULES
		this.info('enable used modules')
		assert( T.isFunction(this.$settings.has), context + ':load:bad settings object')
		assert( this.$settings.has('modules'), context + ':bad settings.modules key')
		const cfg_modules = this.$settings.get('modules')
		assert( T.isObject(cfg_modules), context + ':bad settings.modules object')
		cfg_modules.forEach(
			(module_name) => {
				let module_obj = topology_runtime.modules.find_by_name(module_name)
				
				assert( T.isObject(module_obj) && module_obj.is_topology_module, context + ':bad module object')
				
				this.modules.add(module_obj)
				
				// LOOP ON MODULE RESOURCES
				// PROBLEM WITH NODEJS 0.10
				// for(let res_obj of module_obj.resources.get_all() )
				// {
				var all_ressources = module_obj.resources.get_all()
				for(var res_obj_index = 0 ; res_obj_index < all_ressources.length ; res_obj_index++)
				{
					var res_obj = all_ressources[res_obj_index]

					this.resources.add(res_obj)
				}
			}
		)
		
		
		// ENABLE USED PLUGINS
		this.info('enable used plugins')
		assert( this.$settings.has('plugins'), context + ':bad settings.plugins key')
		const cfg_plugins = this.$settings.get('plugins')
		assert( T.isObject(cfg_plugins), context + ':bad settings.plugins object')
		cfg_plugins.forEach(
			(plugin_name) => {
				let plugin_obj = topology_runtime.plugins.find_by_name(plugin_name)
				
				// assert( T.isObject(plugin_obj) && plugin_obj.is_plugin, context + ':bad plugin object')
				
				if (plugin_obj)
				{
					// LOAD RESOURCES
					this.plugins.add(plugin_obj)
				}
			}
		)
		
		
		// ENABLE PROVIDED SERVICES
		this.info('enable provided services')
		assert( this.$settings.hasIn(['services', 'provides']), context + ':bad settings.services.provides key')
		const provides = this.$settings.getIn(['services', 'provides'])
		assert( T.isObject(provides), context + ':bad settings.services.provides object')
		provides.forEach(
			(provide_svc_cfg, service_name) => {
				// this.info('loop on service [' + service_name + ']')
				let service = topology_runtime.services.find_by_name(service_name)
				
				// assert( T.isObject(service) && service.is_service, context + ':bad service object')
				
				if (service)
				{
					this.info('activate service [' + service_name + ']')

					service.activate(this, provide_svc_cfg.toJS())
					
					service.enable()
					
					this.provided_services.add(service)
				}
				else
				{
					this.info('can not activate: no service found [' + service_name + ']')
				}
			}
		)
		
		
		// TODO RESOURCES AND ASSETS
		
		super.load()
		
		this.leave_group('load')
	}
	
	
	
    /**
     * Get all application models names.
	 * 
     * @{returns} - Array of String.
     */
	get_models_names()
	{
		return this.get_resources_names('models')
	}
	
	
	
    /**
     * Get all application views names.
	 * 
     * @{returns} - Array of String.
     */
	get_views_names()
	{
		return this.get_resources_names('views')
	}
	
	
	
    /**
     * Get all application menubars names.
	 * 
     * @{returns} - Array of String.
     */
	get_menubars_names()
	{
		return this.get_resources_names('menubars')
	}
	
	
	
    /**
     * Get all application menus names.
	 * 
     * @{returns} - Array of String.
     */
	get_menus_names()
	{
		return this.get_resources_names('menus')
	}
	
	
	
    /**
     * Get all application resources of given type names.
	 * 
     * @param {string} arg_type - resource type.
	 * 
     * @{returns} - Array of String
     */
	get_resources_names(arg_type)
	{
		let resources = []
		
		this.$settings.get('modules').toArray().forEach(
			(module_name) => {
				let module_resources = null
				if (arg_type)
				{
					module_resources = topology_registry.getIn('modules', module_name, 'resources_by_type', arg_type).toArray()
				} else {
					module_resources = topology_registry.getIn('modules', module_name, 'resources_by_name').toArray()
				}
				module_resources.forEach(
					(resource_name) => {
						resources.push(resource_name)
					}
				)
			}
		)
		
		return resources
	}
}

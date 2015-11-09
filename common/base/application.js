
import T from 'typr'
import assert from 'assert'

import { store, config } from '../store/index'

import Instance from './instance'
import Collection from './collection'
import runtime from './runtime'



let context = 'common/base/application'


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
export default class Application extends Instance
{
	constructor(arg_name)
	{
		const cfg = config()
		assert( config.has_collection('applications'), context + ':not found config.applications')
		let settings = cfg.hasIn(['applications', arg_name]) ? cfg.getIn(['applications', arg_name]) : {}
		
		super('applications', 'Application', arg_name, settings, context)
		
		this.is_application = true
		
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
	
	
	load()
	{
		this.info('Application is loading')
		this.enter_group('load')
		
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		
		// ENABLE PROVIDED SERVICES
		assert( this.$settings.hasIn(['services', 'provides']), context + ':bad settings.services.provides key')
		const provides = this.$settings.getIn(['services', 'provides'])
		assert( T.isObject(provides), context + ':bad settings.services.provides object')
		provides.forEach(
			(service_cfg, service_name) => {
				let service = runtime.services.find_by_name(service_name)
				
				// assert( T.isObject(service) && service.is_service, context + ':bad service object')
				
				if (service)
				{
					service.activate(this, service_cfg)
					service.enable()
					this.provided_services.add(service)
				}
			}
		)
		
		
		// ENABLE CONSUMED SERVICES
		assert( this.$settings.hasIn(['services', 'consumes']), context + ':bad settings.services.consumes key')
		const consumes = this.$settings.getIn(['services', 'consumes'])
		assert( T.isObject(consumes), context + ':bad settings.services.consumes object')
		consumes.forEach(
			(service_cfg, service_name) => {
				let service = runtime.services.find_by_name(service_name)
				
				// assert( T.isObject(service) && service.is_service, context + ':bad service object')
				
				if (service)
				{
					service.activate(this, service_cfg)
					service.enable()
					this.consumed_services.add(service)
				}
			}
		)
		
		
		// ENABLE USED MODULES
		assert( this.$settings.has('modules'), context + ':bad settings.modules key')
		const cfg_modules = this.$settings.get('modules')
		assert( T.isObject(cfg_modules), context + ':bad settings.modules object')
		cfg_modules.forEach(
			(module_name) => {
				let module_obj = runtime.modules.find_by_name(module_name)
				
				// assert( T.isObject(module_obj) && module_obj.is_module, context + ':bad module object')
				
				if (module_obj)
				{
					// LOAD RESOURCES
					this.modules.add(module_obj)
				}
			}
		)
		
		
		// ENABLE USED PLUGINS
		assert( this.$settings.has('plugins'), context + ':bad settings.plugins key')
		const cfg_plugins = this.$settings.get('plugins')
		assert( T.isObject(cfg_plugins), context + ':bad settings.plugins object')
		cfg_plugins.forEach(
			(plugin_name) => {
				let plugin_obj = runtime.plugins.find_by_name(plugin_name)
				
				// assert( T.isObject(plugin_obj) && plugin_obj.is_plugin, context + ':bad plugin object')
				
				if (plugin_obj)
				{
					// LOAD RESOURCES
					this.plugins.add(plugin_obj)
				}
			}
		)
		
		
		// TODO RESOURCES AND ASSETS
		
		super.load()
		
		this.leave_group('load')
	}
	
	
	get_models_names()
	{
		return this.get_resources_names('models')
	}
	
	
	get_views_names()
	{
		return this.get_resources_names('views')
	}
	
	
	get_menubars_names()
	{
		return this.get_resources_names('menubars')
	}
	
	
	get_menus_names()
	{
		return this.get_resources_names('menus')
	}
	
	
	get_resources_names(arg_type)
	{
		let resources = []
		
		this.$settings.get('modules').toArray().forEach(
			(module_name) => {
				let module_resources = null
				if (arg_type)
				{
					module_resources = config.getIn('modules', module_name, 'resources_by_type', arg_type).toArray()
				} else {
					module_resources = config.getIn('modules', module_name, 'resources_by_name').toArray()
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

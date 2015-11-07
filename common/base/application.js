
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import Instance from './instance'
import { store, config, runtime } from '../store/index'
// import rt from './runtime'



let context = 'common/base/application'
let debug = debug_fn(context)



export default class Application extends Instance
{
	constructor(arg_name)
	{
		assert( config.has_collection('applications'), context + ':not found config.applications')
		let settings = config.hasIn(['applications', arg_name]) ? config.getIn(['applications', arg_name]) : {}
		
		super('applications', 'Application', arg_name, settings)
		
		this.is_application = true
	}
	
	
	load()
	{
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		// ENABLE APP SERVICES
		this.$settings.services.provides.forEach(
			(service_name) => {
				let service = runtime.get_collection_item('services', service_name)
				service.activate(this)
				service.enable()
			}
		)
	}
	
	
	get_models_names()
	{
		// let models_names = []
		// this.$settings.get('modules').toArray().forEach(
		// 	(module_name) => {
		// 		let module_models = config.getIn('modules', module_name, 'resources_by_type', 'models').toArray()
		// 		module_models.forEach(
		// 			(model_name) => {
		// 				models_names.push(model_name)
		// 			}
		// 		)
		// 	}
		// )
		// return models_names
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


import T from 'typr'
import assert from 'assert'

import { config } from '../store/index'

import Instance from './instance'
import Collection from './collection'
import Resource from './resource'
import Database from '../resources/database'
import ModelSequelize from '../resources/model_sequelize'
import View from '../resources/view'
import Menu from '../resources/menu'
import Menubar from '../resources/menubar'



let context = 'common/base/module'



/**
 * @file Module resource class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Module extends Instance
{
	/**
	 * Create a module resource instance.
	 * @extends Instance
	 * @param {string} arg_name - module name
	 * @returns {nothing}
	 */
	constructor(arg_name)
	{
		assert( config.has_collection('modules'), context + ':not found config.modules')
		const cfg = config()
		let settings = cfg.hasIn(['modules', arg_name]) ? cfg.getIn(['modules', arg_name]) : {}
		
		super('modules', 'Module', arg_name, settings)
		
		this.is_module = true
		this.resources = new Collection()
	}
	
	
	/**
	 * Load module settings.
	 * @returns {nothing}
	 */
	load()
	{
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
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
				// console.log(res_name, 'res_name')
				// console.log(res_cfg, 'res_cfg')
				
				let resource = this.create_resource(res_name, res_cfg)
				resource.load()
				this.resources.add(resource)
			}
		)
	}
	
	
	/**
	 * Create a module resource.
	 * @param {string} arg_name - resource name.
	 * @param {object} arg_settings - resource settings.
	 * @returns {Resource|Database|View|Model|Menu|Menubar} - an Resource instance.
	 */
	create_resource(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		const res_type =arg_settings.get('type')
		assert( T.isString(res_type), context + ':bad type string')
		
		switch(res_type)
		{
			case 'connexions': return new Database(arg_name, arg_settings)
			case 'views': return new View(arg_name, arg_settings)
			case 'models': return new ModelSequelize(arg_name, arg_settings)
			case 'menus': return new Menu(arg_name, arg_settings)
			case 'menubars': return new Menubar(arg_name, arg_settings)
		}
		
		return new Resource(arg_name, arg_settings)
	}
}

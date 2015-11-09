
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../store/index'

import Instance from './instance'
import Collection from './collection'
import Resource from './resource'



let context = 'common/base/module'


export default class Module extends Instance
{
	constructor(arg_name)
	{
		assert( config.has_collection('modules'), context + ':not found config.modules')
		const cfg = config()
		let settings = cfg.hasIn(['modules', arg_name]) ? cfg.getIn(['modules', arg_name]) : {}
		
		super('modules', 'Module', arg_name, settings)
		
		this.is_module = true
		this.resources = new Collection()
	}
	
	
	load()
	{
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		// ENABLE APP SERVICES
		const cfg = this.$settings.get('resources_by_name').toMap().toJS()
		Object.keys(cfg).forEach(
			(res_name) => {
				const res_cfg = cfg[res_name]
				let resource = new Resource(res_name, res_cfg)
				resource.load()
				this.resources.add(resource)
			}
		)
	}
}

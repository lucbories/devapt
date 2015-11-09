
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../store/index'

import Instance from './instance'



let context = 'common/base/resource'


export default class Resource extends Instance
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('resources', 'Resource', arg_name, arg_settings)
		
		this.is_resource = true
	}
	
/*	
	load()
	{
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		// ENABLE APP SERVICES
		this.$settings.resources_by_name.forEach(
			(res_cfg, res_name) => {
				let resource = new Resource()
				resource.load()
				this.resources.add(resource)
			}
		)
	}*/
}

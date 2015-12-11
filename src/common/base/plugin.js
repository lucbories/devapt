
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../store/index'

import Instance from './instance'



let context = 'common/base/plugin'


export default class Plugin extends Instance
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('plugins', 'Plugin', arg_name, arg_settings)
		
		this.is_plugin = true
	}
	
/*	
	load()
	{
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		// ENABLE APP SERVICES
		this.$settings.plugins_by_name.forEach(
			(res_cfg, res_name) => {
				let plugin = new Resource()
				plugin.load()
				this.plugins.add(plugin)
			}
		)
	}*/
}

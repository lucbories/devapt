
import T from 'typr'
import assert from 'assert'

import Instance from './instance'



let context = 'common/base/resource'


export default class Resource extends Instance
{
	constructor(arg_name, arg_settings, arg_class, arg_context)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('resources', arg_class ? arg_class : 'Resource', arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_resource = true
	}
	
	
	export_settings()
	{
		return this.$settings.toJS()
	}
}

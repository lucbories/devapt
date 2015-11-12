
import T from 'typr'
import assert from 'assert'

import Resource from './resource'



let context = 'common/base/view'


export default class View extends Resource
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, 'View')
		
		this.is_view= true
		this.$type = 'views'
	}
	
	load()
	{
		// const cx_obj = this.$settings.toJS()
		
		super.load()
	}
	
	
	export_settings()
	{
		let cfg = this.$settings.toJS()
		
		return cfg
	}
}
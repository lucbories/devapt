
import T from 'typr'
import assert from 'assert'

import Resource from './resource'



let context = 'common/base/menubar'


export default class Menubar extends Resource
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, 'Menubar')
		
		this.is_menubar= true
		this.$type = 'menubars'
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

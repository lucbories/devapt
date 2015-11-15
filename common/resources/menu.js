
import T from 'typr'
import assert from 'assert'

import Resource from '../base/resource'



let context = 'common/base/menu'


export default class Menu extends Resource
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, 'Menu')
		
		this.is_menu= true
		this.$type = 'menus'
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

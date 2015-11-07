import T from 'typr'
import assert from 'assert'

import Loggable from './loggable'

import uid from '../utils/uid'
import { is_browser, is_server } from '../utils/is_browser'
import { store, config } from '../store/index'


let context = 'common/base/instance'



export default class Instance extends Loggable
{
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_log_context)
	{
		Loggable.static_info(context, 'Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		
		assert( T.isString(arg_collection) && arg_collection.length > 0, context + ':bad collection string')
		assert( store.has_collection(arg_collection), context + ':bad collection')
		assert( T.isString(arg_class) && arg_class.length > 0, context + ':bad class [' + arg_class + ']')
		assert( T.isString(arg_name) && arg_name.length > 0, context + ':bad name [' + arg_name + ']')
		
		const my_uid = uid()
		const my_info = `[${arg_collection},${arg_name},${my_uid}] `
		const my_context = arg_log_context ? arg_log_context + my_info : context + my_info
		
		super(my_context)
		
		this.is_instance = true
		this.$uid = my_uid
		this.$type = arg_collection
		this.$class = arg_class
		this.$name = arg_name
		
		this.set_settings(arg_settings)
	}
	
	
	set_settings(arg_settings)
	{
		this.$settings = arg_settings
	}
	
	
	get_settings()
	{
		return this.$settings
	}
	
	
	get_setting(arg_name)
	{
		return this.$settings.has(arg_name) ? this.$settings.get(arg_name) : null
	}
	
	
	get_descriptor()
	{
		return { $type:this.$type, $class:this.$class, $id:this.$id, $name:this.$name }
	}
	
	
	is_browser() { return is_browser() }
	is_server() { return is_server() }
}

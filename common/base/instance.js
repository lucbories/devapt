import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import uid from '../utils/uid'

import { store, config, runtime } from '../store/index'



let context = 'common/base/instance'
let debug = debug_fn(context)



export default class Instance
{
	constructor(arg_collection, arg_class, arg_name, arg_settings)
	{
		debug('Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		
		assert( T.isString(arg_collection) && arg_collection.length > 0, context + ':bad collection string')
		assert( store.has_collection(arg_collection), context + ':bad collection')
		assert( T.isString(arg_name) && arg_name.length > 0, context + ':bad name')
		
		this.$uid = uid()
		this.$type = arg_collection
		this.$class = arg_class
		this.$name = arg_name
		
		this.set_settings(arg_settings)
		
		this.register_instance()
	}
	
	
	set_settings(arg_settings)
	{
		this.$settings = arg_settings
	}
	
	
	get_settings()
	{
		return this.$settings
	}
	
	
	register_instance()
	{
		runtime.set_collection_item(this.$type, this.$name, this)
	}
	
	
	unregister_instance()
	{
		runtime.unset_collection_item(this.$type, this.$name)
	}
	
	
	get_descriptor()
	{
		return { $type:this.$type, $class:this.$class, $id:this.$id, $name:this.$name }
	}
}

import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import uid from './uid'

import { store } from '../../common/store/index'



let context = 'common/utils/instance'
let debug = debug_fn(context)



export default class Instance
{
	constructor(arg_collection, arg_class, arg_name, arg_config)
	{
		debug('Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		
		assert( T.isString(arg_collection) && arg_collection.length > 0, context + ':bad collection string')
		assert( store.has_collection(arg_collection), context + ':bad collection')
		assert( T.isString(arg_name) && arg_name.length > 0, context + ':bad name')
		
		this.$uid = uid()
		this.$type = arg_collection
		this.$class = arg_class
		this.$name = arg_name
		this.$config = arg_config
	}
	
	
	set_config(arg_config)
	{
		
	}
	
	
	get_config()
	{
		return this.$config
	}
	
	
	get_descriptor()
	{
		return { $type:this.$type, $class:this.$class, $id:this.$id, $name:this.$name }
	}
}

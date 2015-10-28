import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import uid from './uid'


let context = 'common/utils/instance'
let debug = debug_fn(context)


export const types = ['views', 'models', 'menubars', 'menus', 'loggers', 'services', 'applications']

export default class Instance {
	constructor(arg_type, arg_name)
	{
		assert( T.isString(arg_type) && arg_type.length > 0, context + ':bad type string')
		assert( types.indexOf(arg_type) > -1, context + ':bad type value')
		assert( T.isString(arg_name) && arg_name.length > 0, context + ':bad name')
		
		this.uid = uid()
		this.type = arg_type
		this.name = arg_name
	}
}
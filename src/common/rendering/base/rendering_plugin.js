
import T from 'typr'
import assert from 'assert'


const context = 'common/rendering/base/rendering_plugin'



export default class RenderingPlugin
{
	constructor(arg_name, arg_version)
	{
		this.is_rendering_plugin = true
		this.$name = arg_name
		this.$version = arg_version ? arg_version : '0.0.0'
	}
	
	
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':bad class string')
		
		
		
		assert(false, context + ':bad class name')
	}
	
	
	has(arg_class_name)
	{
		return false
	}
	
	
	get_name()
	{
		return this.$name
	}
	
	
	get_version()
	{
		return this.$version
	}
}

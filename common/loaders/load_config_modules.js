
import assert from 'assert'
import T from 'typr'

import logs from '../utils/logs'



let context = 'common/loaders/load_config_modules'
let error_msg_bad_config = context + ':bad config'
let error_msg_bad_base_dir = context + ':module.base_dir should be a string'
let error_msg_bad_resources = context + ':module.resources should be an array'
let error_msg_bad_templates = context + ':module.templates should be an array'
let error_msg_bad_includes = context + ':module.includes should be an array'
let error_msg_bad_resource = context + ':module.resources.* should be a string'
let error_msg_bad_template = context + ':module.templates.* should be a string'
let error_msg_bad_include = context + ':module.includes.* should be a string'



function load_config_modules(arg_modules_config)
{
	logs.info(context, 'loading config.modules')
	
	try{
		// CHECK MODULES
		assert(T.isObject(arg_modules_config), error_msg_bad_config)
		
		// LOOP ON MODULES
		Object.keys(arg_modules_config).forEach(
			function(module_name)
			{
				let module_obj = arg_modules_config[module_name]
				
				// CHECK ATTRIBUTES
				assert(T.isString(module_obj.base_dir.from_file), error_msg_bad_base_dir)
				assert(T.isArray(module_obj.resources), error_msg_bad_resources)
				assert(T.isArray(module_obj.templates), error_msg_bad_templates)
				assert(T.isArray(module_obj.includes), error_msg_bad_includes)
				
				// CHECK ATTRIBUTES ITEMS
				module_obj.resources.forEach( (resource)=> { assert(T.isString(resource), error_msg_bad_resource) } )
				module_obj.templates.forEach( (template)=> { assert(T.isString(template), error_msg_bad_template) } )
				module_obj.includes.forEach( (include)=> { assert(T.isString(include), error_msg_bad_include) } )
			}
		)
	}
	catch(e)
	{
			arg_modules_config = { error: e }
	}
	
	return arg_modules_config
}

export default load_config_modules

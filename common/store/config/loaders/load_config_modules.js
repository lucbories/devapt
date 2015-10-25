
import assert from 'assert'
import T from 'typr'
import path from 'path'

import logs from '../../../utils/logs'
import parser from '../../../parser/parser'



let context = 'common/store/config/loaders/load_config_modules'
let error_msg_bad_config = context + ':bad config'

let error_msg_bad_base_dir = context + ':module.base_dir should be a string'
let error_msg_bad_resources = context + ':module.resources should be an array'
let error_msg_bad_templates = context + ':module.templates should be an array'
let error_msg_bad_includes = context + ':module.includes should be an array'

let error_msg_bad_resource = context + ':module.resources.* should be a string'
let error_msg_bad_template = context + ':module.templates.* should be a string'
let error_msg_bad_include = context + ':module.includes.* should be a string'

let error_msg_bad_module_config = context + ':bad module config'
let error_msg_bad_resource_config = context + ':bad resource config'


const apps_dir = '../../../../apps/private/'



function load_config_modules(arg_modules_config)
{
	logs.info(context, 'loading config.modules')
	
	try{
		// CHECK MODULES
		assert(T.isObject(arg_modules_config), error_msg_bad_config)
		
		// LOOP ON MODULES
		let files = {}
		Object.keys(arg_modules_config).forEach(
			function(module_name)
			{
				if (module_name === 'files')
				{
					return;
				}
				
				logs.info(context, 'loading config.modules.' + module_name)
				
				let module_obj = arg_modules_config[module_name]
				
				// CHECK ATTRIBUTES
				assert(T.isString(module_obj.base_dir), error_msg_bad_base_dir  + ' for module ' + module_name)
				assert(T.isArray(module_obj.resources), error_msg_bad_resources + ' for module ' + module_name)
				assert(T.isArray(module_obj.templates), error_msg_bad_templates + ' for module ' + module_name)
				assert(T.isArray(module_obj.includes),  error_msg_bad_includes  + ' for module ' + module_name)
				
				// CHECK ATTRIBUTES ITEMS
				module_obj.resources.forEach( (resource) => { assert(T.isString(resource), error_msg_bad_resource) } )
				module_obj.templates.forEach( (template) => { assert(T.isString(template), error_msg_bad_template) } )
				module_obj.includes.forEach( (include) => { assert(T.isString(include), error_msg_bad_include) } )
				
				// INIT RESOURCES REPOSITORY
				module_obj.resources_by_name = {}
				module_obj.resources_by_type = {}
				module_obj.resources_by_file = {}
				module_obj.resources_by_type.views = {}
				module_obj.resources_by_type.models = {}
				module_obj.resources_by_type.menubars = {}
				module_obj.resources_by_type.menus = {}
				module_obj.resources_by_type.connexions = {}
				
				// LOAD RESOURCES
				module_obj.resources.forEach(
					(resource_file) => {
						logs.info(context, 'loading config.modules.' + module_name + ' resources file:' + resource_file)
						
						let file_name = path.join(module_obj.base_dir, resource_file)
						let file_path_name = path.join(__dirname , apps_dir, file_name)
						
						let config = parser.read(file_path_name, 'utf8')
						// console.log(config, 'config')
						
						files[file_name] = config
						module_obj.resources_by_file[file_name] = {}
						
						// CHECK MODULE
						assert(T.isObject(config.application), error_msg_bad_module_config + ' for file ' + resource_file)
						
						const types = ['views', 'models', 'menubars', 'menus', 'connexions']
						types.forEach(
							function(type_name) {
								// logs.info(context, 'loading config.modules.' + module_name + ' resources file:' + resource_file + ' of type:' + type_name)
								
								if ( config.application[type_name] && T.isObject(config.application[type_name]) )
								{
									Object.keys(config.application[type_name]).forEach(
										(res_name) => {
											// logs.info(context, 'loading config.modules.' + module_name + ' resources file:' + resource_file + ' of type:' + type_name + ' for ' + res_name)
											
											let res_obj = config.application[type_name][res_name]
											
											if (type_name !== 'menus' && type_name !== 'models')
											{
												assert(T.isString(res_obj.class_name), error_msg_bad_resource_config + ' for file ' + resource_file + ' for resource ' + res_name)
											}
											
											module_obj.resources_by_name[res_name] = res_obj
											module_obj.resources_by_type[type_name][res_name] = res_obj
											module_obj.resources_by_file[file_name][res_name] = res_obj
										}
									)
								}
							}
						)
					}
				)	
			}
		)
		
		
		// CACHE FILES CONTENT
		arg_modules_config.files = files
	}
	catch(e)
	{
		arg_modules_config = { error: { context:context, exception:e }, error_msg:e.toString() }
	}
	
	return arg_modules_config
}

export default load_config_modules

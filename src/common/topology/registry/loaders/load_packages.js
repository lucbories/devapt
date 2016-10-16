// NPM IMPORTS
import assert from 'assert'
import T from 'typr'
import path from 'path'

// COMMON IMPORTS
import parser from '../../../utils/parser/parser'


const context = 'common/topology/registry/loaders/load_packages'



let error_msg_bad_config = context + ':bad config'

let error_msg_bad_base_dir = context + ':package.base_dir should be a string'
let error_msg_bad_resources = context + ':package.resources should be an array'
let error_msg_bad_templates = context + ':package.templates should be an array'
let error_msg_bad_includes = context + ':package.includes should be an array'

let error_msg_bad_resource = context + ':package.resources.* should be a string'
let error_msg_bad_template = context + ':package.templates.* should be a string'
let error_msg_bad_include = context + ':package.includes.* should be a string'

let error_msg_bad_package_config = context + ':bad package config'
let error_msg_bad_resource_config = context + ':bad resource config'



function load_packages(logs, arg_packages_config, arg_base_dir)
{
	logs.info(context, 'loading world.packages')
	
	try{
		// CHECK PACKAGES
		assert(T.isObject(arg_packages_config), error_msg_bad_config)
		
		// LOOP ON PACKAGES
		let files = {}
		Object.keys(arg_packages_config).forEach(
			function(arg_package_name)
			{
				if (arg_package_name === 'files')
				{
					return
				}
				
				logs.info(context, 'loading world.packages.' + arg_package_name)
				
				let package_obj = arg_packages_config[arg_package_name]
				load_package(logs, arg_package_name, package_obj, arg_base_dir, files)
				// console.log(package_obj, 'package_obj')

				// PROCESS ERRORS
				if (package_obj.services && package_obj.services.error)
				{
					throw 'error in packages.' + arg_package_name + '.services:' + e 
				}
				if (package_obj.datasources && package_obj.datasources.error)
				{
					throw 'error in packages.' + arg_package_name + '.datasources:' + e 
				}
				if (package_obj.models && package_obj.models.error)
				{
					throw 'error in packages.' + arg_package_name + '.models:' + e 
				}
				if (package_obj.views && package_obj.views.error)
				{
					throw 'error in packages.' + arg_package_name + '.views:' + e 
				}
				if (package_obj.menus && package_obj.menus.error)
				{
					throw 'error in packages.' + arg_package_name + '.menus:' + e 
				}
				if (package_obj.menubars && package_obj.menubars.error)
				{
					throw 'error in packages.' + arg_package_name + '.menubars:' + e 
				}
			}
		)
		
		// CACHE FILES CONTENT
		arg_packages_config.files = files
	}
	catch(e)
	{
		arg_packages_config = { error: { context:context, exception:e, error_msg:e.toString() } }
		// console.error(context, arg_packages_config)
	}
	
	return arg_packages_config
}


function load_package(logs, arg_package_name, arg_package_config, arg_base_dir, files)
{
	logs.info(context, 'loading world.packages.' + arg_package_name)
	
	// CHECK PACKAGES
	assert(T.isObject(arg_package_config), error_msg_bad_config)

	
	// LOAD SERVICES
	if (T.isString(arg_package_config.services))
	{
		logs.info(context, 'loading world.packages.' + arg_package_name + '.services is a string')
		const file_path_name = path.join(arg_base_dir, arg_package_config.services)
		arg_package_config.services = require(file_path_name).services
	}
	if ( T.isObject(arg_package_config.services) )
	{
		logs.info(context, 'loading world.packages.' + arg_package_name + '.services.*')
		// load_services(arg_package_config.services)
	}

	// CHECK ATTRIBUTES
	assert(T.isString(arg_package_config.base_dir), error_msg_bad_base_dir  + ' for package ' + arg_package_name)
	assert(T.isArray(arg_package_config.resources), error_msg_bad_resources + ' for package ' + arg_package_name)
	assert(T.isArray(arg_package_config.templates), error_msg_bad_templates + ' for package ' + arg_package_name)
	assert(T.isArray(arg_package_config.includes),  error_msg_bad_includes  + ' for package ' + arg_package_name)
	
	// CHECK ATTRIBUTES ITEMS
	arg_package_config.resources.forEach( (resource) => { assert(T.isString(resource), error_msg_bad_resource) } )
	arg_package_config.templates.forEach( (template) => { assert(T.isString(template), error_msg_bad_template) } )
	arg_package_config.includes.forEach( (include) => { assert(T.isString(include), error_msg_bad_include) } )
	
	// INIT RESOURCES REPOSITORY
	arg_package_config.resources_by_name = {}
	arg_package_config.resources_by_type = {}
	arg_package_config.resources_by_file = {}
	arg_package_config.resources_by_type.views = {}
	arg_package_config.resources_by_type.models = {}
	arg_package_config.resources_by_type.menubars = {}
	arg_package_config.resources_by_type.menus = {}
	arg_package_config.resources_by_type.datasources = {}
	arg_package_config.resources_by_type.services = {}
	
	// LOAD RESOURCES
	arg_package_config.resources.forEach(
		(resource_file) => {
			logs.info(context, 'loading world.packages.' + arg_package_name + ' resources file:' + resource_file)
			
			let relative_path_name = path.join(arg_package_config.base_dir, resource_file)
			let absolute_path_name = path.join(arg_base_dir , relative_path_name)
			
			let config = parser.read(absolute_path_name, 'utf8')
			// console.log(config, 'config')
			
			files[relative_path_name] = config
			arg_package_config.resources_by_file[relative_path_name] = {}
			
			// CHECK package
			assert(T.isObject(config.application), error_msg_bad_package_config + ' for file ' + resource_file)
			
			const types = ['views', 'models', 'menubars', 'menus', 'datasources', 'services']
			types.forEach(
				(type_name)=>{
					// logs.info(context, 'loading config.packages.' + arg_package_name + ' resources file:' + resource_file + ' of type:' + type_name)
					
					if ( config.application[type_name] && T.isObject(config.application[type_name]) )
					{
						Object.keys(config.application[type_name]).forEach(
							(res_name) => {
								// logs.info(context, 'loading config.packages.' + arg_package_name + ' resources file:' + resource_file + ' of type:' + type_name + ' for ' + res_name)
								
								let res_obj = config.application[type_name][res_name]
								
								if (type_name !== 'menus' && type_name !== 'models')
								{
									res_obj.class_name = res_obj.class_name ? res_obj.class_name : res_obj.type
									assert(T.isString(res_obj.class_name), error_msg_bad_resource_config + ' for file ' + resource_file + ' for resource ' + res_name)
								}
								
								res_obj.collection = type_name
								
								arg_package_config.resources_by_name[res_name] = res_obj
								arg_package_config.resources_by_type[type_name][res_name] = res_obj
								arg_package_config.resources_by_file[relative_path_name][res_name] = res_obj
							}
						)
					}
				}
			)
		}
	)
	
	return arg_package_config
}


export default load_packages

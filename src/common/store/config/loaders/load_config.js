
import assert from 'assert'
import T from 'typr'
import path from 'path'

import logs from '../../../utils/logs'
import load_config_apps from './load_config_apps'
import load_config_modules from './load_config_modules'
import load_config_plugins from './load_config_plugins'
import load_config_security from './load_config_security'
import load_config_nodes from './load_config_nodes'


let context = 'common/store/config/loaders/load_config'
let error_msg_bad_config = context + ':bad config'

const base_dir = '../../../..'



/**
 * Load the 'config' key of the final state
 * Pure function: (Plain Object) => (new Plain Object)
 */
function load_config(arg_state, arg_initial_config)
{
	logs.info(context, 'loading config')
	
	
	// LOAD APPS.JSON
	try{
		// GET CONFIG JSON
		if (! arg_initial_config)
		{
			arg_initial_config = require('./default_config_app').default_config
		}
		
		let config = arg_initial_config
		config.resources = config.resources || {}
		// config.changes_history = config.changes_history || [{ ts: Date.now(), }]
		
		// LOAD OTHERS FILES
		if (T.isString(config.nodes))
		{
			const file_path_name = path.join(base_dir, 'apps', config.nodes)
			config.nodes = require(file_path_name).nodes
		}
		if (T.isString(config.services))
		{
			const file_path_name = path.join(base_dir, 'apps', config.services)
			config.services = require(file_path_name).services
		}
		if (T.isString(config.applications))
		{
			const file_path_name = path.join(base_dir, 'apps', config.applications)
			config.applications = require(file_path_name).applications
		}
		if (T.isString(config.modules))
		{
			const file_path_name = path.join(base_dir, 'modules', config.modules)
			config.modules = require(file_path_name).modules
		}
		if (T.isString(config.plugins))
		{
			const file_path_name = path.join(base_dir, 'plugins', config.plugins)
			config.plugins = require(file_path_name).plugins
		}
		if (T.isString(config.security))
		{
			const file_path_name = path.join(base_dir, 'apps', config.security)
			config.security = require(file_path_name).security
		}
		
		// CHECK CONFIG PARTS
		assert(T.isObject(config), 'apps.json should be a plain object')
		assert(T.isObject(config.nodes), 'apps.json:nodes should be a plain object')
		assert(T.isObject(config.applications), 'apps.json:applications should be a plain object')
		assert(T.isObject(config.resources), 'apps.json:resources should be a plain object')
		assert(T.isObject(config.modules), 'apps.json:modules should be a plain object')
		assert(T.isObject(config.plugins), 'apps.json:plugins should be a plain object')
		assert(T.isObject(config.security), 'apps.json:security should be a plain object')
		
		
		// LOAD CONFIG PARTS
		arg_state.config = {}
		
		arg_state.config.resources = {}
		arg_state.config.resources.by_name = {} // Resource plain object definitions
		arg_state.config.resources.by_file = {} // Resource names (map name:name)
		arg_state.config.resources.by_module = {} // Resource names (map name:name)
		arg_state.config.resources.by_type = {}
		arg_state.config.resources.by_type.views = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.models = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.menubars = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.menus = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.connexions = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.loggers = {} // Resource names (map name:name)
		
		arg_state.config.nodes        = load_config_nodes(config.nodes)
		arg_state.config.services     = config.services // TODO: bload_config_services(config.services)
		arg_state.config.modules      = load_config_modules(config.modules)
		arg_state.config.plugins      = load_config_plugins(config.plugins)
		arg_state.config.applications = load_config_apps(config.applications, arg_state.config.modules, arg_state.config.plugins, arg_state.config.resources)
		arg_state.config.security     = load_config_security(config.security)
		
		
		// POPULATE STORE RESOURCES
		Object.keys(arg_state.config.modules).forEach(
			(module_name) => {
				if (module_name === 'error' || module_name === 'error_msg' ||module_name === 'files')
				{
					return
				}
				
				// logs.info(context, 'loading config for module ' + module_name)
				
				let module_obj = arg_state.config.modules[module_name]
				arg_state.config.resources.by_module[module_name] = {}
				
				// REGISTER RESOURCE BY NAME
				Object.keys(module_obj.resources_by_name).forEach(
					(resource_name) => {
						// logs.info(context, 'loading config for module ' + module_name + ' for register resource by name for ' + resource_name)
						
						let resource_obj = module_obj.resources_by_name[resource_name]
						arg_state.config.resources.by_name[resource_name] = resource_obj
						arg_state.config.resources.by_module[module_name][resource_name] = resource_name
					}
				)
				
				// REGISTER RESOURCE BY FILE
				Object.keys(module_obj.resources_by_file).forEach(
					(file_name) => {
						// logs.info(context, 'loading config for module ' + module_name + ' for register resource by file:' + file_name)
						arg_state.config.resources.by_file[file_name] = {}
						Object.keys(module_obj.resources_by_file[file_name]).forEach(
							(resource_name) => {
								// logs.info(context, 'loading config for module ' + module_name + ' for register resource by file:' + file_name + ' for ' + resource_name)
								arg_state.config.resources.by_file[file_name][resource_name] = resource_name
							}
						)
					}
				)
				
				// REGISTER RESOURCE BY TYPE
				Object.keys(module_obj.resources_by_type).forEach(
					(type_name) => {
						// logs.info(context, 'loading config for module ' + module_name + ' for register resource by type:' + type_name)
						Object.keys(module_obj.resources_by_type[type_name]).forEach(
							(resource_name) => {
								// logs.info(context, 'loading config for module ' + module_name + ' for register resource by type for resource' + resource_name)
								arg_state.config.resources.by_type[type_name][resource_name] = resource_name
							}
						)
					}
				)
			}
		)
		
		
		// PROCESS ERROR
		if (arg_state.config.modules.error)
		{
			if (! arg_state.config.suberrors)
			{
				arg_state.config.suberrors = []
			}
			arg_state.config.suberrors.push(arg_state.config.modules.error)
		}
		if (arg_state.config.plugins.error)
		{
			if (! arg_state.config.suberrors)
			{
				arg_state.config.suberrors = []
			}
			arg_state.config.suberrors.push(arg_state.config.plugins.error)
		}
		if (arg_state.config.applications.error)
		{
			if (! arg_state.config.suberrors)
			{
				arg_state.config.suberrors = []
			}
			arg_state.config.suberrors.push(arg_state.config.applications.error)
		}
		if (arg_state.config.security.error)
		{
			if (! arg_state.config.suberrors)
			{
				arg_state.config.suberrors = []
			}
			arg_state.config.suberrors.push(arg_state.config.security.error)
		}
	}
	catch(e)
	{
		arg_state.config = { error: { context:context, exception:e, error_msg:e.toString() } }
		console.error(e, context)
	}
	
	return arg_state
}

export default load_config

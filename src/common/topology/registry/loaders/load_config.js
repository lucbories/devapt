// NPM IMPORTS
import assert from 'assert'
import T from 'typr'
import path from 'path'

// COMMON IMPORTS
import LoggerConsole from '../../../loggers/logger_console'

// SERVER IMPORTS
import load_nodes from './load_nodes'
import load_tenants from './load_tenants'
import load_plugins from './load_plugins'
import load_security from './load_security'
import load_deployments from './load_deployments'


const context = 'common/topology/registry/loaders/load_config'



/**
 * Load the 'config' key of the final state
 * Pure function: (Plain Object) => (new Plain Object)
 */
function load_config(arg_state, arg_initial_config, arg_base_dir, arg_world_dir, arg_trace)
{
	const logs = new LoggerConsole(arg_trace ? arg_trace : false)
	
	logs.info(context, 'loading config')
	
	
	arg_world_dir = arg_world_dir ? arg_world_dir : (arg_base_dir ? path.join(arg_base_dir, 'resources') : undefined)

	
	// LOAD JSON
	try {
		// GET CONFIG JSON
		if (! arg_initial_config)
		{
			arg_initial_config = require('./default_config_app').default_config
		}
		
		let config = arg_initial_config
		config.resources = config.resources || {}
		
		// LOAD OTHERS FILES
		if (T.isString(config.nodes))
		{
			const file_path_name = path.join(arg_world_dir, config.nodes)
			config.nodes = require(file_path_name).nodes
		}
		if (T.isString(config.tenants))
		{
			const file_path_name = path.join(arg_world_dir, config.tenants)
			config.tenants = require(file_path_name).tenants
		}
		if (T.isString(config.plugins))
		{
			const file_path_name = path.join(arg_world_dir, config.plugins)
			config.plugins = require(file_path_name).plugins
		}
		if (T.isString(config.deployments))
		{
			const file_path_name = path.join(arg_world_dir, config.deployments)
			config.deployments = require(file_path_name).deployments
		}
		if (T.isString(config.security))
		{
			const file_path_name = path.join(arg_world_dir, config.security)
			config.security = require(file_path_name).security
		}
		if (T.isString(config.loggers))
		{
			const file_path_name = path.join(arg_world_dir, config.loggers)
			config.loggers = require(file_path_name).loggers
		}
		if (T.isString(config.traces))
		{
			const file_path_name = path.join(arg_world_dir, config.traces)
			config.traces = require(file_path_name).traces
		}
		
        
		// CHECK CONFIG PARTS
		assert(T.isObject(config), 'load_config should be a plain object')
		assert(T.isObject(config.nodes), 'load_config:nodes should be a plain object')
		assert(T.isObject(config.tenants), 'load_config:tenants should be a plain object')
		assert(T.isObject(config.plugins), 'load_config:plugins should be a plain object')
		assert(T.isObject(config.deployments), 'load_config:deployments should be a plain object')
		assert(T.isObject(config.security), 'load_config:security should be a plain object')
		assert(T.isObject(config.loggers), 'load_config:loggers should be a plain object')
		assert(T.isObject(config.traces), 'load_config:traces should be a plain object')
		
		// LOAD CONFIG PARTS
		logs.info(context, 'loading config parts')
		arg_state.config = {}
		
		arg_state.config.resources = {}
		arg_state.config.resources.by_name = {} // Resource plain object definitions
		arg_state.config.resources.by_file = {} // Resource names (map name:name)
		arg_state.config.resources.by_package = {} // Resource names (map name:name)
		arg_state.config.resources.by_type = {}
		arg_state.config.resources.by_type.commands = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.services = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.views = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.models = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.menubars = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.menus = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.datasources = {} // Resource names (map name:name)
		arg_state.config.resources.by_type.loggers = {} // Resource names (map name:name)
		
		arg_state.config.nodes = load_nodes(logs, config.nodes, arg_world_dir)
		if (arg_state.config.nodes && ! arg_state.config.nodes.error)
		{
			arg_state.config.tenants = load_tenants(logs, config.tenants, config.plugins, arg_world_dir)

			if (arg_state.config.tenants && ! arg_state.config.tenants.error)
			{
				arg_state.config.plugins = load_plugins(logs, config.plugins, arg_world_dir)

				if (arg_state.config.plugins && ! arg_state.config.plugins.error)
				{
					arg_state.config.deployments  = load_deployments(logs, config.deployments, arg_world_dir)
					arg_state.config.security     = load_security(logs, config.security, arg_world_dir)
					arg_state.config.loggers      = config.loggers
					arg_state.config.traces       = config.traces
				}
			}
		}
		arg_state.config.nodes       = arg_state.config.nodes       ? arg_state.config.nodes : {}
		arg_state.config.tenants     = arg_state.config.tenants     ? arg_state.config.tenants : {}
		arg_state.config.plugins     = arg_state.config.plugins     ? arg_state.config.plugins : {}
		arg_state.config.deployments = arg_state.config.deployments ? arg_state.config.deployments : {}
		arg_state.config.security    = arg_state.config.security    ? arg_state.config.security : {}
		arg_state.config.loggers     = arg_state.config.loggers     ? arg_state.config.loggers : {}
		arg_state.config.traces      = arg_state.config.traces      ? arg_state.config.traces : {}
		
		// POPULATE STORE RESOURCES
		const has_error = arg_state.config.nodes.error || arg_state.config.tenants.error || arg_state.config.plugins.error || arg_state.config.security.error 
		if ( ! has_error)
		{
			logs.info(context, 'populate store resources, loop on tenants packages')
			Object.keys(arg_state.config.tenants).forEach(
				(tenant_name)=>{
					const tenant_cfg = arg_state.config.tenants[tenant_name]
					Object.keys(tenant_cfg.packages).forEach(
						(package_name) => {
							if (package_name === 'error' || package_name === 'error_msg' || package_name === 'files')
							{
								return
							}
							
							logs.info(context, 'loading config for package ' + package_name)
							
							let package_obj = tenant_cfg.packages[package_name]
							arg_state.config.resources.by_package[package_name] = {}
							
							// REGISTER RESOURCE BY NAME
							logs.info(context, 'storing resources by name for package ' + package_name)
							Object.keys(package_obj.resources_by_name).forEach(
								(resource_name) => {
									// logs.debug(context, 'loading config for package ' + package_name + ' for register resource by name for ' + resource_name)
									
									let resource_obj = package_obj.resources_by_name[resource_name]
									arg_state.config.resources.by_name[resource_name] = resource_obj
									arg_state.config.resources.by_package[package_name][resource_name] = resource_name
								}
							)
							
							// REGISTER RESOURCE BY FILE
							logs.info(context, 'storing resources by file for package ' + package_name)
							Object.keys(package_obj.resources_by_file).forEach(
								(file_name) => {
									// logs.info(context, 'loading config for package ' + package_name + ' for register resource by file:' + file_name)
									arg_state.config.resources.by_file[file_name] = {}
									Object.keys(package_obj.resources_by_file[file_name]).forEach(
										(resource_name) => {
											// logs.info(context, 'loading config for package ' + package_name + ' for register resource by file:' + file_name + ' for ' + resource_name)
											arg_state.config.resources.by_file[file_name][resource_name] = resource_name
										}
									)
								}
							)
							
							// REGISTER RESOURCE BY TYPE
							logs.info(context, 'storing resources by type for package ' + package_name)
							Object.keys(package_obj.resources_by_type).forEach(
								(type_name) => {
									// logs.info(context, 'loading config for package ' + package_name + ' for register resource by type:' + type_name)
									Object.keys(package_obj.resources_by_type[type_name]).forEach(
										(resource_name) => {
											// logs.debug(context, 'loading config for package ' + package_name + ' for register resource by type for ' + resource_name)
											arg_state.config.resources.by_type[type_name][resource_name] = resource_name
										}
									)
								}
							)
							
							logs.info(context, 'storing resources end for package ' + package_name)
						}
					)
				}
			)
		}

		
		// PROCESS ERROR
		logs.info(context, 'processing errors')
		const add_sub_error = (arg_type, arg_error) => {
			if (! arg_state.config.error)
			{
				arg_state.config.error = { context:context, exception:'has sub errors', error_msg:'see sub errors' }
			}
			if (! arg_state.config.suberrors)
			{
				arg_state.config.error.suberrors = []
			}
			const msg = arg_error.error_msg ? arg_error.error_msg : arg_error.exception
			arg_state.config.error.suberrors.push( {type:arg_type, context:arg_error.context, error_msg:msg} )
			
		}
		
		if (arg_state.config.nodes.error)
		{
			add_sub_error('nodes', arg_state.config.nodes.error)
		}
		if (arg_state.config.tenants.error)
		{
			add_sub_error('tenants', arg_state.config.tenants.error)
		}
		if (arg_state.config.plugins.error)
		{
			add_sub_error('plugins', arg_state.config.plugins.error)
		}
		if (arg_state.config.deployments.error)
		{
			add_sub_error('deployments', arg_state.config.deployments.error)
		}
		if (arg_state.config.security.error)
		{
			add_sub_error('security', arg_state.config.security.error)
		}
	}
	catch(e)
	{
		arg_state.config = { error: { context:context, exception:e, error_msg:e.toString() } }
		// console.error(e, context)
	}
	
    // console.log( Object.keys(arg_state.config.resources.by_name), 'resources' )
	
	logs.info(context, 'loading config is finished, returns state')
	return arg_state
}

export default load_config

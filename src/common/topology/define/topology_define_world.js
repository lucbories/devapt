// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import fs from 'fs'

// COMMON IMPORTS
import Collection from '../../base/collection'
import TopologyDefineItem from './topology_define_item'
import TopologyDefineTenant from './topology_define_tenant'
import TopologyDefineNode from './topology_define_node'
import TopologyDefinePlugin from './topology_define_plugin'


let context = 'common/topology/define/topology_define_world'



/**
 * @file TopologyDefineWorld class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineWorld extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineWorld instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	{
	 * 		"tenants":{...},
	 * 		"nodes":{...},
	 * 		"plugins":{...},
	 * 
	 * 		"security":{...},
	 * 
	 * 		"loggers":{...},
	 * 		"traces":{...}
	 * 	}
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {Runtime} arg_runtime - runtime instance.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_runtime, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'TopologyDefineWorld', log_context)
		
		this.is_topology_define_world = true

		this.topology_type = 'world'
		
		this._runtime = arg_runtime

		this.load_loggers()
		this.load_security()
		
		this.declare_collection('tenants', 'tenant', TopologyDefineTenant)
		this.declare_collection('nodes',   'node',   TopologyDefineNode)
		this.declare_collection('plugins', 'plugin', TopologyDefinePlugin, this.load_plugin.bind(this))

		assert( T.isObject(this._runtime) && this._runtime.is_server_runtime, context + ':constructor')

		
		this.info('World is created')
	}



	/**
	 * Load topology world loggers.
	 * 
	 * @returns {Promise}
	 */
	load_loggers()
	{
		this.info('load_loggers')
		
		const loggers_settings = this.get_setting_js('loggers', {})
		const traces_settings = this.get_setting_js('traces', {})
		
		const runtime = this._runtime
		loggers_settings.traces = traces_settings
		runtime.logger_manager.load(loggers_settings)

		this.info('load_loggers:async is resolved with success')
		return Promise.resolve(true)
	}



	/**
	 * Load topology world security.
	 * 
	 * @returns {Promise}
	 */
	load_security()
	{
		this.enter_group('load_security')
		
		const runtime = this._runtime
		const security_settings = runtime.get_registry().root.get('security')
		// console.log(security_settings, context + ':load_security:security_settings')
		
		runtime.security().load(security_settings)

		this.leave_group('load_security:async is resolved with success')
		return Promise.resolve(true)
	}



	/**
	 * Load rendering plugins.
	 * 
	 * @returns {Promise}
	 */
	load_plugin(arg_plugin)
	{
		switch(arg_plugin.topology_plugin_type){
			case 'rendering': {
				return this.load_rendering_plugin(arg_plugin)
			}
			case '...':{
				return Promise.resolve(true)
			}
		}
		return Promise.reject('bad plugin type [' + arg_plugin.topology_plugin_type + ']')
	}


	/**
	 * Load rendering plugins.
	 * 
	 * @returns {Promise}
	 */
	load_rendering_plugin(arg_plugin)
	{
		const self = this
		self.enter_group('load_rendering_plugin')

		const plugins_mgr = self._runtime.get_plugins_factory().get_rendering_manager()
		assert( T.isObject(arg_plugin) && arg_plugin.is_topology_define_plugin, context + ':load_rendering_plugin:bad plugin object')
		assert( T.isObject(plugins_mgr) && plugins_mgr.is_plugins_manager, context + ':load_rendering_plugin:bad plugin manager object')

		this.debug('plugin=%s', arg_plugin.get_name())

		let plugin_class = undefined

		// RENDERING PLUGIN IS LOADED FROM A NPM PACKAGE
		if ( T.isString(arg_plugin.topology_plugin_package) )
		{
			// TODO : loading packages without full path?
			let file_path = undefined
			const pkg = arg_plugin.topology_plugin_package

			file_path = self.runtime.context.get_absolute_path('./node_modules/', pkg)
			let file_path_stats = file_path ? fs.statSync(file_path) : undefined
			if ( ! file_path_stats || ! file_path_stats.isDirectory())
			{
				file_path = self.runtime.context.get_absolute_path('../node_modules/', pkg)
				file_path_stats = file_path ? fs.statSync(file_path) : undefined
				if ( ! file_path_stats || ! file_path_stats.isDirectory())
				{
					file_path = self.runtime.context.get_absolute_path('../../node_modules/', pkg)
					file_path_stats = file_path ? fs.statSync(file_path) : undefined
					if ( ! file_path_stats || ! file_path_stats.isDirectory())
					{
						file_path = self.runtime.context.get_absolute_path('../../../node_modules/', pkg)
						file_path_stats = file_path ? fs.statSync(file_path) : undefined
						if ( ! file_path_stats || ! file_path_stats.isDirectory())
						{
							file_path = undefined
						}
					}
				}
			}

			if (file_path)
			{
				console.log(context + ':load_rendering_plugins:package=%s for plugin=%s at=%s', pkg, arg_plugin.get_name(), file_path)
				plugin_class = require(file_path)
			}
			else
			{
				file_path = undefined
				console.error(context + ':load_rendering_plugins:not found package=%s for plugin=%s at=%s', pkg, arg_plugin.get_name())
			}
		}


		// LOAD A PLUGIN FROM A PATH
		else if ( T.isString(arg_plugin.topology_plugin_file) )
		{
			const file_path = self.runtime.context.get_absolute_path(arg_plugin.topology_plugin_file)
			console.log(context + ':load_rendering_plugins:file_path=%s for plugin=%s', file_path, arg_plugin.get_name())

			plugin_class = require(file_path)
		}


		// REGISTER PLUGIN CLASS
		if (plugin_class)
		{
			if ( plugin_class.default )
			{
				plugin_class = plugin_class.default
			}

			const plugin = new plugin_class(plugins_mgr)
			plugins_mgr.load_at_first(plugin)

			console.log(context + ':load_rendering_plugins:plugin=%s is loaded', arg_plugin.get_name())
		}
			
			
		self.leave_group('load_rendering_plugin')
		return Promise.resolve(true)
	}



	/**
	 * Find a Tenant / Application / service.
	 * 
	 * @param {string} arg_tenant_name - tenant name.
	 * @param {string} arg_env_name - environment name. (TODO)
	 * @param {string} arg_application_name - application name.
	 * @param {string} arg_svc_name - service name.
	 * 
	 * @returns {TopologyDefineService|undefined}
	 */
	find_service(arg_tenant_name, arg_application_name, arg_svc_name)
	{
		const tenant = this.tenant(arg_tenant_name)
		if(! tenant)
		{
			self.error('tenant not found for ' + arg_tenant_name)
			return
		}

		const application = tenant.application(arg_application_name)
		if(! application)
		{
			self.error('application not found for ' + arg_application_name + ' for tenant ' + arg_tenant_name)
			return
		}

		const defined_svc = application.find_resource(arg_svc_name, 'services')
		return defined_svc
	}


	
	/**
	 * Find a Tenant / Application.
	 * 
	 * @param {Credentials} arg_credentials - credentials instance.
	 * 
	 * @returns {TopologyDefineApplication|undefined}
	 */
	find_application_with_credentials(arg_credentials)
	{
		const tenant_name = arg_credentials.get_tenant()
		// const env_name = arg_credentials.get_env()// TODO
		const application_name = arg_credentials.get_application()

		const tenant = this.tenant(tenant_name)
		if(! tenant)
		{
			self.error('tenant not found for ' + tenant_name)
			return
		}

		const application = tenant.application(application_name)
		return application
	}


	
	/**
	 * Find a Tenant / Application / service.
	 * 
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {string} arg_resource_name - resource name.
	 * @param {string} arg_resource_type - resource type.
	 * 
	 * @returns {TopologyDefineService|undefined}
	 */
	find_resource_with_credentials(arg_credentials, arg_resource_name, arg_resource_type)
	{
		const tenant_name = arg_credentials.get_tenant()
		const env_name = arg_credentials.get_env() // TODO
		const application_name = arg_credentials.get_application()

		const tenant = this.tenant(tenant_name)
		if(! tenant)
		{
			self.error('tenant not found for ' + tenant_name)
			return
		}

		const application = tenant.application(application_name)
		if(! application)
		{
			self.error('resource of type ' + arg_resource_type + ' with name ' + arg_resource_name + 'not found for ' + application_name + ' for tenant ' + tenant_name)
			return
		}

		const defined_svc = application.find_resource(arg_resource_name, arg_resource_type)
		return defined_svc
	}


	
	/**
	 * Find a Tenant / Application / service.
	 * 
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {string} arg_svc_name - service name.
	 * 
	 * @returns {TopologyDefineService|undefined}
	 */
	find_service_with_credentials(arg_credentials, arg_svc_name)
	{
		return this.find_resource_with_credentials(arg_credentials, arg_svc_name, 'services')
	}
}

// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Collection from '../../base/collection'
import topology_registry from '../registry/index'
import TopologyDefineItem from './topology_define_item'
// import topology_define_world from './index'


let context = 'common/topology/define/topology_define_application'



/**
 * @file Application class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class TopologyDefineApplication extends TopologyDefineItem
{
    /**
     * TopologyDefineApplication constructor.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"applications":{
	 * 		"applicationA":{
	 * 			"url":"/../",
	 * 	
	 * 			"provided_services":{
	 * 				"devtools_store": { servers":["Server1"] },
	 * 				"devtools_panel": { "servers":["Server1"] },
	 * 				"metrics_http": { "servers":["Server2", "Server3] },
	 * 			},
	 * 			"used_services":["messages"],
	 * 			
	 * 			"used_packages": ["devtools"],
	 * 			"used_plugins":["foundation6"],
	 * 			
	 * 			"license":"APACHE-LICENSE-2.0"
	 * 		},
	 * 		"applicationB":{
	 * 			...
	 * 		}
	 * 	}
	 * 
     * @param {string} arg_name - application name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'TopologyDefineApplication', log_context)
		
		this.is_topology_define_application = true

		this.topology_type = 'applications'
		
		this.app_title				= this.get_setting_js('title', undefined)
		this.app_url				= this.get_setting_js('url', undefined)
		this.app_license			= this.get_setting_js('license', undefined)

		this.app_provided_services	= this.get_setting('provided_services', undefined)
		this.app_used_services 		= this.get_setting('used_service', undefined)
		this.app_used_packages		= this.get_setting('used_packages', undefined)
		this.app_used_plugins		= this.get_setting('used_plugins', undefined)

		this.app_assets				= this.get_setting_js('assets', undefined)
		this.app_assets_js			= this.get_setting_js(['assets', 'js'], [])
		this.app_assets_css			= this.get_setting_js(['assets', 'css'], [])
		this.app_assets_img			= this.get_setting_js(['assets', 'img'], [])
		this.app_assets_index		= this.get_setting_js(['assets', 'index'], undefined)

		this.app_default_view		= this.get_setting_js('default_view', undefined)
		this.app_default_menubar	= this.get_setting_js('default_menubar', undefined)
		
		this.info('Application is created')
	}



	/**
	 * Find a resource.
	 * 
	 * @param {string} arg_name - resource name (mandatory).
	 * @param {string} arg_type - resource type name (optional).
	 * 
	 * @returns {TopologyDefineItem|undefined} - resource instance.
	 */
	find_resource(arg_name, arg_type=undefined)
	{
		const tenant = this.get_topology_owner()
		if (! tenant)
		{
			this.error('find_resource:no owner tenant found for this application')
			console.error(context + ':find_resource:no owner tenant found for this application=' + this.get_name())
			return undefined
		}

		const used_packages_array = this.app_used_packages.toArray()
		// console.log('application.find_resource ' + arg_name + ' in packages ' + used_packages_array.toString() )

		let package_index = 0
		for( ; package_index < used_packages_array.length ; package_index++)
		{
			const package_name = used_packages_array[package_index]
			const pkg = tenant.package(package_name)
			// console.log('application.find_resource ' + arg_name + ' in package ' + package_name + ' for type ' + arg_type)

			const resource = pkg.find_resource(arg_name, arg_type)
			// console.log(resource, 'application.find_resource ' + arg_name + ' in package ' + package_name + ' for type ' + arg_type)
			
			if (resource)
			{
				// console.log('application.find_resource ' + arg_name + ' FOUND')
				return resource
			}
		}

		this.warn('application.find_resource NOT FOUND ' + arg_name + ' in packages ' + used_packages_array.toString() )
		return undefined
	}



	/**
	 * Get resources names.
	 * 
	 * @param {string} arg_type - resource type name (optional).
	 * 
	 * @returns {array} - resources names list.
	 */
	get_resources_names(arg_type=undefined)
	{
		const tenant = this.get_topology_owner()
		if (! tenant)
		{
			this.error('get_resources_names:no owner tenant found for this application')
			console.error(context + ':get_resources_names:no owner tenant found for this application=' + this.get_name())
			return undefined
		}

		let names = []
		const used_packages_array = this.app_used_packages.toArray()
		used_packages_array.map(
			(arg_pkg_name)=>{
				const pkg = tenant.package(arg_pkg_name)
				names = names.concat( pkg.get_resources_names(arg_type) )
				// console.log(context + ':get_resources_names:resources names package=%s', arg_pkg_name, names)
			 }
		)
		return names
	}



	/**
	 * Get resources instances.
	 * 
	 * @param {string} arg_type - resources type name.
	 * 
	 * @returns {array} - resources instances list.
	 */
	get_resources(arg_type)
	{
		this.enter_group('get_resources:type ' + arg_type)

		if ( ! T.isString(arg_type) )
		{
			this.leave_group('get_resources:bad type string')
			return []
		}

		const used_packages_array = this.app_used_packages.toJS()
		assert( T.isArray(used_packages_array) , context + ':get_resources:bad used_packages_array array')
		this.debug('used_packages_array=', used_packages_array)

		let instances = []
		used_packages_array.map(
			(arg_pkg_name)=> {
				this.debug('get_resources:loop on package[' + arg_pkg_name + ']')

				const pkg = this.topology_owner.package(arg_pkg_name)
				assert( T.isObject(pkg) && pkg.is_topology_define_package, context + ':get_resources:bad package object for ' + arg_pkg_name)

				if (arg_type in pkg)
				{
					this.debug(':get_resources:type ' + arg_type + ' found for package ' + arg_pkg_name)

					const pkg_resources = pkg[arg_type]()

					if ( T.isObject(pkg_resources) && T.isFunction(pkg_resources.get_latest_items) )
					{
						pkg_resources.get_latest_items().forEach(
							(instance)=>{
								instances.push(instance)
							}
						)
					}

					return
				}

				console.error(context + ':get_resources:type ' + arg_type + ' not found for package ' + arg_pkg_name, pkg)
			}
		)

		this.leave_group('get_resources:type=' + arg_type + ':instances count=' + instances.length)
		return instances
	}



	/**
	 * Get resources instances settings.
	 * 
	 * @param {string} arg_type - resources type name.
	 * 
	 * @returns {array} - resources instances list.
	 */
	get_resources_settings(arg_type)
	{
		let settings = {}
		const instances = this.get_resources(arg_type)
		this.debug('get_resources_settings:type[' + arg_type + ']:count=' + instances.length)

		instances.forEach(
			(instance)=>{
				this.debug('get_resources_settings:instance.is_instance=' + instance.is_instance, ':instance name=' + instance.$name)
				settings[instance.get_name()] = instance.get_settings_js()
			}
		)
		return settings
	}



	/**
	 * Find a rendering function.
	 * 
	 * @param {string} arg_type - rendering item type.
	 * 
	 * @returns {Function} - rendering function.
	 */
	find_rendering_function(arg_type)
	{
		if ( (! T.isString(arg_type) ) || arg_type.length == 0)
		{
			this.error(context + ':find_rendering_function:bad type:', arg_type, typeof arg_type)
			return undefined
		}

		const tenant = this.get_topology_owner()
		if (! tenant)
		{
			this.error(context + ':find_rendering_function:no owner tenant found for this application')
			console.error(context + ':find_rendering_function:no owner tenant found for this application')
			return undefined
		}

		const used_plugins_array = this.app_used_plugins.toArray()
		// console.log('application.find_rendering_function ' + arg_type + ' in packages ' + used_plugins_array.toString() )

		let plugin_index = 0
		for( ; plugin_index < used_plugins_array.length ; plugin_index++)
		{
			const plugin_name = used_plugins_array[plugin_index]
			const plugin = tenant.get_topology_owner().plugin(plugin_name)
			if ( ! plugin )
			{
				console.error(context + ':find_rendering_function:plugin not found for [' + plugin_name + ']')
			} else {
				if ( T.isFunction(plugin.find_rendering_function) )
				{
					const rendering_fn = plugin.find_rendering_function(arg_type)
					// console.log(rendering_fn, context + ':find_rendering_function:type=' + arg_type + ' in plugin ' + plugin_name + (rendering_fn ? ' found' : ' not found'))
				
					if (rendering_fn)
					{
						return rendering_fn
					}
				}
			}
		}

		this.warn(context + ':find_rendering_function: NOT FOUND ' + arg_type + ' in plugin ' + used_plugins_array.toString() )
		return undefined
	}
}


import T from 'typr'
import assert from 'assert'

import DefaultServicePlugin from '../../plugins/default/services_default_plugin'
import ServicesManager from '../plugins/services_manager'
import RenderingManager from '../plugins/rendering_manager'

const context = 'common/plugins/plugins_factory'




/**
 * Plugin class for renderers plugin.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class PluginsFactory
{
    /**
     * Create a PluginsFactory instance.
	 * @returns {nothing}
     */
	constructor(arg_runtime)
	{
		this.is_plugins_factory = true
		
		// SERVICES PLUGINS MANAGER
		this.services_manager = new ServicesManager(context, arg_runtime.get_logger_manager())
		const default_svc_plugin = new DefaultServicePlugin(this.services_manager)
		this.services_manager.register_plugin(default_svc_plugin)
		
		
		// RENDERING PLUGINS MANAGER
		const default_plugin_path = arg_runtime.context.get_absolute_path(__dirname, '../../plugins/default/rendering_default_plugin')
		const plugins = [default_plugin_path]
		this.rendering_manager = new RenderingManager(context, arg_runtime.get_logger_manager())
		this.rendering_manager.load(plugins)
	}
	
	
	/**
	 * Get services plugins manager.
	 * @returns {FeaturesManager}
	 */
	get_services_manager()
	{
		assert( T.isObject(this.services_manager), context + ':get_services_manager:bad services manager object')
		return this.services_manager
	}
	
	
	/**
	 * Get rendering plugins manager.
	 * @returns {FeaturesManager}
	 */
	get_rendering_manager()
	{
		assert( T.isObject(this.rendering_manager), context + ':get_rendering_manager:bad rendering manager object')
		return this.rendering_manager
	}
}

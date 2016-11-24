// SERVER IMPORTS
import FeaturesManager from './features_manager'


const context = 'server/plugins/servers_manager'



/**
 * Servers manager class for plugins managing.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ServersManager extends FeaturesManager
{
    /**
     * Create a ServersManager instance
	 * @extends FeaturesManager
	 * @param {string|undefined} arg_log_context - optional.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
     * @returns {nothing}
     */
	constructor(arg_runtime, arg_log_context, arg_logger_manager)
	{
		super(arg_runtime, arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_service_manager = true
	}
	
	
	/**
	 * Test if plugin is valid.
	 * @param {Plugin} arg_plugin - plugin instance.
	 * @returns {boolean} - given plugin is valid for this manager.
	 */
	plugin_is_valid(arg_plugin)
	{
		return arg_plugin.is_servers_plugin
	}
}

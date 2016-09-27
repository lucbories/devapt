// SERVER IMPORTS
import FeaturesPlugin from './features_plugin'


const context = 'server/plugins/services_plugin'



/**
 * Plugin class for services plugin.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ServicesPlugin extends FeaturesPlugin
{
    /**
     * Create a ServicesPlugin instance.
	 * @extends Instance
	 * @param {PluginsManager} arg_manager - plugins manager
	 * @param {string} arg_name - plugin name
	 * @param {string} arg_version - plugin version.
	 * @returns {nothing}
     */
	constructor(arg_manager, arg_name, arg_version)
	{
		super(arg_manager, arg_name, 'ServicesPlugin', { version: arg_version }, context)
		
		this.is_services_plugin = true
	}
}

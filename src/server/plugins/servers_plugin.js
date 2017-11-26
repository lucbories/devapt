// COMMON IMPORTS
import FeaturesPlugin from '../../common/plugins/features_plugin'


const context = 'server/plugins/servers_plugin'



/**
 * Plugin class for servers plugin.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ServersPlugin extends FeaturesPlugin
{
    /**
     * Create a ServersPlugin instance.
	 * @extends Instance
	 * 
	 * @param {RuntimeBase} arg_runtime - runtime instance.
	 * @param {PluginsManager} arg_manager - plugins manager3
	 * @param {string} arg_name - plugin name3
	 * @param {string} arg_version - plugin version.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_runtime, arg_manager, arg_name, arg_version)
	{
		super(arg_runtime, arg_manager, arg_name, 'ServersPlugin', { version: arg_version }, context)
		
		this.is_servers_plugin = true
	}
}

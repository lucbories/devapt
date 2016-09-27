// COMMON IMPORTS
import TopologyRuntimeItem from './topology_runtime_item'


let context = 'common/topology/runtime/topology_runtime_database'



/**
 * @file Database class: describe a database topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyRuntimeDatabase extends TopologyRuntimeItem
{
	/**
	 * Create a TopologyRuntimeDatabase instance.
	 * @extends TopologyRuntimeItem
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'Database', log_context)
		
		this.is_topology_database = true

		this.topology_type = 'databases'
	}
	


	/**
	 * Load Topology item settings.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		super.load()

		this.db_engine    = this.$settings.get('engine', undefined)
		this.db_host      = this.$settings.get('host', 'localhost')
		this.db_port      = this.$settings.get('port', undefined)
		this.db_name      = this.$settings.get('database', undefined)
		this.db_charset   = this.$settings.get('charset', 'utf8')
		this.db_options   = this.$settings.get('options', undefined)
		this.db_user      = this.$settings.get('user', undefined)
		this.db_password  =this.$settings.get('password', undefined)
		
	}
}

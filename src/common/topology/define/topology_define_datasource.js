// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_datasource'



/**
 * @file Database class: describe a datasource topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineDatasource extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineDatasource instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"datasources":{
	 * 		"datasourceA":{
	 *			:"...",
	 * 			:"..."
	 * 		},
	 * 		"datasourceB":{
	 * 		}
	 * 	}
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
		super(arg_name, arg_settings, 'TopologyDefineDatasource', log_context)
		
		this.is_topology_define_datasource = true

		this.topology_type = 'datasources'

		this.db_engine    = this.get_setting('engine', undefined)
		this.db_host      = this.get_setting('host', 'localhost')
		this.db_port      = this.get_setting('port', undefined)
		this.db_name      = this.get_setting('database', undefined)
		this.db_charset   = this.get_setting('charset', 'utf8')
		this.db_options   = this.get_setting('options', undefined)
		this.db_user      = this.get_setting('user', undefined)
		this.db_password  = this.get_setting('password', undefined)

		this.info('Datasource is created')
	}
}

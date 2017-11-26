// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'
import TopologyDefinePackage from './topology_define_package'
import TopologyDefineApplication from './topology_define_application'


let context = 'common/topology/define/topology_define_tenant'



/**
 * @file TopologyDefineTenant class: describe a Tenant topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineTenant extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineTenant instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"tenants":{
	 * 		"packages":{
	 *			"packageA":{...}
	 * 		},
	 * 		"applications":{
	 *			"applicationA":{...}
	 * 		},
	 * 		"security":{
	 * 			...
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
		super(arg_name, arg_settings, 'TopologyDefineTenant', log_context)
		
		this.is_topology_define_tenant = true

		this.topology_type = 'tenants'

		this.declare_collection('packages', 'package', TopologyDefinePackage)
		this.declare_collection('applications', 'application', TopologyDefineApplication)
		
		this.info('Tenant is created')
	}



	/**
	 * Find a service.
	 * 
	 * @param {string} arg_svc_name - service name.
	 * 
	 * @returns {TopologyDefineService|undefined}
	 */
	get_service(arg_svc_name)
	{
		const packages = this.packages().get_latest_items()
		let i = 0
		let count = packages.length
		for( ; i < count ; ++i)
		{
			const pkg = packages[i]
			const svc = pkg.service(arg_svc_name)
			if (svc)
			{
				return svc
			}
		}
		return undefined
	}
}

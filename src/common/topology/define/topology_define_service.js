// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_service'



/**
 * @file TopologyDefineService class: describe a service topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineService extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineService instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"services":{
	 * 		"serviceA":{
	 * 			"type":"security",
	 * 			"routes":[
	 * 				{
	 * 					"route":"/login",
	 * 					"action":"login"
	 * 				}
	 * 			]
	 * 		},
	 * 		"serviceB":{
	 * 			"type":"html_assets",
	 * 			"routes":[
	 * 				{
	 * 					"route":"/assets2",
	 * 					"directory":"./public/tutorial-1",
	 * 					"default_file":"index.html"
	 * 				},
	 * 			]
	 * 		},
	 * 		"serviceC":{
	 * 			"type":"messages"
	 * 		},
	 * 		"serviceCDe":"middleware",
	 * 			"routes":[
	 * 				{
	 * 					"route":"/home",
	 * 					"page_view":"metrics_tabs",
	 * 					"page_menubar":"default_menubar"
	 * 				}
	 * 			]
	 *		}
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
		super(arg_name, arg_settings, 'TopologyDefineService', log_context)
		
		this.is_topology_define_service = true

		this.topology_type = 'services'
		
		this.topology_service_type         = this.get_setting_js('type', undefined)
		this.topology_service_routes       = this.get_setting_js('routes', undefined)
		this.topology_service_action       = this.get_setting_js('action', undefined)
		this.topology_service_directory    = this.get_setting_js('directory', undefined)
		this.topology_service_default_file = this.get_setting_js('default_file', undefined)
		this.topology_service_page_view    = this.get_setting_js('page_view', undefined)
		this.topology_service_page_menubar = this.get_setting_js('page_menubar', undefined)
		
		this._errors = undefined
		
		this.info('Service is created')
	}
	


	/**
	 * Check functional format.
	 * 
	 * @returns {boolean}
	 */
	is_valid()
	{
		try{
			// CHECK TYPE
			assert( T.isString(this.topology_service_type), context)
			switch(this.topology_service_type) {
				case 'security':
				case 'html_assets':
				case 'middleware':
				case 'messages':
				case 'resources_query':
				case 'rest_api_resources_query':
				case 'rest_api_models_modifier':
					break;
				default: return false
			}

			// CHECK ROUTES
			if (this.topology_service_routes)
			{
				assert( T.isArray(this.topology_service_routes), context)

				this.topology_service_routes.forEach(
					(route_settings)=>{
						assert( T.isString(route_settings.route), context)

						let valid = this.topology_service_action
						valid = valid || (this.topology_service_directory && this.topology_service_default_file)
						valid = valid || this.topology_service_directory
						valid = valid || (this.topology_service_page_view && this.topology_service_page_menubar)

						if (! valid)
						{
							if (! this._errors)
							{
								this._errors = []
							}
							
							this._errors.push(route_settings)
						}
					}
				)
			}
		}
		catch(e)
		{
			return false
		}

		return ! T.isArray(this._errors)
	}
}

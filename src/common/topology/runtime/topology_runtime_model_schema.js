// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import TopologyRuntimeItem from './topology_runtime_item'


let context = 'common/topology/runtime/topology_runtime_model_schema'



/**
 * @file Model class: describe a Model topology item.
 * 
 * FORMAT:
 *			{
 *				"single":"user",
 *				"plural":"users",
 *				
 *				"datasource": "cx_auth",
 *				"container": "users",
 *
 *				"security":{
 *					"role_read": "ROLE_AUTH_USERS_READ",
 *					"role_create": "ROLE_AUTH_USERS_CREATE",
 *					"role_update": "ROLE_AUTH_USERS_UPDATE",
 *					"role_delete": "ROLE_AUTH_USERS_DELETE"
 *					"restrict":{
 *						"where":{
 *							"in":{
 *								"{{application.credentials.user_name}}",
 *								"login"
 *						}
 *					}
 *				},
 *
 *				"triggers":{
 *					"before_create":{
 *						"target":"my object name",
 *						"method":"my method name"
 *					},
 *					"rules_agenda":""
 *				},
 *
 *				"associations": {
 *					"roles": {
 *						"mode": "many_to_many",
 *						"model": "MODEL_AUTH_MANY_USERS_PROFILES",
 *						"left_key": "id_user",
 *						"right_model": "MODEL_AUTH_PROFILES",
 *						"right_key": "id_profile",
 *						"right_fields": [
 *							"id_profile",
 *							"label"
 *						]
 *					}
 *				},
 *
 *				"fields": {
 *					"users_id_user": {
 *						// DATA
 *						"type": "integer",
 *						"auto_increment": false,
 *						"aloow_null": false,
 *						"is_unique":true,
 *						"is_primary_key":true,
 *						"expression":null,
 *						"column":"id",
 *						"alias":"id_user",
 *
 *						// VALUE
 *						"default":"",
 *						"hash": "md5",
 *						"validate_rule": "alphaALPHAnum_-space",
 *						"validate_error_label": "upper or lower alphanumeric and - and _ and space"
 *
 *						// VIEW
 *						"label": "Id",
 *						"placeholder": "Enter lastname",
 *						"is_editable": "0",
 *						"is_visible": "0"
 *					}
 *				}
 *			}
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyRuntimeModelSchema extends TopologyRuntimeItem
{
	/**
	 * Create a TopologyRuntimeModelSchema instance.
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
		super(arg_name, arg_settings, 'Model', log_context)
		
		this.is_topology_model = true

		this.topology_type = 'models'

		// SCHEMA
		this._id_field_name = undefined
		this._fields = {}
	}
	


	/**
	 * Load Topology item settings.
	 * 
	 * @returns {nothing}
	 */
	load() // TODO check and load collection schema
	{
		super.load()
	
		// const schema_format = ""
	}



	/**
	 * Get record id field name.
	 * 
	 * @returns {string}
	 */
	get_id_field_name()
	{
		return this._id_field_name ||this.get_setting('pk_field', undefined)
	}
}



/*

// REGISTER A MODEL
	models[arg_model_name] = {
	  database:arg_cx_name,
	  name:arg_model_name,
	  model:arg_model,
	  roles:arg_roles,
	  includes: arg_includes
	}

*/
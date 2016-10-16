// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_model'



/**
 * @file Model class: describe a Model topology item.
 * 
 * FORMAT: {
 * 		
 *			{
 *				"single":"user",
 *				"plural":"users",
 *				
 *				"datasource": "cx_auth",
 *				"container": "users",
 * 				"cache": { "ttl": 500 },
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
export default class TopologyDefineModel extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineModel instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"modelss":{
	 * 		"modelA":{
	 *			"plural":"users",
	 *				
	 *			"datasource": "cx_auth",
	 *			"container": "users",
	 * 			"cache": { "ttl": 500 },
	 *
	 *			"security":{...},
	 * 			"triggers":{...},
	 * 			"associations": {...},
	 * 			"fields":{...}
	 * 		},
	 * 		"modelB":{
	 *			...
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
		super(arg_name, arg_settings, 'TopologyDefineModel', log_context)
		
		this.is_topology_define_model = true

		this.topology_type = 'models'

		this.declare_collection('fields', 'field',  TopologyDefineDatasource)
		
		this.info('Model is created')

		// SCHEMA
		// this._id_field_name = undefined
		// this._fields = {}
		// this._fields_names = undefined
		// this._fields_defaults = undefined
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
	 * Test given attributes against schema rules.
	 * 
	 * @param {object} - fields values to check.
	 * 
	 * @returns {Promise} - Promise of { is_valid:boolean, errors:{} }
	 */
	validate(arg_attributes) // TODO check and load collection schema
	{
		return { is_valid:true, errors:{} }
	}



	/**
	 * Get record id field name.
	 * 
	 * @returns {string}
	 */
	get_id_field_name()
	{
		return this._id_field_name || this.get_setting('pk_field', undefined)
	}



	/**
	 * Get single name.
	 * 
	 * @returns {string}
	 */
	get_single_name()
	{
		return this.get_setting('single')
	}



	/**
	 * Get plural name.
	 * 
	 * @returns {string}
	 */
	get_plural_name()
	{
		return this.get_setting('plural')
	}



	/**
	 * Get cache TTL.
	 * 
	 * @returns {Number} - default 3000ms.
	 */
	get_ttl()
	{
		return this.get_setting(['cache', 'ttl'], 3000)
	}



	/**
	 * Get record fields names.
	 * 
	 * @returns {array} - array of all schema fields names strings.
	 */
	get_fields_names()
	{
		if (! this._fields_names)
		{
			this._fields_names = Object.keys( this.get_setting_js('fields', new Map()) )
		}
		return this._fields_names
	}



	/**
	 * Get record fields names.
	 * 
	 * @returns {array} - array of all schema fields names strings.
	 */
	get_defaults()
	{
		if (! this._fields_defaults)
		{
			this._fields_defaults = {}
			const fields_names = this.get_fields_names()
			fields_names.forEach(
				(field_name)=>{
					const field_default = this.get_setting(['fields', field_name, 'default'], undefined)
					this._fields_defaults[field_name] = field_default
				}
			)
		}
		return this._fields_defaults
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
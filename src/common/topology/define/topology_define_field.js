// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_field'



/**
 * @file TopologyDefineField class: describe a TopologyDefineField topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineField extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefineField instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"fields":{
	 * 		"fieldA":{
	 *			// DATA
	 *			"type": "integer",
	 *			"auto_increment": false,
	 *			"allow_null": false,
	 *			"is_unique":true,
	 *			"is_primary_key":true,
	 *			"expression":null,
	 *			"column":"id",
	 *			"alias":"id_user",
	 *
	 *			// VALUE
	 *			"default":"",
	 *			"hash": "md5",
	 *			"validate_rule": "alphaALPHAnum_-space",
	 *			"validate_error_label": "upper or lower alphanumeric and - and _ and space"
	 *
	 *			// VIEW
	 *			"label": "Id",
	 *			"placeholder": "Enter lastname",
	 *			"is_editable": "0",
	 *			"is_visible": "0"
	 * 		},
	 * 		"fieldB":{
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
		super(arg_name, arg_settings, 'TopologyDefineField', log_context)
		
		this.is_topology_define_field = true

		this.topology_type = 'fields'

		// DATA
		this.field_type				= this.get_setting('type', 'string')
		this.field_is_primary_key	= this.get_setting('is_primary_key', false)
		this.field_auto_increment	= this.get_setting('auto_increment', false)
		this.field_allow_null		= this.get_setting('allow_null', true)
		this.field_is_unique		= this.get_setting('is_unique', false)
		this.field_expression 		= this.get_setting('expression', undefined)
		this.field_column 			= this.get_setting('column', undefined)
		this.field_alias 			= this.get_setting('alias', arg_name)

		// VALUE
		this.field_default 			= this.get_setting('default', undefined)
		this.field_hash 			= this.get_setting('hash', 'md5')
		this.field_validate_rule 			= this.get_setting('validate_rule', undefined)
		this.field_validate_error_label 	= this.get_setting('validate_error_label', undefined)

		// VIEW
		this.field_label 			= this.get_setting('label', arg_name)
		this.field_placeholder 		= this.get_setting('placeholder', undefined)
		this.field_is_editable 		= this.get_setting('is_editable', true)
		this.field_is_visible 		= this.get_setting('is_visible', true)

		this.info('Field is created')
	}
	


	/**
	 * ...
	 * 
	 * @returns {nothing}
	 */
	is_valid() // TODO check and load collection schema
	{
		try {
			// CHECK FIELD TYPE
			assert( T.isString(this.field_type) )
			switch(this.field_type) {
				case 'integer':
				case 'boolean':
				case 'string':
				// case 'object':
					break
				default:
					return false
			}

			// CHECK PRIMARY KEY
			assert( T.isBoolean(this.field_is_primary_key) )
			assert( T.isBoolean(this.field_allow_null) )
			assert( T.isBoolean(this.field_is_unique) )
			assert( this.field_is_primary_key ? ! this.field_allow_null : true)
		} catch(e) {
			return false
		}

		return true
	}
}
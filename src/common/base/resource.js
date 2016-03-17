
import T from 'typr'
import assert from 'assert'

import Instance from './instance'



let context = 'common/base/resource'



/**
 * @file Resource base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Resource extends Instance
{
	/**
	 * Create a resource instance.
	 * @extends Instance
	 * @param {string} arg_name - instance name
	 * @param {object} arg_settings - instance settings map
	 * @param {string} arg_class - class name
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_class, arg_log_context)
	{
		assert( T.isObject(arg_log_context), context + ':bad settings object')
		
		super('resources', arg_class ? arg_class : 'Resource', arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_resource = true
	}
	
	
	/**
	 * Export instance settings to a plain object.
	 * @returns {object}
	 */
	export_settings()
	{
		return this.$settings.toJS()
	}
}

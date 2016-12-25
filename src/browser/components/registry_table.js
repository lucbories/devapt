// NPM IMPORTS
// import T from 'typr/lib/typr'
// import assert from 'assert'

// BROWSER IMPORTS
import Table from './table'


const context = 'browser/components/registry'



/**
 * @file UI Topology component class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class RegistryTable extends Table
{
	
	/**
	 * Creates an instance of Component.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_state, log_context)
		
		this.is_topology_component = true
		
		this.init()
	}
	
	
	
	/**
	 * Update table with records values.
	 * 
	 * @param {array} arg_values - datas values, plain objects array.
	 * 
	 * @returns {nothing}
	 */
	update_values(arg_values)
	{
		// console.log(arg_values, 'table.update_values')
		
		var self = this
		
		if (! arg_values)
		{
			console.log(table_id, 'no values', 'table.update_values')
			return
		}
		
		const table_id = this.get_dom_id()
		
		// console.log(arg_values, 'table.update_values')
		
		arg_values = Array.isArray(arg_values) ? arg_values : [arg_values]
		
		arg_values.forEach(
			function(values)
			{
				if (values)
				{
					self.update_record_values(values)
				}
			}
		)
	}
}

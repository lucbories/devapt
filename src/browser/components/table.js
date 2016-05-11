
import T from 'typr'
import assert from 'assert'

import Component from './component'


const context = 'browser/components/component'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Table extends Component
{
	
	/**
	 * Creates an instance of Component.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 */
	constructor(arg_runtime, arg_state)
	{
		super(arg_runtime, arg_state)
		this.is_table_component = true
	}
	
	
	
	/**
	 * Append a row.
	 * 
	 * @param {array} arg_rows_array - rows array.
	 * @param {object} arg_options - operation settigs (optional).
	 * 
	 * @returns {nothing}
	 */
	append_row(sarg_rows_array, arg_options)
	{
		arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'append'
		this.update_rows(this.state.dom_id, arg_rows_array, arg_options)
	}
	
	
	
	/**
	 * Prepend a row.
	 * 
	 * @param {array} arg_rows_array - rows array.
	 * @param {object} arg_options - operation settigs (optional).
	 * 
	 * @returns {nothing}
	 */
	prepend_rows(arg_rows_array, arg_options)
	{
		arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'prepend'
		this.update_rows(this.state.dom_id, arg_rows_array, arg_options)
	}

	
	
	/**
	 * Append or prepend a row.
	 * 
	 * @param {string} arg_table_id - table id string.
	 * @param {array} arg_rows_array - rows array.
	 * @param {object} arg_options - operation settigs (optional).
	 * 
	 * @returns {nothing}
	 */
	update_rows(arg_table_id, arg_rows_array, arg_options)
	{
		assert( T.isString(arg_table_id), context + ':update_rows:bad table id string')
		assert( T.isArray(arg_rows_array), context + ':update_rows:bad rows array')
		
		arg_options = arg_options ? arg_options : {}
		arg_options.mode = arg_options.mode ? arg_options.mode : 'append'
		
		var table_body = $('tbody', '#' + arg_table_id)
		
		arg_rows_array.forEach(
			function(row_array)
			{
				var row = $('<tr>')
				
				row_array.forEach(
					(cell) => {
						row.append('<td>' + cell + '</td>')
					}
				)
				
				if (arg_options.mode == 'prepend')
				{
					table_body.prepend(row)
				}
				else
				{
					table_body.append(row)
				}
			}
		)
	}
}

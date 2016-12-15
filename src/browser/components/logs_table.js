// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'

// BROWSER IMPORTS
import Table from './table'


const context = 'browser/components/logs_table'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LogsTable extends Table
{
	
	/**
	 * Creates an instance of LogsTable.
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
		
		this.is_logs_table_component = true

		// DEBUG
		// this.enable_trace()
	}
	
	
	
	/**
	 * Build a row.
	 *
	 * @param {array} arg_row_array - row values array.
	 * @param {integer} arg_row_index - row index.
	 * @param {integer} arg_max_cols - max columns number.
	 * 
	 * @returns {string} - HTML TR string
	 */
	build_row(arg_row_array, arg_row_index, arg_max_cols)
	{
		// console.log(context + ':build_row:rows_index=%i, max_cols=%i', arg_row_index, arg_max_cols, arg_row_array)

		let cells_array = arg_row_array
		// if ( T.isObject(arg_row_array) )
		// {
		// 	cells_array = ['object', arg_row_array.toString()]
		// }

		
		let html_row = '<tr>'
		
		
		if( ! T.isArray(cells_array) )
		{
			console.warn(context + ':build_row:row_array is not an array at rows_index=%i', arg_row_index, cells_array)
			return undefined
		}

		cells_array.forEach(
			(cell, index) => {
				if (arg_max_cols && index > arg_max_cols)
				{
					return undefined
				}
				html_row += '<td>' + cell + '</td>'
			}
		)
		
		html_row += '</tr>'
		return html_row
	}



	/**
	 * Handle new logs.
	 * 
	 * @param {array} arg_logs_array - array of logs { ts:'', level:'', test:'' }.
	 * 
	 * @returns {nothing}
	 */
	// on_new_logs(arg_logs_array)
	// {
	// 	this.do_action_prepend()
	// }
}

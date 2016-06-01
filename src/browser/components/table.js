
import T from 'typr'
import assert from 'assert'

import Container from './container'


const context = 'browser/components/table'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Table extends Container
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
	 * Get container items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_get_count()
	{
		const table_body = $('tbody', '#' + this.get_dom_id())
		return $('tr', table_body).length
	}
	
	
	
	/**
	 * Erase container items.
	 * 
	 * @returns {nothing}
	 */
	ui_items_clear()
	{
		const table_body = $('tbody', '#' + this.get_dom_id())
		return $('tr', table_body).remove()
	}
	
	
	
	/**
	 * Append rows to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * 
	 * @returns {nothing}
	 */
	ui_items_append(arg_items_array)
	{
		// console.log(context + ':ui_items_append:arg_items_array', arg_items_array)
		
		let arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'append'
		this.update_rows(arg_items_array, arg_options)
	}
	
	
	
	/**
	 * Prepend a row.
	 * 
	 * @param {array} arg_items_array - rows array.
	 * 
	 * @returns {nothing}
	 */
	ui_items_prepend(arg_items_array)
	{
		// console.log(context + ':ui_items_prepend:arg_items_array', arg_items_array)
		
		let arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'prepend'
		this.update_rows(arg_items_array, arg_options)
	}
	
	
	
	/**
	 * Remove a row at given position.
	 * 
	 * @param {number} arg_index - row index.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_at_index(arg_index)
	{
		assert( T.isNumber(arg_index), context + ':ui_items_remove_at_index:bad index number' )
		
		const table_body = $('tbody', '#' + this.get_dom_id())
		$('tr:eq(' + arg_index + ')', table_body).remove()
	}
	
	
	
	/**
	 * Remove a row at first position.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_first()
	{
		const table_body = $('tbody', '#' + this.get_dom_id())
		$('tr', table_body).first().remove()
	}
	
	
	
	/**
	 * Remove a row at last position.
	 * 
	 * @param {integer} arg_count - items count to remove.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_last(arg_count)
	{
		// console.log(context + ':ui_items_remove_last:arg_count', arg_count)
		
		if (arg_count <= 0)
		{
			return
		}
		
		const table_body = $('tbody', '#' + this.get_dom_id())
		const rows = $('tr', table_body)
		const last = rows.length - arg_count - 1
		// console.log(context + ':ui_items_remove_last:last', last)
		
		if (last < 0)
		{
			return
		}
		
		$('tr:gt(' + last + ')', table_body).remove()
	}
	
	
	
	
	/**
	 * Append or prepend a row.
	 *
	 * @param {array} arg_rows_array - rows array.
	 * @param {object} arg_options - operation settigs (optional).
	 * 
	 * @returns {nothing}
	 */
	update_rows(arg_rows_array, arg_options)
	{
		const arg_table_id = this.get_dom_id()
		assert( T.isString(arg_table_id), context + ':update_rows:bad table id string:' + arg_table_id)
		assert( T.isArray(arg_rows_array), context + ':update_rows:bad rows array')
		
		const state = this.get_state()
		
		arg_options = arg_options ? arg_options : {}
		arg_options.mode = arg_options.mode ? arg_options.mode : 'append'
		
		const table_body = $('tbody', '#' + arg_table_id)
		const max_cols = T.isNumber(state.max_columns) ? state.max_columns : undefined
		const max_rows = T.isNumber(state.max_rows) ? state.max_rows : undefined
		const max_rows_action = T.isString(state.max_rows_action) ? state.max_rows_action : undefined
		const rows_count = $('tr', table_body).length
		// console.log( context + ':update_rows:rows_count=%i', rows_count)
		
		arg_rows_array.forEach(
			(row_array, row_index) => {
				let html_row = '<tr>'
				
				// console.log(context + ':update_rows:rows_index=%i', row_index, row_array)
				
				row_array.forEach(
					(cell, index) => {
						if (max_cols && index > max_cols)
						{
							return
						}
						html_row += '<td>' + cell + '</td>'
					}
				)
				
				html_row += '</tr>'
				
				if (max_rows && (rows_count + row_index) > max_rows)
				{
					if (max_rows_action == 'remove_bottom')
					{
						// TODO
						console.log('TODO remove_bottom')
					}
					else if (max_rows_action == 'remove_top')
					{
						// TODO
						console.log('TODO remove_top')
					}
					else
					{
						return
					}
					
				}
				if (arg_options.mode == 'prepend')
				{
					table_body.prepend(html_row)
				}
				else
				{
					table_body.append(html_row)
				}
			}
		)
	}
}

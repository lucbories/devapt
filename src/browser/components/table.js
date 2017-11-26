// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'

// COMMON IMPORTS
import html_entities from '../../common/utils/html_entities'

// BROWSER IMPORTS
import Container from '../base/container'


const context = 'browser/components/table'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Table extends Container
{
	
	/**
	 * Creates an instance of Table.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * API:
	 * 		->get_children_component():array - Get view children components.
	 * 
	 * 		->ui_items_get_count():integer - Get container items count.
	 * 
	 * 		->ui_items_append(arg_items_array, arg_items_count):nothing  - Append tems to the container.
	 * 		->ui_items_prepend(arg_items_array, arg_items_count):nothing - Prepend tems to the container.
	 * 		->ui_items_insert_at(arg_index, arg_items_array, arg_items_count):nothing - Insert items at container position index.
	 * 		->ui_items_replace(arg_items_array, arg_items_count):nothing - Replace container items.
	 * 
	 * 		->ui_items_remove_at_index(arg_index):nothing - Remove a row at given position.
	 * 		->ui_items_remove_first():nothing - Remove a row at first position.
	 * 		->ui_items_remove_last(arg_count):nothing - Remove a row at last position.
	 * 
	 * 		->build_row(arg_row_array, arg_row_index, arg_max_cols):string - Build a table row html tag.
	 * 		->update_rows(arg_rows_array, arg_options):nothing - Append or prepend a row.
	 * 		->update_section_collection(arg_collection_def, arg_collection_values):nothing - Update values on a table part.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_state, log_context)
		
		this.is_table_component = true
		
		// DEBUG
		// this.enable_trace()
	}



	/**
	 * Get view children components.
	 * 
	 * @returns {array} - list of Component.
	 */
	get_children_component()
	{
		if ( ! this._children_component)
		{
			this._children_component = []

			const items = this.get_state_value('items', [])
			const headers = this.get_state_value('headers', [])
			const footers = this.get_state_value('headers', [])
			// console.log(context + ':get_children_component:init with items:', items)

			headers.forEach(
				(row)=>{
					if ( T.isArray(row) )
					{
						row.forEach(
							(cell)=>{
								if ( T.isObject(cell) )
								{
									if (cell.is_component)
									{
										this._children_component.push(cell)
										return
									}

									if ( T.isString(cell.view) )
									{
										const component = window.devapt().ui(cell.view)
										if (component && component.is_component)
										{
											this._children_component.push(component)
										}
									}
								}
							}
						)
				
					}
				}
			)

			footers.forEach(
				(row)=>{
					if ( T.isArray(row) )
					{
						row.forEach(
							(cell)=>{
								if ( T.isObject(cell) )
								{
									if (cell.is_component)
									{
										this._children_component.push(cell)
										return
									}

									if ( T.isString(cell.view) )
									{
										const component = window.devapt().ui(cell.view)
										if (component && component.is_component)
										{
											this._children_component.push(component)
										}
									}
								}
							}
						)
				
					}
				}
			)

			items.forEach(
				(row)=>{
					if ( T.isArray(row) )
					{
						row.forEach(
							(cell)=>{
								if ( T.isObject(cell) )
								{
									if (cell.is_component)
									{
										this._children_component.push(cell)
										return
									}
									if ( T.isString(cell.key) )
									{
										if ( T.isString(cell.view) )
										{
											const component = window.devapt().ui(cell.view)
											if (component && component.is_component)
											{
												this._children_component.push(component)
											}
										}
									}
								}
							}
						)
				
					}
				}
			)
		}

		return this._children_component
	}
	
	
	
	/**
	 * Get container items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_get_count()
	{
		const table_body_elem = document.getElementById(this.get_dom_id())
		const tr_elems = table_body_elem.children
		return tr_elems.length
	}
	
	
	
	/**
	 * Erase container items.
	 * 
	 * @returns {nothing}
	 */
	ui_items_clear()
	{
		const table_elem = this.get_dom_element()
		const table_body_elem = table_elem.getElementsByTagName( "tbody" )[0]

		while(table_body_elem.hasChildNodes())
		{
			const tr_elem = table_body_elem.lastChild
			this.delete_row_elem(tr_elem)
			table_body_elem.removeChild(tr_elem)
		}
	}
	
	
	
	/**
	 * Append items to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_append(arg_items_array, arg_items_count)
	{
		// console.log(context + ':ui_items_append:arg_items_array', arg_items_array, arg_items_count)

		let arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'append'
		this.update_rows(arg_items_array, arg_options)
	}
	
	
	
	/**
	 * Prepend items to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_prepend(arg_items_array, arg_items_count)
	{
		// console.log(context + ':ui_items_prepend:%s:count=%s:arg_items_array', this.get_name(), arg_items_count, arg_items_array)
		
		let arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'prepend'
		this.update_rows(arg_items_array, arg_options)
	}
	
	
	
	/**
	 * Replace container items.
	 * 
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_replace(arg_items_array/*, arg_items_count*/)
	{
		// console.log(context + ':ui_items_replace:arg_items_array', arg_items_array.length)
		
		// REMOVE ALL EXISTING ROWS
		this.ui_items_clear()
		
		let arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'replace'
		this.update_rows(arg_items_array, arg_options)
	}
	
	
	
	/**
	 * Insert items at container position index.
	 * 
	 * @param {intege} arg_index - position index.
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_insert_at(arg_index, arg_items_array, arg_items_count)
	{
		assert( T.isArray(arg_items_array), context + ':ui_items_replace:bad items array')
		assert( T.isNumber(arg_items_count), context + ':ui_items_replace:bad items count')
		
		// NOT YET IMPLEMENTED
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
		assert( T.isNumber(arg_index), context + ':ui_items_remove_at_index:bad index number')

		const table_elem = this.get_dom_element()
		const table_body_elem = table_elem.getElementsByTagName( "tbody" )[0]
		if (arg_index < 0 || arg_index >= table_body_elem.children.length)
		{
			console.warn(context + ':ui_items_remove_at_index:%s:bad item index=%s', this.get_name(), arg_index)
			return
		}
		const tr_elem = table_body_elem.children[arg_index]
		this.delete_row_elem(tr_elem)
		table_body_elem.removeChild(tr_elem)
	}
	
	
	
	/**
	 * Remove a row at first position.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_first()
	{
		const table_elem = this.get_dom_element()
		const table_body_elem = table_elem.getElementsByTagName( "tbody" )[0]
		const tr_elem = table_body_elem.firstElementChild()
		this.delete_row_elem(tr_elem)
		table_body_elem.removeChild(tr_elem)
	}
	
	
	
	/**
	 * Remove a row at last position.
	 * 
	 * @param {integer} arg_count - items count to remove.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_last(arg_count=1)
	{
		// console.log(context + ':ui_items_remove_last:arg_count', arg_count)
		
		if (arg_count <= 0)
		{
			return
		}
		
		const table_elem = this.get_dom_element()
		const table_body_elem = table_elem.getElementsByTagName( "tbody" )[0]
		const tr_elems = table_body_elem.children
		const last_index = tr_elems.length - arg_count - 1
		let row_index = last_index - 1 >= 0 ? last_index - 1 : 0
		for( ; row_index < tr_elems.length ; row_index++)
		{
			const tr_elem = tr_elems[row_index]
			this.delete_row_elem(tr_elem)
			table_body_elem.removeChild(tr_elem)
		}
	}
	
	
	
	/**
	 * Delete table rows DOM elements.
	 *
	 * @param {array} arg_rows_array - rows Element array.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	delete_row_elem(arg_row_elem)
	{
	}
	
	
	
	/**
	 * Build a row cell DOM element.
	 *
	 * @param {any}      arg_cell_value   - cell value.
	 * @param {integer}  arg_row_index    - row index.
	 * @param {integer}  arg_column_index - column index.
	 * @param {Document} arg_document     - DOM document.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	build_cell(arg_cell_value, arg_row_index, arg_column_index, arg_document)
	{
		const td_elem = arg_document.createElement('td')

		td_elem.setAttribute('data-column-index', arg_column_index)
		td_elem.innerText = arg_cell_value

		return td_elem
	}

	
	
	/**
	 * Build a table row DOM element.
	 *
	 * @param {array} arg_row_array - row values array.
	 * @param {integer} arg_row_index - row index.
	 * @param {integer} arg_max_cols - max columns number.
	 * @param {integer} arg_depth        - path depth.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	build_row(arg_row_array, arg_row_index, arg_max_cols/*, arg_depth*/)
	{
		const this_document = this.get_dom_element().ownerDocument
		const row_elem = this_document.createElement('tr')
		row_elem.setAttribute('data-row-index', arg_row_index)

		// DEBUG
		// console.log(context + ':build_row:rows_index=%i row_array max_cols', arg_row_index, arg_row_array, arg_max_cols)
		
		if( ! T.isArray(arg_row_array) )
		{
			console.warn(context + ':build_row:row_array is not an array at rows_index=%i', arg_row_index, arg_row_array)
			return undefined
		}

		arg_row_array.forEach(
			(cell, index) => {
				if (arg_max_cols && index > arg_max_cols)
				{
					return
				}

				const td_elem = this.build_cell(cell, arg_row_index, index, this_document)
				if (! td_elem)
				{
					console.warn(context + ':build_row:bad cell element at rows_index=%i at column_index=%i', arg_row_index, index)
					return
				}

				row_elem.appendChild(td_elem)
			}
		)
		
		return row_elem
	}

	
	
	/**
	 * Build a table row DOM element.
	 *
	 * @param {Element} arg_body_element - table body element.
	 * @param {array}   arg_row_array    - row values array.
	 * @param {integer} arg_row_index    - row index.
	 * @param {integer} arg_max_rows     - max rows number.
	 * @param {integer} arg_max_cols     - max columns number.
	 * @param {string}  arg_mode         - fill mode:append/prepend
	 * @param {string}  arg_max_rows_action - action on max rows.
	 * @param {integer} arg_depth        - path depth.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	process_row_array(arg_body_element, arg_row_array, arg_row_index, arg_max_rows, arg_max_cols, arg_mode, arg_max_rows_action, arg_depth=0)
	{
		const rows_count = arg_body_element.children.length
		const row_elem = this.build_row(arg_row_array, arg_row_index, arg_max_cols, arg_depth)
		if (! row_elem)
		{
			console.warn(context + ':update_rows:%s:at %i:max cols=%i:bad row element for ', this.get_name(), arg_row_index, arg_max_cols, arg_row_array)
			return
		}

		if (arg_max_rows && (rows_count + arg_row_index) > arg_max_rows)
		{
			if (arg_max_rows_action == 'remove_bottom')
			{
				// TODO
				console.warn('TODO remove_bottom')
			}
			else if (arg_max_rows_action == 'remove_top')
			{
				// TODO
				console.warn('TODO remove_top')
			}
			else
			{
				return
			}
			
		}

		// console.log(context + ':update_rows:rows_index=%i mode=%s', row_index, arg_options.mode)
		if (arg_mode == 'prepend')
		{
			arg_body_element.insertBefore(row_elem, arg_body_element.firstChild )
		}
		else
		{
			arg_body_element.appendChild(row_elem)
		}
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
		
		const table_elem = this.get_dom_element()
		const table_body_elem = table_elem.getElementsByTagName( "tbody" )[0]

		const max_cols = T.isNumber(state.max_columns) ? state.max_columns : undefined
		const max_rows = T.isNumber(state.max_rows) ? state.max_rows : undefined
		const max_rows_action = T.isString(state.max_rows_action) ? state.max_rows_action : undefined

		let fields_count = this.get_state_value('fields_count', 0)
		if (fields_count == 0)
		{
			const headers = this.get_state_value('headers', [])
			if ( T.isArray(headers) && headers.length > 0 )
			{
				const last_headers = headers[headers.length - 1]
				if ( T.isArray(last_headers) )
				{
					fields_count = last_headers.length
				}
			}
		}

		// DEBUG
		// console.log( context + ':update_rows:arg_rows_array=', arg_rows_array)
		// console.log( context + ':update_rows:rows_count=%i', rows_count)
		
		arg_rows_array.forEach(
			(arg_row_array, row_index) => {

				const row_array = T.isArray(arg_row_array) ? arg_row_array : (fields_count == 1 ? [arg_row_array] : undefined)
				if (! row_array)
				{
					console.warn(context + ':update_rows:%s:at %i:fields_count=%i:bad row array for ', this.get_name(), row_index, fields_count, arg_row_array)
					return
				}

				this.process_row_array(table_body_elem, row_array, row_index, max_rows, max_cols, arg_options.mode, max_rows_action)
			}
		)
	}


	
	/**
	 * Update values on a table part.
	 * 
	 * @param {object} arg_collection_def - plain object map of collection definition ({collection_name:"", collection_dom_id:""}.
	 * @param {object} arg_collection_values - plain object map of collection key/value pairs.
	 * 
	 * @returns {nothing}
	 */
	update_section_collection(arg_collection_def, arg_collection_values)
	{
		const table_id = this.get_dom_id()

		// console.log(context + ':update_section_collection:%s:def= values=', this.get_name(), arg_collection_def, arg_collection_values)

		if (arg_collection_def && arg_collection_def.collection_name && arg_collection_def.collection_dom_id && arg_collection_values)
		{
			const arg_collection_name = arg_collection_def.collection_name
			
			const collection_elem = document.getElementById(arg_collection_def.collection_dom_id)
			if (!collection_elem)
			{
				// CALLED BY BINDING ON A VIEW WHICH IS NOT VISIBLE
				// console.log(context + ':update_section_collection:' + this.get_name() + ':collection element not found for id [' + arg_collection_def.collection_dom_id + ']')
				return
			}

			var collection_dom_template_default = "<tr> <td></td> <td> {collection_key} </td> <td id='{collection_id}'>{collection_value}</td> </tr>"
			var collection_dom_template = arg_collection_def.collection_dom_template ? html_entities.decode(arg_collection_def.collection_dom_template) : collection_dom_template_default
			
			// DEBUG
			// console.log(context + ':update_section_collection:arg_collection_def.collection_dom_template=%s', arg_collection_def.collection_dom_template)
			// console.log(context + ':update_section_collection:collection_dom_template=%s', collection_dom_template)

			var collection_key_safe = undefined
			var collection_value = undefined
			var collection_id = undefined
			var collection_value_elem = undefined
			var collection_value_html = undefined
			var collection_keys = Object.keys(arg_collection_values)
			var re = /[^a-zA-Z0-9]/gi

			// console.log('update_metric_collection2:collection=%s keys= jqo=', arg_collection_name, collection_keys, arg_collection_jqo)
			
			collection_keys.forEach(
				function(collection_key)
				{
					collection_key_safe = collection_key.replace(re, '_')
					// console.log('update_metric_collection2:collection=%s loop on key=', arg_collection_name, collection_key)

					collection_value = arg_collection_values[collection_key]
					collection_id = table_id + "_" + arg_collection_name + "_" + collection_key_safe
					collection_value_elem = document.getElementById(collection_id)

					if (! collection_value_elem )
					{
						// console.log('update_metric_collection2:collection=%s loop on key=', collection_key)

						collection_value_html = collection_dom_template.replace('{collection_key}', collection_key).replace('{collection_id}', collection_id).replace('{collection_value}', collection_value)
						
						// console.log(context + ':update_section_collection:html', collection_value_html)
			
						const tr_elem = document.createElement('tr')
						tr_elem.innerHTML = collection_value_html
						collection_elem.parentNode.insertBefore(tr_elem, collection_elem.nextSibling)
						collection_value_elem = document.getElementById(collection_id)
					}
					
					collection_value_elem.textContent = collection_value
				}
			)
		}
	}
}

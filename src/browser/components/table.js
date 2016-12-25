// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

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
	 * Creates an instance of Component.
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
		const tr_elems = table_body_elem.children
		const tr_elems_count = tr_elems.length
		let row_index = 0
		for( ; row_index < tr_elems_count ; row_index++)
		{
			const tr_elem = tr_elems[row_index]
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
		// console.log(context + ':ui_items_append:arg_items_array', arg_items_array)

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
	ui_items_replace(arg_items_array, arg_items_count)
	{
		// console.log(context + ':ui_items_replace:arg_items_array', arg_items_array.length)
		
		// TODO : update strategy: cleat and replace, update by counts comparison, update by ids comparison...
		// this.ui_items_clear()
		
		const current_items_count = this.ui_items_get_count()
		const delta_count = arg_items_array.length - current_items_count
		const items_to_prepend = (delta_count > 0 && current_items_count > 0) ? arg_items_array.slice(0, delta_count) : arg_items_array
		// console.log(context + ':ui_items_prepend:items_to_prepend', items_to_prepend)

		let arg_options = arg_options ? arg_options : {}
		arg_options.mode = 'replace'
		this.update_rows(items_to_prepend, arg_options)
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
	 * Build a table row DOM element.
	 *
	 * @param {array} arg_row_array - row values array.
	 * @param {integer} arg_row_index - row index.
	 * @param {integer} arg_max_cols - max columns number.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	build_row(arg_row_array, arg_row_index, arg_max_cols)
	{
		const this_document = this.get_dom_element().ownerDocument
		const row_elem = this_document.createElement('tr')
		row_elem.setAttribute('data-row-index', arg_row_index)

		// console.log(context + ':build_row:rows_index=%i row_array max_cols', arg_row_index, arg_row_array, arg_max_cols)
		
		if( ! T.isArray(arg_row_array) )
		{
			console.warn(context + ':build_row:row_array is not an array at rows_index=%i', arg_row_index, arg_row_array)
			return
		}

		arg_row_array.forEach(
			(cell, index) => {
				if (arg_max_cols && index > arg_max_cols)
				{
					return
				}
				const td_elem = this_document.createElement('td')
				td_elem.setAttribute('data-column-index', index)
				td_elem.innerText = cell
				row_elem.appendChild(td_elem)
			}
		)
		
		return row_elem
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
		
		// const table_body = $('tbody', '#' + arg_table_id)
		const table_elem = this.get_dom_element()
		const table_body_elem = table_elem.getElementsByTagName( "tbody" )[0]

		const max_cols = T.isNumber(state.max_columns) ? state.max_columns : undefined
		const max_rows = T.isNumber(state.max_rows) ? state.max_rows : undefined
		const max_rows_action = T.isString(state.max_rows_action) ? state.max_rows_action : undefined
		// const rows_count = $('tr', table_body).length
		const rows_count = table_body_elem.children.length

		// DEBUG
		// console.log( context + ':update_rows:arg_rows_array=', arg_rows_array)
		// console.log( context + ':update_rows:rows_count=%i', rows_count)
		
		arg_rows_array.forEach(
			(row_array, row_index) => {

				// const html_row = this.build_row(row_array, row_index, max_cols)
				const row_elem = this.build_row(row_array, row_index, max_cols)
				
				if (max_rows && (rows_count + row_index) > max_rows)
				{
					if (max_rows_action == 'remove_bottom')
					{
						// TODO
						console.warn('TODO remove_bottom')
					}
					else if (max_rows_action == 'remove_top')
					{
						// TODO
						console.warn('TODO remove_top')
					}
					else
					{
						return
					}
					
				}

				// console.log(context + ':update_rows:rows_index=%i mode=%s', row_index, arg_options.mode, table_body)
				if (arg_options.mode == 'prepend')
				{
					// table_body.prepend(html_row)
					table_body_elem.insertBefore(row_elem, table_body_elem.firstChild )
				}
				else
				{
					// table_body.append(html_row)
					table_body_elem.appendChild(row_elem)
				}
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

		// SEE JQUERY
		function text(elem)
		{
			let node = undefined
			let text_resul = ''
			let i = 0
			const nodeType = elem.nodeType

			if ( ! nodeType )
			{
				// If no nodeType, this is expected to be an array
				while ( ( node = elem[ i++ ] ) )
				{
					// Do not traverse comment nodes
					text_resul += text(node)
				}
			} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
				// Use textContent for elements
				return elem.textContent
			} else if ( nodeType === 3 || nodeType === 4 ) {
				return elem.nodeValue
			}

			// Do not include comment or processing instruction nodes
			return text_resul
		}

		function htmlDecode(t)
		{
			if (! T.isString(t) )
			{
				return ''
			}

			const elem = document.createElement('div')
			elem.innerHTML = t
			return text(elem)
		}

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
			var collection_dom_template = arg_collection_def.collection_dom_template ? htmlDecode(arg_collection_def.collection_dom_template) : collection_dom_template_default
			
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

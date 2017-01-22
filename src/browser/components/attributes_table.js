// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'
import _ from 'lodash'

// BROWSER IMPORTS
import Table from './table'


const context = 'browser/components/attributes_table'



/**
 * @file UI Attributes table component class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class AttributesTable extends Table
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
		
		this.is_attributes_table_component = true
	}



	/**
	 * Set all object attributes.
	 * 
	 * @param {object}  arg_object - attributes object.
	 * @param {integer} arg_max_depth - nested attributes max deep (TODO).
	 * 
	 * @returns {noting}
	 */
	set_view_attributes_by_name(arg_view_name, arg_max_depth)
	{
		console.log(context + ':set_view_attributes_by_name:%s:view name=%s,max depth=%i', this.get_name(), arg_view_name, arg_max_depth)
		
		if ( ! T.isString(arg_view_name) )
		{
			console.warn(context + ':set_view_attributes_by_name:%s:bad view name string=%s', this.get_name(), arg_view_name)
			return
		}

		const view_desc = this.get_runtime().ui().get_resource_description_resolver()(arg_view_name)
		if (! view_desc)
		{
			console.warn(context + ':set_view_attributes_by_name:%s:view not found=%s', this.get_name(), arg_view_name)
			return
		}

		this.set_object_attributes(view_desc, arg_max_depth)
	}


	parse_integer(arg_string)
	{
		let integer = 0
		try{
			integer = parseInt(arg_string)
		}
		catch(e){
			console.warn(context + ':build_row:click handler:bad integer for string', arg_string)
			integer = 0
		}
		return integer
	}



	/**
	 * Set all object attributes.
	 * 
	 * @param {object}  arg_object - attributes object.
	 * @param {integer} arg_max_depth - nested attributes max deep (TODO).
	 * 
	 * @returns {noting}
	 */
	set_object_attributes(arg_object/*, arg_max_depth*/)
	{
		if ( ! T.isObject(arg_object) )
		{
			console.warn(context + ':set_object_attributes:%s:bad object instance=', this.get_name(), arg_object)
			return
		}

		const attributes = []
		const attributes_exclude = this.get_state_value('attributes_exclude', undefined)
		let attributes_path = this.get_state_value('attributes_path', undefined)

		// DEBUG
		// console.log(context + ':set_object_attributes:%s:attributes_exclude=', this.get_name(), attributes_exclude)
		// console.log(context + ':set_object_attributes:%s:attributes_path=', this.get_name(), attributes_path)

		if (attributes_path)
		{
			if (attributes_path.toJS)
			{
				attributes_path = attributes_path.toJS()
			}
			if ( T.isArray(attributes_path) && attributes_path.length > 0 )
			{
				// console.log(context + ':set_object_attributes:%s:attributes_path is a non empty array=', this.get_name(), attributes_path)
				
				let key = attributes_path.shift()
				while(key)
				{
					if (key in arg_object)
					{
						// console.log(context + ':set_object_attributes:%s:attributes_path:loop on key=%s (found, go inside)', this.get_name(), key)
						arg_object = arg_object[key]
					} else {
						// console.warn(context + ':set_object_attributes:%s:attributes_path:loop on key=%s (not found in current object)', this.get_name(), key)
						this.do_action_clear_items()
						return
					}
					key = attributes_path.shift()
				}
			}
		}

		const keys = Object.keys(arg_object)
		// console.log(context + ':set_object_attributes:%s:keys=', this.get_name(), keys)
		keys.forEach(
			(key/*, index*/)=>{
				if (attributes_exclude)
				{
					if (attributes_exclude.indexOf(key) > -1)
					{
						// console.log(context + ':set_object_attributes:%s:skip key=%s', this.get_name(), key)
						return
					}
				}
				
				const value = arg_object[key] ? arg_object[key] : 'undefined'
				// console.log(context + ':set_object_attributes:%s:key=%s,value=%s', this.get_name(), key, value)

				// const formated_value = (T.isString(value) || T.isNumber(value) || T.isBoolean(value)) ? value : ( T.isFunction(value) ? 'Function' : value.toString())
				const formated_value = value
				attributes.push( [key, formated_value] )
			}
		)

		// console.log(context + ':set_object_attributes:%s:object&attributes=', this.get_name(), arg_object, attributes)

		this.do_action_replace(attributes, attributes.length)

		// COLLAPSE / EXPAND CLICK HANDLER
		// handler signature: f(component, event name, selection, event, target)
		const handler = (component, event_name, selection, event, target)=>{
			if (! target || ! component)
			{
				console.warn(context + ':build_row:click handler:bad target or component')
				return
			}

			const parent_tr_elem = target.parentNode
			const collapsed = target.getAttribute('devapt-collapsed') == 'true' ? true : false
			const css_display = collapsed ? 'table-row' : 'none'
			let parent_depth = parent_tr_elem ? this.parse_integer( parent_tr_elem.getAttribute('devapt-depth') ) : 0

			// DEBUG
			// console.log(context + ':build_row:click handler:parent_tr_elem=', parent_tr_elem)
			// console.log(context + ':build_row:click handler:collapsed=%b', collapsed)
			// console.log(context + ':build_row:click handler:css_display=%s', css_display)
			// console.log(context + ':build_row:click handler:parent_depth=%i', parent_depth)

			let tr_elem = parent_tr_elem ? parent_tr_elem.nextSibling : undefined
			let elem_depth = tr_elem ? this.parse_integer( tr_elem.getAttribute('devapt-depth') ) : 0
			while(tr_elem && elem_depth > parent_depth)
			{
				// console.log(context + ':build_row:click handler:loop on elem', tr_elem)

				tr_elem.style.display = css_display
				tr_elem = tr_elem.nextSibling
			}
			target.setAttribute('devapt-collapsed', !collapsed)
			target.firstChild.textContent = (! collapsed) ? '\u25B9' : '\u25BF'
		}
		this.on_dom_event('click', 'td.devapt-collapsable-row', handler, undefined, false)
	}



	/**
	 * Get object from attributes.
	 * 
	 * @returns {object}
	 */
	get_object_attributes()// TODO
	{
		const result_object = {}
		const table_elem = this.get_dom_element()
		const table_body_elem = table_elem.getElementsByTagName( "tbody" )[0]
		const tr_elems = table_body_elem.children

		let row_index = 0
		let previous_index = undefined
		for( ; row_index < tr_elems.length ; row_index++)
		{
			const tr_elem  = tr_elems[row_index]
			const tr_index = tr_elem.getAttribute('devapt-row-index')
			const td_key_elem   = tr_elem.firstChild
			const td_value_elem = td_key_elem.nextSibling
			const value_type = td_value_elem.getAttribute('devapt-data-type')
			const key = td_key_elem.textContent
			const value = td_value_elem.textContent

			switch(value_type) {
				case 'string':  result_object[key] = value ; break
				case 'number':  result_object[key] = new Number(value) ; break
				case 'boolean': result_object[key] = (value == 'true') ? true : false ; break
				// case 'array': 
				// case 'object':
			}

			previous_index = tr_index
		}

		return result_object
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
		td_elem.setAttribute('devapt-column-index', arg_column_index)

		if ( T.isString(arg_cell_value) )
		{
			console.log(context + ':build_cell:%s:string:at row %i:value=%s', this.get_name(), arg_row_index, arg_cell_value)

			td_elem.innerText = arg_cell_value
			td_elem.setAttribute('devapt-data-type', 'string')
			return td_elem
		}
		else if ( T.isNumber(arg_cell_value) )
		{
			console.log(context + ':build_cell:%s:number:at row %i:value=%s', this.get_name(), arg_row_index, arg_cell_value)

			td_elem.innerText = arg_cell_value
			td_elem.setAttribute('devapt-data-type', 'number')
		}
		else if ( T.isBoolean(arg_cell_value) )
		{
			console.log(context + ':build_cell:%s:boolean:at row %i:value=%s', this.get_name(), arg_row_index, arg_cell_value)

			td_elem.innerText = arg_cell_value ? 'true' : 'false'
			td_elem.setAttribute('devapt-data-type', 'boolean')
		}
		else if ( T.isFunction(arg_cell_value) )
		{
			console.log(context + ':build_cell:%s:function:at row %i:value=%s', this.get_name(), arg_row_index, 'Function')

			td_elem.innerText = 'Function'
			td_elem.setAttribute('devapt-data-type', 'function')
		} else {
			console.log(context + ':build_cell:%s:array:at row %i:unknow=%s', this.get_name(), arg_row_index, arg_cell_value)

			td_elem.innerText = 'unknow'
			td_elem.setAttribute('devapt-data-type', 'unknow')
		}
		
		return td_elem
	}
	
	
	
	/**
	 * Build a table row DOM element.
	 *
	 * @param {array} arg_row_array   - row values array.
	 * @param {integer} arg_row_index - row index.
	 * @param {integer} arg_max_cols  - max columns number.
	 * @param {integer} arg_depth     - path depth.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	build_row(arg_row_array, arg_row_index, arg_max_cols, arg_depth=0)
	{
		const this_document = this.get_dom_element().ownerDocument
		const row_elem = this_document.createElement('tr')
		row_elem.setAttribute('devapt-row-index', arg_row_index)
		row_elem.setAttribute('devapt-depth', arg_depth)

		// console.log(context + ':build_row:rows_index=%i row_array max_cols', arg_row_index, arg_row_array, arg_max_cols)
		
		if( ! T.isArray(arg_row_array) || arg_row_array.length != 2 )
		{
			console.warn(context + ':build_row:row_array is not an array of size 2 at rows_index=%i', arg_row_index, arg_row_array)
			return undefined
		}

		const attribute_name  = arg_row_array[0]
		const attribute_value = arg_row_array[1]
		const pad_left = 10
		
		const td_name_elem = this_document.createElement('td')
		td_name_elem.setAttribute('devapt-column-index', 0)
		td_name_elem.style.paddingLeft = td_name_elem.style.paddingLeft ? td_name_elem.style.paddingLeft + arg_depth * pad_left : arg_depth * pad_left
		td_name_elem.innerText = attribute_name
		row_elem.appendChild(td_name_elem)

		const td_value_elem = this.build_cell(attribute_value, arg_row_index, 1, this_document, arg_depth)
		row_elem.appendChild(td_value_elem)
		
		return row_elem
	}
	
	
	
	/**
	 * Build a table row DOM element.
	 *
	 * @param {array} arg_row_array   - row values array.
	 * @param {integer} arg_row_index - row index.
	 * @param {integer} arg_max_cols  - max columns number.
	 * @param {integer} arg_depth     - path depth.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	build_row_collapsed(arg_row_array, arg_row_index, arg_max_cols, arg_depth=0)
	{
		const this_document = this.get_dom_element().ownerDocument
		const row_elem = this_document.createElement('tr')
		row_elem.setAttribute('devapt-row-index', arg_row_index)
		row_elem.setAttribute('devapt-depth', arg_depth)

		// console.log(context + ':build_row:rows_index=%i row_array max_cols', arg_row_index, arg_row_array, arg_max_cols)
		
		if( ! T.isArray(arg_row_array) || arg_row_array.length != 2 )
		{
			console.warn(context + ':build_row:row_array is not an array of size 2 at rows_index=%i', arg_row_index, arg_row_array)
			return undefined
		}

		const attribute_name  = arg_row_array[0]
		const attribute_value = arg_row_array[1]
		const pad_left = 10
		
		const td_name_elem = this_document.createElement('td')
		td_name_elem.setAttribute('devapt-column-index', 0)
		td_name_elem.setAttribute('devapt-collapsed', false)
		td_name_elem.className = 'devapt-collapsable-row'
		td_name_elem.style.paddingLeft = td_name_elem.style.paddingLeft ? td_name_elem.style.paddingLeft + arg_depth * pad_left : arg_depth * pad_left
		// td_name_elem.innerText = attribute_name
		row_elem.appendChild(td_name_elem)

		const span_elem = this_document.createElement('span')
		span_elem.textContent = '\u25BF'
		td_name_elem.appendChild(span_elem)

		const text_elem = this_document.createElement('span')
		text_elem.textContent = attribute_name
		td_name_elem.appendChild(text_elem)
		

		const td_value_elem = this.build_cell(attribute_value, arg_row_index, 1, this_document, arg_depth)
		row_elem.appendChild(td_value_elem)
		
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
	 * @returns {nothing}
	 */
	process_row_array(arg_body_element, arg_row_array, arg_row_index, arg_max_rows, arg_max_cols, arg_mode, arg_max_rows_action, arg_depth=0)
	{
		// console.log(context + ':process_row_array:%s:at %i:max cols=%i:depth=%i:row array=', this.get_name(), arg_row_index, 2, arg_depth, arg_row_array)

		const attribute_name  = arg_row_array[0]
		const attribute_value = arg_row_array[1]
		const pad_left = 10

		if ( T.isArray(attribute_value) )
		{
			console.log(context + ':process_row_array:%s:array:at row %i:depth=%i', this.get_name(), arg_row_index, arg_depth )

			/*
			TODO EXPANDABLE ICONS:
				'<span class="node_closed">\u25B9</span>'
				'<span class="node_opened">\u25BF</span>'
			*/
			const first_row_elem = this.build_row_collapsed([attribute_name, ''], arg_row_index, 2, arg_depth)
			if (! first_row_elem)
			{
				console.warn(context + ':process_row_array:%s:at %i:max cols=%i:array:bad row element for ', this.get_name(), arg_row_index, 2, arg_row_array)
				return
			}
			first_row_elem.setAttribute('devapt-data-type', 'array')
			arg_body_element.appendChild(first_row_elem)

			_.forEach(attribute_value,
				(item, index)=>{
					this.process_row_array(arg_body_element, [index, item], arg_row_index, arg_max_rows, arg_max_cols, arg_mode, arg_max_rows_action, arg_depth + 1)
				}
			)
			return
		}
		else if ( T.isObject(attribute_value) )
		{
			console.log(context + ':process_row_array:%s:object:at row %i:depth=%i', this.get_name(), arg_row_index, arg_depth )

			// OPEN=\u25BF CLOSE=\u25B9
			const first_row_elem = this.build_row_collapsed([attribute_name, ''], arg_row_index, 2, arg_depth)
			if (! first_row_elem)
			{
				console.warn(context + ':process_row_array:%s:at %i:max cols=%i:object:bad row element for ', this.get_name(), arg_row_index, 2, arg_row_array)
				return
			}
			first_row_elem.setAttribute('devapt-data-type', 'object')
			arg_body_element.appendChild(first_row_elem)

			_.forEach(attribute_value,
				(item, key)=>{
					this.process_row_array(arg_body_element, [key, item], arg_row_index, arg_max_rows, arg_max_cols, arg_mode, arg_max_rows_action, arg_depth + 1)
				}
			)
			return
		}

		// DEFAULT CASE
		console.log(context + ':process_row_array:%s:default:at row %i:depth=%i', this.get_name(), arg_row_index, arg_depth )
		
		const row_elem = this.build_row(arg_row_array, arg_row_index, 2, arg_depth)
		if (! row_elem)
		{
			console.warn(context + ':process_row_array:%s:at %i:max cols=%i:default:bad row element for ', this.get_name(), arg_row_index, 2, arg_row_array)
			return
		}
		row_elem.style.paddingLeft = row_elem.style.paddingLeft ? row_elem.style.paddingLeft + (arg_depth + 1) * pad_left : (arg_depth + 1) * pad_left
		arg_body_element.appendChild(row_elem)
	}
}

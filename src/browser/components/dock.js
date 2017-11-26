// NPM IMPORTS
import _ from 'lodash'
// import assert from 'assert'

// COMMON IMPORTS
import T from '../../common/utils/types'

// BROWSER IMPORTS
import Container from '../base/container'


const context = 'browser/components/dock'



export default class Dock extends Container
{
	/**
	 * Creates an instance of Component.
	 * @extends Component
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{	
		super(arg_runtime, arg_state, arg_log_context ? arg_log_context : context)

		this.is_dock_component = true
	}
	
	
	
	_update_self(arg_prev_element, arg_new_element)
	{
		// console.log(context + ':_update_self', arg_prev_element, arg_new_element)
	}


	/**
	 * Get a component instance from a name, a description...
	 * 
	 * @param {any} arg_value - string or object value.
	 * 
	 * @returns {undefined|Component}
	 */
	get_component(arg_value)
	{
		if ( T.isString(arg_value) )
		{
			return window.devapt().ui(arg_value)
		}

		if ( T.isObject(arg_value) )
		{
			if (arg_value.is_component)
			{
				return arg_value
			}

			if ( T.isNotEmptyString(arg_value.type) && T.isNotEmptyString(arg_value.name) )
			{
				return  window.devapt().ui().create_local(arg_value.name, arg_value)
			}

			if ( T.isNotEmptyString(arg_value.view) )
			{
				return  window.devapt().ui(arg_value.view)
			}

			return undefined
		}

		return undefined
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
		
		const dom_elem = this.get_dom_element()

		if (arg_items_count > arg_items_array.length)
		{
			arg_items_array.splice(arg_items_count)
		}
		
		_.forEach(arg_items_array,
			(item, index)=>{
				const component = this.get_component(item)

				if (! component)
				{
					console.warn(context + ':ui_items_append:bad item component at %i for ', index, item)
					return
				}

				component.set_dom_parent(dom_elem)
			}
		)
	}
	
	
	
	/**
	 * Prepend items to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	// ui_items_prepend(arg_items_array, arg_items_count)
	// {
	// 	// console.log(context + ':ui_items_prepend:%s:count=%s:arg_items_array', this.get_name(), arg_items_count, arg_items_array)
		
	// }
	
	
	
	/**
	 * Replace container items.
	 * 
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	// ui_items_replace(arg_items_array/*, arg_items_count*/)
	// {
	// 	// console.log(context + ':ui_items_replace:arg_items_array', arg_items_array.length)
		
	// 	// REMOVE ALL EXISTING ROWS
	// 	this.ui_items_clear()
		
	// }
	
	
	
	/**
	 * Insert items at container position index.
	 * 
	 * @param {intege} arg_index - position index.
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	// ui_items_insert_at(arg_index, arg_items_array, arg_items_count)
	// {
	// 	assert( T.isArray(arg_items_array), context + ':ui_items_replace:bad items array')
	// 	assert( T.isNumber(arg_items_count), context + ':ui_items_replace:bad items count')
		
	// 	// NOT YET IMPLEMENTED
	// }
	
	
	
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

		const dom_elem = this.get_dom_element()
		if (arg_index < 0 || arg_index >= dom_elem.children.length)
		{
			console.warn(context + ':ui_items_remove_at_index:%s:bad item index=%s', this.get_name(), arg_index)
			return
		}
		const child_elem = dom_elem.children[arg_index]
		dom_elem.removeChild(child_elem)
	}
	
	
	
	/**
	 * Remove a row at first position.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_first()
	{
		const dom_elem = this.get_dom_element()
		const first_elem = dom_elem.firstElementChild()
		table_body_elem.removeChild(first_elem)
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
		
		const dom_elem = this.get_dom_element()
		const children_elems = dom_elem.children
		const last_index = children_elems.length - arg_count - 1
		let row_index = last_index - 1 >= 0 ? last_index - 1 : 0
		for( ; row_index < children_elems.length ; row_index++)
		{
			const child_elem = children_elems[row_index]
			dom_elem.removeChild(child_elem)
		}
	}
}

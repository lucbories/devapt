// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'

// BROWSER IMPORTS
import Container from '../base/container'


const context = 'browser/components/tabs'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Tabs extends Container
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
		
		this.is_tabs_component = true
		
		$(this._dom_element).on('change.zf.tabs',
			()=>{
				const tab_id = $(this._dom_element).find('.is-active a').attr('id')
				this.on_tabs_change(tab_id)
			}
		)

		// DEBUG
		// this.enable_trace()
	}
	
	
	
	_update_self(arg_prev_element, arg_new_element)
	{
		// console.log(context + ':_update_self', arg_prev_element, arg_new_element)
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
			// console.log(context + ':get_children_component:init with items:', items)

			items.forEach(
				(tab)=>{
					if ( T.isObject(tab) )
					{
						if ( T.isString(tab.content) )
						{
							const component = window.devapt().ui(tab.content)
							if (component && component.is_component)
							{
								this._children_component.push(component)
							}
						}
					}
				}
			)
		}

		return this._children_component
	}



	/**
	 * Update state with selected tab.
	 * 
	 * @param {string} arg_selected_tab_id - selected tab id.
	 * 
	 * @returns {nothing}
	 */
	on_tabs_change(arg_selected_tab_id)
	{
		// console.log(context + ':on_tabs_change:selected=' + arg_selected_tab_id)

		const prev_state = this.get_state()
		const new_state = prev_state.set('selected_id', arg_selected_tab_id)
		// console.log(context + ':on_tabs_change:selected=' + arg_selected_tab_id, prev_state)
		// console.log(context + ':on_tabs_change:selected=' + arg_selected_tab_id, new_state)

		// const action = { type:'ADD_JSON_RESOURCE', resource:this.get_name(), path:this.get_state_path(), json:new_state.toJS() }
		// window.devapt().ui().store.dispatch(action)

		this.dispatch_update_state_action(new_state)
	}
}

// NPM IMPORTS
// import T from 'typr/lib/typr'
// import assert from 'assert'

// COMMON IMPORTS
import Stream from '../../common/messaging/stream'

// BROWSER IMPORTS
import Component from '../base/component'


const context = 'browser/components/input-field'



export default class InputField extends Component
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

		this.is_input_field = true

		this.init()
	}
	
	
	// _update_self(arg_prev_element, arg_new_element)
	// {
	// 	// console.log(context + ':_update_self', arg_prev_element, arg_new_element)

	// 	if (arg_prev_element != arg_new_element)
	// 	{
	// 		// console.log(context + ':_update_self:different elements')
	// 		if (this.sparkline)
	// 		{
	// 			// console.log(context + ':_update_self:sparkline exists')
	// 			arg_new_element.innerHTML = arg_prev_element.innerHTML
	// 			delete this.sparkline
	// 		}
	// 	}
	// }


	// handle_items_change(arg_path, arg_previous_value, arg_new_value)
	// {
	// 	// console.log(context + ':handle_items_change', arg_path, arg_previous_value, arg_new_value)
	// }

	
	init()
	{
		// console.log(context + ':init')

		// var self = this
		// var elm = this.get_dom_element()
		// console.log(this.get_name(), context + ':this.get_name()')
		// console.log(this.get_dom_id(), context + ':this.get_dom_id()')
		// console.log(elm, context + ':elm')

		// var view_state = this.get_state().toJS()
		// var value = view_state.value ? view_state.value : ''
	}
	


	/**
	 * Get a named stream.
	 * 
	 * @param {string} arg_stream_name - stream name.
	 * 
	 * @returns {Stream|undefined} - found stream.
	 */
	get_named_stream(arg_stream_name)
	{
		const dom_elem = this.get_dom_element()
		if (! dom_elem)
		{
			console.warn(context + ':get_named_stream:%s:undefined dom element', this.get_name())
			return undefined
		}

		switch(arg_stream_name.toLocaleLowerCase()) {
			case 'keydown':{
				console.log(context + ':get_named_stream:%s:stream found=%s', this.get_name(), arg_stream_name.toLocaleLowerCase())
				
				const stream = new Stream.from_dom_event(dom_elem, 'keydown')

				const xform_stream = stream.get_source_stream()
				.debounce(300) // limit the rate of queries
				.map( // get text value
					(event)=>{
						console.log(context + ':keydown stream:value', event.target.value)
						return event.target.value
					}
				)
				.skipDuplicates() // Ignore duplicate events with same text

				stream.set_transformed_stream(xform_stream)
				return stream
			}
		}
		
		console.warn(context + ':get_named_stream:%s:unknow named stream=%s', this.get_name(), arg_stream_name.toLocaleLowerCase())
		return undefined
	}
}

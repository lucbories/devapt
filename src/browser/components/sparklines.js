// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'

// BROWSER IMPORTS
import Component from '../base/component'


const plugin_name = 'Sparklines' 
const context = plugin_name + '/sparklines'



export default class Sparklines extends Component
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

		this._is_initialized = false
		this.init()
	}


	render()
	{
		// var values = this.get_state_value('items', [])
		// this.sparkline.draw(values)
	}
	
	
	_update_self(arg_prev_element, arg_new_element)
	{
		this.enter_group('_update_self')

		if (! this._is_initialized)
		{
			this.debug('_update_self:not yet initialized')
			this.leave_group('_update_self')
			return
		}

		// console.log(context + ':_update_self', arg_prev_element, arg_new_element)

		if (arg_prev_element != arg_new_element)
		{
			// console.log(context + ':_update_self:different elements')
			if (this.sparkline)
			{
				// console.log(context + ':_update_self:sparkline exists')
				arg_new_element.innerHTML = arg_prev_element.innerHTML
				delete this.sparkline
			}
		}

		if (! this.sparkline)
		{
			if (! window.Sparkline)
			{
				// console.log(context + ':_update_self:Sparkline not yet loaded, delay creation')
				// setTimeout(
				// 	()=>{
				// console.log(context + ':_update_self:create Sparkline (delayed)')
				if (! window.Sparkline)
				{
					throw 'Sparkline file not found on update'
				}
				
				this.sparkline = new window.Sparkline(arg_new_element, this.options)
				
				const values = this.get_state_value('items', [])
				// console.log(context + ':update:values', values)

				if ( T.isArray(values) && values.length > 0 )
				{
					this.sparkline.draw(values)
				}
				// 	},
				// 	500
				// )
			} else {
				// console.log(context + ':_update_self:create Sparkline')
				const values = this.get_state_value('items', [])
				this.sparkline = new window.Sparkline(arg_new_element, this.options)
				if ( T.isArray(values) && values.length > 0 )
				{
					this.sparkline.draw(values)
				}
			}
		}

		this.leave_group('_update_self')
	}


	handle_items_change(arg_path, arg_previous_value, arg_new_value)
	{
		this.enter_group('handle_items_change')
		// console.log(context + ':handle_items_change', arg_path, arg_previous_value, arg_new_value)

		if (this._is_initialized && this.sparkline)
		{
			const values = arg_new_value && arg_new_value.toJS() ? arg_new_value.toJS() : []
			if ( T.isArray(values) && values.length > 0 )
			{
				this.sparkline.draw(values)
			}

			this.leave_group('handle_items_change')
			return
		}

		this.debug('_update_self:not yet initialized')
		this.leave_group('handle_items_change')
	}
	
	
	update_values(values)
	{
		this.enter_group('update_values')
		// console.log(context + ':update_values', values)

		// GET COMPONENT STATE
		var view_state = this.get_state().toJS()
		// console.log(context + ':update_values:view_state', view_state)

		// UPDATE COMPONENT STATE ITEMS
		view_state.items = T.isArray(values) ? values : []

		// PROPAGATE STATE CHANGE
		this.dispatch_action('ADD_JSON_RESOURCE', {resource:this.get_name(), path:this.get_state_path(), json:view_state})

		this.leave_group('update_values')
	}

	
	init()
	{
		this.enter_group('init')

		var self = this
		var elm = this.get_dom_element()

		// DEBUG
		// console.log(this.get_name(), context + ':this.get_name()')
		// console.log(this.get_dom_id(), context + ':this.get_dom_id()')
		// console.log(elm, context + ':elm')

		var view_state = this.get_state().toJS()
		var values = view_state.items ? view_state.items : []
		
		this.options = view_state.options ? view_state.options : {}
		
		this.options.endColor       = this.options.endColor       ? this.options.endColor : 'blue'
		this.options.lineWidth      = this.options.lineWidth      ? this.options.lineWidth : '3'
		this.options.index_multiple = this.options.index_multiple ? this.options.index_multiple : 1

		var tooltip_template_value = '{value}'
		var tooltip_template_index = '{index}'
		var tooltip_template = 'value [' + tooltip_template_value + '] at [' + tooltip_template_index + ']'
		if (this.options.tooltip && (typeof this.options.tooltip == 'string') )
		{
			tooltip_template = this.options.tooltip
		}
		this.options.tooltip = function(value, index, array) {
			if (value && array)
			{
				const evaluated_index = (array.length - index) * self.options.index_multiple
				return tooltip_template.replace(tooltip_template_value, value).replace(tooltip_template_index, evaluated_index)
			}
			return undefined
		}

		// const script_plugin_element = document.getElementById('js-sparklines')

		const script_loaded_handle = ()=>{
			this.debug('init:script loaded handle')

			if (! window.Sparkline)
			{
				this.debug('init:window.Sparkline not found')
				setTimeout(script_loaded_handle, 500)
				return
			}

			self.sparkline = new window.Sparkline(elm, self.options)
			// console.log(this.sparkline, context + ':self.sparkline')
			self.sparkline.draw([0])

			assert( T.isObject(self.sparkline), context + ':self.sparkline bad object')
			self.update_values(values)


			this.register_state_value_change_handle(['items'], 'handle_items_change')
			this._is_initialized = true
		}

		if (window.Sparkline)
		{
			this.debug('init:window.Sparkline found')
			script_loaded_handle()
			this.leave_group('init')
			return
		}

		setTimeout(script_loaded_handle, 500)

		// if (script_plugin_element && script_plugin_element.readyState)
		// {  // IE
		// 	this.debug('init:set loaded handle for IE')

		// 	script_plugin_element.onreadystatechange = ()=>{
		// 		if (script_plugin_element.readyState == "loaded" || script_plugin_element.readyState == "complete")
		// 		{
		// 			this.debug('init:loaded handle for IE')
		// 			script_plugin_element.onreadystatechange = null
		// 			script_loaded_handle()
		// 		}
		// 	}
		// } else {  //Others
		// 	this.debug('init:set loaded handle for others than IE')

		// 	script_plugin_element.onload = ()=>{
		// 		this.debug('init:loaded handle for others than IE')
		// 		script_loaded_handle()
		// 	}
		// }

		this.leave_group('init')
	}
}

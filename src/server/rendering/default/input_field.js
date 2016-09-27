
import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/input-field'


export default class InputField extends Component
{
	constructor(arg_name, arg_settings)
	{
		// DEFINE INIT SETTINGS
		arg_settings = Component.normalize_settings(arg_settings)
		const js_init = `
			$(document).ready(
				function()
				{
					window.devapt().ui('${arg_name}')
				}
			)
		`
		arg_settings.scripts = arg_settings.scripts.concat([js_init])
		
		super(arg_name, arg_settings)
		
		this.$type = 'InputField'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			label:undefined,
			type:'integer',
			placeholder:'enter an integer value',
			default:''
		}
	}
	
	
	// RENDERING
	render_main()
	{
		assert( T.isObject(this.state), context + ':bad state object')
		
		// GET SETTINGS ATTRIBUTES
		const formats = ['text', 'number', 'date', 'datetime', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'time', 'url', 'week']
		let format = this.get_setting('format', 'text')
		if ( ! (T.isString(format) && formats.indexOf(format) > -1) )
		{
			format = 'text'
		}
		const html_between = this.get_setting('html_between', '')
		const css_class_label = this.get_setting('css_class_label', undefined)
		
		// GET STATE ATTRIBUTES
		const placeholder = T.isString(this.state.placeholder) ? this.state.placeholder : undefined
		const default_value = ( T.isString(this.state.value) || T.isNumber(this.state.value) ) ? this.state.value : undefined
		const label = T.isString(this.state.label) ? this.state.label : undefined
		
		// BUILD HTML ELEMENT
		const html_id = 'id="' + this.get_dom_id() + '"'
		const html_type = `type="${format}"`
		const html_value = default_value ? 'value="' + default_value + '"' : ' value'
		const html_placeholder = placeholder ? 'placeholder="' + placeholder + '"' : ''
		const html_label_class = css_class_label ? ' class="' + css_class_label + '"' : ''
		const html_label = label ? '<label for="' + this.get_dom_id() + '"' + html_label_class + '>' + label + '</label>' : ''
		
		let html = `${html_label}${html_between}<input ${html_id} ${html_type} ${html_value} ${html_placeholder}/>`
		
		return html
	}
}

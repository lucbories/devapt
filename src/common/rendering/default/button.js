
import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/button'


export default class Button extends Component
{
	constructor(arg_name, arg_settings)
	{
		super(arg_name, arg_settings)
		
		this.$type = 'Button'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			label:'no label',
			action_url:null
		}
	}
	
	
	// RENDERING
	render_main()
	{
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isString(this.state.label), context + ':bad state label string')
		
		// GET ATTRIBUTES
		const label = T.isString(this.state.label) ? this.state.label : '?'
		const css_class1 = T.isString(this.state.css_class) ? this.state.css_class : undefined
		const css_class2 = this.get_css_classes_for_tag('button')
		const css_class = (css_class1 ? css_class1 + ' ' : '') + (css_class2 ? css_class2 : '')
		
		// BUILD HTML ELEMENT
		const html_id = 'id="' + this.get_dom_id() + '"'
		const html_css_class = css_class ? `class="${css_class}"` : ''
		
		const html = `<button type="button" ${html_id} ${html_css_class}>${label}</button>`
		
		return html
	}
}

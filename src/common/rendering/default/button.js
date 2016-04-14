
import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/button'


export default class Button extends Component
{
	constructor(arg_name, arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.styles = []
		
		arg_settings.headers = ['<meta keywords="button" />']
		
		const on_click_script = 'function button_on_click() { console.log(arguments, "button click"); }'
		arg_settings.scripts = [on_click_script]
		
		super(arg_name, arg_settings)
		
		this.$type = 'Button'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			label:'no label',
			action_url:null/*,
			action_cb:null*/ // TODO more button actions
		}
	}
	
	
	// RENDERING
	render()
	{
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isString(this.state.label), context + ':bad state label string')
		assert( T.isString(this.state.action_url), context + ':bad state action url string')
		
        // console.log(this.$settings.scripts, 'button scripts')
		
		// BUILD HTML ELEMENT
		let html = '<button id="' + this.get_dom_id() + '" onclick="button_on_click(this)">' + this.state.label + '</button>'
		
		return html
	}
}


import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/vbox'


export default class VBox extends Component
{
	constructor(arg_name, arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.styles = []
		
		arg_settings.headers = ['<meta keywords="vbox" />']
		
		super(arg_name, arg_settings)
		
		this.$type = 'VBox'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			items: [],
			label:'no label'
		}
	}
	
	
	// RENDERING
	render_main()
	{
		// console.log(this.state, 'state2')
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isArray(this.state.items), context + ':bad state items array')
		assert( T.isString(this.state.label), context + ':bad state label string')
		
		
		// BUILD HTML ROWS
		let html_rows = ''
		for(let i = 0 ; i < this.state.items.length ; i++)
		{
			const row = this.state.items[i]
			
			html_rows += '<tr><td>' + row + '</td></tr>'
		}
		
		
		// BUILD HTML TABLE
		let html_table = '<table id="' + this.get_dom_id() + '"><thead><tr><th>' + this.state.label + '</th></tr><thead>'
		html_table += html_rows
		html_table += '<tfoot></tfoot></table>'
		
		return html_table
	}
}


import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/hbox'


export default class HBox extends Component
{
	constructor(arg_name, arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		super(arg_name, arg_settings)
		
		this.$type = 'HBox'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			items: []
		}
	}
	
	
	// RENDERING
	render_main()
	{
		// console.log(this.state, 'state2')
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isArray(this.state.items), context + ':bad state items array')
		
		
		// BUILD HTML ROWS
		let html_thead_content = '<tr>'
		let html_tbody_content = ''
		let html_tfoot_content = ''
		
		for(let i = 0 ; i < this.state.items.length ; i++)
		{
			const row = this.state.items[i]
			
			html_thead_content += '<td>' + row + '</td>'
		}
		html_thead_content += '</tr>\n'
		
		
		// GET ATTRIBUTES
		const css_class1 = T.isString(this.state.css_class) ? this.state.css_class : undefined
		const css_class2 = this.get_css_classes_for_tag('button')
		const css_class = (css_class1 ? css_class1 + ' ' : '') + (css_class2 ? css_class2 : '')
		const css_attributes1 = T.isString(this.state.css_attributes) ? this.state.css_attributes : undefined
		const css_attributes2 = this.get_css_attributes_for_tag('button')
		const css_attributes = (css_attributes1 ? css_attributes1 + ' ' : '') + (css_class2 ? css_attributes2 : '')
		
		// BUILD HTML ELEMENT
		const html_id = 'id="' + this.get_dom_id() + '"'
		const html_css_class = (css_class && css_class != '') ? `class="${css_class}"` : ''
		const html_css_attributes = (css_attributes && css_attributes != '') ? `class="${css_attributes}"` : ''
		const html_thead = `<thead>\n${html_thead_content}<thead>\n`
		const html_tbody = `<tbody>\n${html_tbody_content}<tbody/>\n`
		const html_tfoot = `<tfoot>\n${html_tfoot_content}<tfoot/>`
		
		const html = `<table ${html_id} ${html_css_class} ${html_css_attributes}>\n${html_thead}${html_tbody}${html_tfoot}</table>\n`
		
		return html
	}
}

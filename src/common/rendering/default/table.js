
import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/table'


export default class Table extends Component
{
	constructor(arg_name, arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.styles = []
		
		arg_settings.headers = ['<meta keywords="table" />']
		
		super(arg_name, arg_settings)
		
		this.$type = 'Table'
		// console.log(this.$settings, 'table.settings')
		// console.log(this.state, 'state')
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
			label:'no label',
			type:'Table',
			show_label:true,
			show_headers:true
		}
	}
	
	
	// RENDERING
	render()
	{
		// console.log(this.state, 'state2')
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isArray(this.state.headers), context + ':bad state headers array')
		assert( T.isArray(this.state.items), context + ':bad state items array')
		assert( T.isString(this.state.label), context + ':bad state label string')
		
		
		// BUILD TABLE HEADER
		let html_head = ''
		let html_head_filled = false
		if ( this.state.headers.length > 0)
		{
			html_head_filled = true
			
			for(let i = 0 ; i < this.state.headers.length ; i++)
			{
				const header = this.state.headers[i]
				html_head += '<th>' + header + '</th>'
			}
		}
		
		
		// BUILD HTML ROWS
		let html_rows = ''
		for(let i = 0 ; i < this.state.items.length ; i++)
		{
			html_rows += '<tr>'
			const row = this.state.items[i]
			
			if (T.isObject(row))
			{
				const keys = Object.keys(row)
				for(let key of keys)
				{
					const value = row[key]
					if (! html_head_filled)
					{
						html_head += '<th>' + key + '</th>'
					}
					
					html_rows += '<td>' + value + '</td>'
				}
				
				if (! html_head_filled && html_head != '')
				{
					html_head_filled = true
				}
			}
			
			html_rows += '</tr>'
		}
		
		
		// BUILD HTML TABLE
		let css_classes_table = this.get_css_classes_for_tag('table')
		css_classes_table = (css_classes_table ? ' class="' + css_classes_table + '"': '')
		
		let html_table = '<table id="' + this.get_dom_id() + '"' + css_classes_table + '><thead>'
		
		if (this.state.show_label)
		{
			html_table += '<tr><th>' + this.state.label + '</th></tr>'
		}
		
		if (this.state.show_headers)
		{
			html_table += '<tr>' + html_head + '</tr>'
		}
		
		html_table += '</thead>'
		
		html_table += '<tbody>' + html_rows + '</tbody>'
		html_table += '<tfoot></tfoot></table>'
		
		return html_table
	}
}

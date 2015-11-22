
import T from 'typr'
import assert from 'assert'

import Component from './component'



const context = 'apps/devtools/table'


export default class Table extends Component
{
	constructor(arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.page_styles = []
		
		arg_settings.page_headers = ['<meta keywords="table" />']
		
		super(arg_settings)
		// console.log(this.settings, 'table.settings')
		// console.log(this.state, 'state')
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
			label:'no label'
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
		let html_table = '<table><thead><tr><th>' + this.state.label + '</th></tr><tr>' + html_head + '</tr><thead>'
		html_table += html_rows
		html_table += '<tfoot></tfoot></table>'
		
		return html_table
	}
}

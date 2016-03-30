
import T from 'typr'
import assert from 'assert'

import runtime from '../../../common/base/runtime'
import Component from '../../../common/rendering/base/component'



const context = 'plugins/backend-foundation6/plugin/menubar'


export default class Menubar extends Component
{
	constructor(arg_name, arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.page_styles = []
		
		arg_settings.page_headers = ['<meta keywords="menubar" />']
		
		super(arg_name, arg_settings)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
            
			page_scripts_urls:[
				'plugins/foundation-6/js/vendor/jquery.min.js',
				'plugins/foundation-6/js/app.js',
				'plugins/foundation-6/js/foundation.js'],
            
			label:'no label'
		}
	}
	
	
	// RENDERING
	render()
	{
		// console.log(this.state, 'state2')
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isArray(this.state.items), context + ':bad state items array')
		assert( T.isString(this.state.label), context + ':bad state label string')
		
		const state = this.get_state()
		
		// BUILD HTML ROWS
		let html_left_menus = ''
		for(let i = 0 ; i < this.state.items.length ; i++)
		{
			const row = this.state.items[i]
			
			if ( T.isArray(row.items) )
			{
				let html_row = '<a href="#">' + row.label + '</a>'
				html_row += '<ul class="menu vertical">'
				for(let j = 0 ; j < row.items.length ; j++)
				{
					const sub_row = row.items[j]
					const url = runtime.context.get_url_with_credentials(state.app_url + sub_row.url, state.request)
					const sub_html_row =  '<a href="/' + url + '">' + sub_row.label + '</a>\n'
					html_row += '<li>' + sub_html_row + '</li>'
				}
				html_row += '</ul>'
				
				html_left_menus += '<li>' + html_row + '</li>'
			}
			else
			{
				const url = runtime.context.get_url_with_credentials(state.app_url + row.url, state.request)
				const html_row = '<a href="/' + url + '">' + row.label + '</a>\n'
				html_left_menus += '<li>' + html_row + '</li>'
			}
		}
		
		
		// BUILD HTML TABLE
		let html = '<div id="' + this.get_dom_id() + '" class="top-bar">'
		html += '<div class="top-bar-left">'
		html += 	'<ul class="dropdown menu" data-dropdown-menu>'
		html += 		'<li class="menu-text">' + this.state.label + '</li>'
		html += 		html_left_menus
		html += 	'</ul>'
		html += '</div></div>'
		
		return html
	}
}

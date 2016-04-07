
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
				html_row += '<ul class="submenu menu vertical" data-submenu>'
				for(let j = 0 ; j < row.items.length ; j++)
				{
					const sub_row = row.items[j]
					const url = runtime.context.get_url_with_credentials(state.app_url + sub_row.url, state.request)
					const sub_html_row =  '<a href="/' + url + '">' + sub_row.label + '</a>\n'
					html_row += '<li role="menuitem">\n' + sub_html_row + '</li>\n'
				}
				html_row += '</ul>\n'
				
				html_left_menus += '<li>\n' + html_row + '</li>\n'
			}
			else
			{
				const url = runtime.context.get_url_with_credentials(state.app_url + row.url, state.request)
				const html_row = '<a href="/' + url + '">' + row.label + '</a>\n'
				html_left_menus += '<li>\n' + html_row + '</li>\n'
			}
		}
		
		
		// BUILD HTML TABLE
		let html = ''
		html += '<div class="" id="' + this.get_dom_id() + '">'
		html += '<nav class="top-bar">\n'
		
		html += '	<div class="top-bar-title">\n'
		html += '		<ul class="dropdown menu">'
		html += '			<li role="menuitem">\n'
		html += '				<strong>' + this.state.label + ' HELLO !!</strong>\n'
		html += 			'</li>\n'
		html += 		'</ul>\n'
		html += '	</div>\n'
		
		html += 	'<div class="top-bar-left">\n'
		html += 		'<ul class="dropdown menu" data-dropdown-menu>\n'
		html += 			html_left_menus
		html += 		'</ul>\n'
		html += 	'</div>\n'
		html += '</div>\n'
		html += '</nav>\n'
		
		return html
	}
}

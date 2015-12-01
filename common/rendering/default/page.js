
import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/page'


export default class Page extends Component
{
	constructor(arg_name, arg_settings)
	{
		super(arg_name, arg_settings)
		
		this.$type = 'Page'
	}
	
	
	// READONLY INITIAL SETTINGS
	get_default_settings()
	{
		return {
			charset:'utf-8',
			headers:[],
			styles:[],
			children:[],
			scripts:[],
			scripts_urls:[],
			label:"no label"
		}
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {}
	}
	
	
	// RENDERING
	render()
	{
		// console.log(this.$settings, 'page.settings')
		// console.log(this.state, 'page.state')
		
		assert( T.isObject(this.$settings), context + ':bad state object')
		assert( T.isArray(this.$settings.headers), context + ':bad state headers array')
		assert( T.isArray(this.$settings.styles), context + ':bad state styles array')
		assert( T.isArray(this.$settings.children), context + ':bad state children array')
		assert( T.isArray(this.$settings.scripts), context + ':bad state scripts array')
		assert( T.isArray(this.$settings.scripts_urls), context + ':bad state scripts urls array')
		assert( T.isString(this.$settings.label), context + ':bad state label string')
		
		// CONCAT CHILDREN STATES
		for(let child of this.$settings.children)
		{
			// console.log(child.state, 'child.state')
			// console.log(child.settings, 'child.settings')
			const child_headers = child.get_headers()
			const child_styles = child.get_styles()
			const child_scripts = child.get_scripts()
			const child_scripts_urls = child.get_scripts_urls()
			
			if (child_headers && child_headers.length > 0)
			{
				this.$settings.headers = Array.concat(this.$settings.headers, child_headers)
			}
			if (child_styles && child_styles.length > 0)
			{
				this.$settings.styles = Array.concat(this.$settings.styles, child_styles)
			}
			if (child_scripts && child_scripts.length > 0)
			{
				this.$settings.scripts = Array.concat(this.$settings.scripts, child_scripts)
			}
			if (child_scripts_urls && child_scripts_urls.length > 0)
			{
				this.$settings.scripts_urls = Array.concat(this.$settings.scripts_urls, child_scripts_urls)
			}
		}
		
		let html = '<html>'
		html += this.render_head()
		html += this.render_body()
		
		return html + '</html>'
	}
	
	render_head()
	{
		const html_styles = this.$settings.styles.join('\n')
		const html_headers = this.$settings.headers.join('\n')
		
		return `<head>
			<meta charSet="${this.$settings.charset}"/>
			<title>${this.$settings.label}</title>
			
			${html_headers}
			
			<style type='text/css'>
				${html_styles}
			</style>
		</head>\n`
	}
	
	render_body()
	{
		let html = '<body>\n' + this.render_body_header()
		html += '<div id="content">\n' + this.render_body_children() + '</div>\n'
		
		// console.log(this.$settings.scripts, 'scripts')
		// console.log(this.$settings.scripts_urls, 'scripts_urls')
		if (this.$settings.scripts_urls.length > 0)
		{
			html += this.$settings.scripts_urls.map(url => `<script type="text/javascript" src="${url}"></script>`).join('\n') + '\n'
		}
		
		html += this.render_body_script()
		html += this.render_body_footter()
		
		return html + '</body>\n'
	}
	
	render_body_header()
	{
		return '<header></header>\n'
	}
	
	render_body_children()
	{
		return this.$settings.children.map(child => child.render()).join('\n')
	}
	
	render_body_script()
	{
		const html_scripts = this.$settings.scripts.join('\n')
		return `<script>${html_scripts}</script>\n`
	}
	
	render_body_footter()
	{
		return '<footer></footer>\n'
	}
}

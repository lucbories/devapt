
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
		this.$page_id = 'content'
		
		const render = arg_settings.render ? arg_settings.render : null
		assert( T.isObject(render) && render.is_render, context + ':bad render object')
		this.renderer = render
	}
	
	
	// READONLY INITIAL SETTINGS
	get_default_settings()
	{
		return {
			charset:'utf-8',
			headers:[],
			
			styles:[],
			styles_urls:[],
			
			scripts:[],
			scripts_urls:[],
			
			children:[],
			
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
		assert( T.isArray(this.$settings.styles_urls), context + ':bad state styles urls array')
		assert( T.isArray(this.$settings.children), context + ':bad state children array')
		assert( T.isArray(this.$settings.scripts), context + ':bad state scripts array')
		assert( T.isArray(this.$settings.scripts_urls), context + ':bad state scripts urls array')
		assert( T.isString(this.$settings.label), context + ':bad state label string')
		
		// CONCAT CHILDREN STATES
		for(let child of this.$settings.children)
		{
			// console.log(child.state.scripts_urls, 'child.state.scripts_urls')
			// console.log(child.settings, 'child.settings')
			
			const child_headers = child.get_headers()
			
			const child_styles = child.get_styles()
			const child_styles_urls = child.get_styles_urls()
			
			const child_scripts = child.get_scripts()
			const child_scripts_urls = child.get_scripts_urls()
			
			if (child_headers && child_headers.length > 0)
			{
				this.$settings.headers = this.$settings.headers.concat(child_headers)
			}
			
			if (child_styles && child_styles.length > 0)
			{
				this.$settings.styles = this.$settings.styles.concat(child_styles)
			}
			if (child_styles_urls && child_styles_urls.length > 0)
			{
				this.$settings.styles_urls = this.$settings.styles_urls.concat(child_styles_urls)
			}
			
			if (child_scripts && child_scripts.length > 0)
			{
				this.$settings.scripts = this.$settings.scripts.concat(child_scripts)
			}
			if (child_scripts_urls && child_scripts_urls.length > 0)
			{
				this.$settings.scripts_urls = this.$settings.scripts_urls.concat(child_scripts_urls)
			}
		}
		
		let html = '<html>'
		html += this.render_head()
		html += this.render_body()
		
		return html + '</html>'
	}
	
	render_head()
	{
		const html_styles = this.get_styles().join('\n')
		const html_headers = this.$settings.headers.join('\n')
		
		// STYLES URLS
		let css_headers = ''
		let urls_map = {}
		const all_styles_urls = this.get_styles_urls()
		if (all_styles_urls.length > 0)
		{
			css_headers += all_styles_urls.map(
				url => {
					if (url in urls_map)
					{
						return
					}
					
					urls_map[url] = true
					
					// console.log(url, 'url')
					const absolute_url = this.renderer.get_assets_style_url(url)
					return `<link href="${absolute_url}" media="all" rel="stylesheet"/>`
				}
			).join('\n') + '\n'
		}
		
		return `<head>
			<meta charSet="${this.$settings.charset}"/>
			<title>${this.$settings.label}</title>
			
			${html_headers}
			${css_headers}
			
			<style type='text/css'>
				${html_styles}
			</style>
		</head>\n`
	}
	
	render_body()
	{
		let html = '<body>\n' + this.render_body_header()
		html += '<div id="' + this.$page_id + '" style="display:\'none\';">\n' + this.render_body_children() + '</div>\n'
		
		
		// SCRIPTS URLS
		let urls_map = {}
		const all_scripts_urls = this.get_scripts_urls()
		// console.log(all_scripts_urls, 'render_body:all_scripts_urls')
		if (all_scripts_urls.length > 0)
		{
			html += all_scripts_urls.map(
				url => {
					if (url in urls_map)
					{
						return
					}
					
					urls_map[url] = true
					
					// console.log(url, 'RENDER SCRIPTS URLS url')
					const absolute_url = this.renderer.get_assets_script_url(url)
					return `<script type="text/javascript" src="${absolute_url}"></script>`
				}
			).join('\n') + '\n'
			
			html += '<script type="text/javascript" src="/socket.io/socket.io.js"></script>\n\n'
		}
		
		// INLINE SCRIPT AND FOOTER
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
		const show_content = '\n document.getElementById("' + this.$page_id + '").style.display="block";\n'
		const handler_1 = 'function(e){ ' + show_content + '}'
		const on_ready = '\n document.addEventListener("DOMContentLoaded", ' + handler_1 + ', false);\n'
		return `<script type="text/babel">${html_scripts} ${on_ready}</script>\n`
	}
	
	render_body_footter()
	{
		return '<footer></footer>\n'
	}
}

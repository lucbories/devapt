
import T from 'typr'
import assert from 'assert'

// import runtime from '../../base/runtime'
// import Component from '../base/component'
import Container from '../base/container'



const context = 'common/rendering/default/page'


export default class Page extends Container
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
			
			label:'no label'
		}
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {}
	}
	
	
	
	/**
	 * Render page.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_main()
	{
		let html = '<html>'
		html += this.render_head()
		html += this.render_body()
		
		return html + '</html>'
	}
	
	
	
	/**
	 * Render page head.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_head()
	{
		const html_styles = this.get_styles().join('\n')
		const html_headers = this.get_headers().join('\n')
		
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
		
		const charset = this.get_setting(['charset'], 'utf8')
		const title = this.get_setting(['title'], 'Main')
		
		return `<head>
			<meta charSet="${charset}"/>
			<title>${title}</title>
			
			${html_headers}
			${css_headers}
			
			<style type='text/css'>
				${html_styles}
			</style>
		</head>\n`
	}
	
	
	
	/**
	 * Render page body.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_body()
	{
		let html = '<body>\n' + this.render_body_header()
		html += '\n<div id="' + this.$page_id + '" style="display:\'none\';">\n' + this.render_body_children() + '\n</div>\n'
		
		
		// SCRIPTS URLS
		let urls_map = {}
		const all_scripts_urls = this.get_scripts_urls()
		// console.log(all_scripts_urls, 'render_body:all_scripts_urls')
		if (all_scripts_urls.length > 0)
		{
			html += all_scripts_urls.map(
				script_item => {
					let url = script_item
					let type = 'text/javascript'
					
					if ( T.isObject(script_item) )
					{
						url = script_item.url
						type = script_item.type
					}
					
					if (url in urls_map)
					{
						return
					}
					
					urls_map[url] = true
					
					// console.log(url, 'RENDER SCRIPTS URLS url')
					const absolute_url = this.renderer.get_assets_script_url(url)
					return `<script type="${type}" src="${absolute_url}"></script>`
				}
			).join('\n') + '\n'
			
			html += '<script type="text/javascript" src="/socket.io/socket.io.js"></script>\n\n'
		}
		
		// INLINE SCRIPT AND FOOTER
		html += this.render_state_store()
		html += this.render_devapt_init()
		html += this.render_body_script()
		html += this.render_body_footer()
		
		return html + '</body>\n'
	}
	
	
	
	/**
	 * Render page header.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_body_header()
	{
		return '<header></header>\n'
	}
	
	
	
	/**
	 * Render page children.
	 * 
	 * @returns {string} - HTML code.
	 */
	
	render_body_children()
	{
		return this.get_children().map(child => child.render()).join('\n')
	}
	
	
	
	/**
	 * Render page scripts.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_body_script()
	{
		const html_scripts = this.get_scripts().join('\n')
		const show_content = '\n document.getElementById("' + this.$page_id + '").style.display="block";\n'
		const handler_1 = 'function(e){ ' + show_content + '}'
		const on_ready = '\n document.addEventListener("DOMContentLoaded", ' + handler_1 + ', false);\n'
		return `<script type="text/javascript">${html_scripts} ${on_ready}</script>\n`
	}
	
	
	
	/**
	 * Render page footer.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_body_footer()
	{
		return '<footer></footer>\n'
	}
	
	
	
	/**
	 * Render state store init code.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_state_store()
	{
		let initial_state = this.get_children_state()

		initial_state.credentials = {
			"tenant":"{{{credentials_tenant}}}",
			"env":"{{{credentials_env}}}",
			"application":"{{{credentials_application}}}",
			
			"token":"{{{credentials_token}}}",
			"user_name":"{{{credentials_user_name}}}",
			"user_pass_digest":"{{{credentials_pass_digest}}}",

			"ts_login":"{{{credentials_login}}}",
			"ts_expiration":"{{{credentials_expire}}}",

			"errors_count":"{{{credentials_errors_count}}}",
			"renew_count":"{{{credentials_renew_count}}}"
		}

		initial_state.app_url = this.renderer.application ? this.renderer.application.app_url : null
		initial_state.app_assets = this.renderer.application ? this.renderer.application.app_assets : null
		initial_state.commands = this.renderer.application ? this.renderer.application.get_resources_settings('commands') : {}

		const stored_state = JSON.stringify(initial_state)
		return `<script>window.__INITIAL_STATE__ = ${stored_state}</script>\n`
	}
	
	
	
	/**
	 * Render Devapt init code.
	 * 
	 * @returns {string} - HTML code.
	 */
	render_devapt_init()
	{
		const default_view = this.get_setting('default_view')
		const default_menubar = this.get_setting('default_menubar')

		return `<script>
			$(document).ready(
				function()
				{
					// CREATE ROOT
					var private_devapt = {}
					window.devapt = function() { return private_devapt }
					
					function reducers(prev_state, action)
					{
						if (! prev_state)
						{
							prev_state = {}
						}
						if (! prev_state.counter)
						{
							prev_state.counter = 0
						}
						prev_state.counter++
						
						// console.log(prev_state, 'state')
						
						return prev_state
					}
					
					// CREATE RUNTIME
					var runtime_settings = {
						reducers:reducers,
						default_view:"${default_view}",
						default_menubar:"${default_menubar}"
					}
					var ClientRuntime = require('client_runtime').default
					var private_runtime = new ClientRuntime()
					private_devapt.runtime = function() { return private_runtime }
					
					private_runtime.load(runtime_settings)
					
					var private_ui = private_runtime.ui
					private_devapt.ui = function(arg_name)
					{
						if (arg_name)
						{
							return private_ui.get(arg_name)
						}
						return private_ui
					}
					
				}
			)
		</script>\n`
	}
}

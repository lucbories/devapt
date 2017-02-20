// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import {is_server} from '../utils/is_browser'
import rendering_factory from './rendering_factory'
import RenderingBuilderAssets from './rendering_builder_assets'
import RenderingResolverBuilder from './rendering_resolver'


const context = 'common/rendering/rendering_builder'



/**
 * Rendering wrapper class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RenderingBuilder extends RenderingBuilderAssets
{
    /**
     * Create a rendering wrapper class.
	 * 
	 * API:
	 * 		->constructor(arg_runtime, arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html, arg_application)
	 * 
	 * 		->get_content_description(arg_view_name, arg_menubar_name):object - Get application content description.
	 * 		->get_initial_state(arg_view_name, arg_menubar_name):string - Get application initial state as a JSON string.
	 * 
	 * 		->render_html_page(arg_title, arg_view, arg_menubar, arg_credentials, arg_assets_services=undefined):string -  Render full page into HTML string.
	 * 		->render_page(arg_title, arg_view, arg_menubar, arg_credentials, arg_assets_services=undefined):RenderingResult - Render full page.
	 * 
	 * 		->render_json_content(arg_view, arg_menubar, arg_credentials, arg_assets_services):object - Render page content (inside 'content' DIV element) with a menubar and a view and convert rendering result to JSON.
	 * 		->render_content(arg_view, arg_menubar, arg_credentials, arg_assets_services):RenderingResult - Render page content (inside 'content' DIV element) with a menubar and a view.
	 * 
	 * @param {RuntimeBase} arg_runtime - runtime instance.
	 * @param {string} arg_assets_styles - application service name to provide style assets.
	 * @param {string} arg_assets_scripts - application service name to provide script assets.
	 * @param {string} arg_assets_img - application service name to provide image assets.
	 * @param {string} arg_assets_html - application service name to provide html assets.
	 * @param {TopologyDefineApplication} arg_application - application.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_runtime, arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html, arg_application)
	{
		if ( T.isObject(arg_assets_styles) && T.isString(arg_assets_styles.style) && T.isString(arg_assets_styles.script) && T.isString(arg_assets_styles.image) && T.isString(arg_assets_styles.html) )
		{
			arg_application = arg_assets_scripts

			arg_assets_scripts = arg_assets_styles.script
			arg_assets_img = arg_assets_styles.image
			arg_assets_html = arg_assets_styles.html
			arg_assets_styles = arg_assets_styles.style
		}

		super(arg_runtime, arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html, arg_application)
		
		this.update_trace_enabled()
	}
	
	
	
	/**
	 * Get application content description.
	 * 
	 * @param {string} arg_view_name - main view name.
	 * @param {string} arg_menubar_name - main menubar name.
	 * 
	 * @returns {object} - content description object as { name:..., type:..., state:..., settings:..., children:... }.
	 */
	get_content_description(arg_view_name, arg_menubar_name)
	{
		// console.log(context + ':get_content_description:view=%s, menubar=%s', arg_view_name, arg_menubar_name)
		return {
			name:'content',
			type:'page_content',
			state:{
				body_contents:[arg_menubar_name, 'separator', arg_view_name]
			},
			settings:{
				assets_urls_templates:{
					script:is_server() ? this.get_assets_script_url('{{url}}') : this._runtime.ui()._ui_rendering.get_asset_url('{{url}}', 'script', this._runtime.session_credentials),
					style: is_server() ? this.get_assets_style_url('{{url}}')  : this._runtime.ui()._ui_rendering.get_asset_url('{{url}}', 'style',  this._runtime.session_credentials),
					image: is_server() ? this.get_assets_image_url('{{url}}')  : this._runtime.ui()._ui_rendering.get_asset_url('{{url}}', 'image',  this._runtime.session_credentials),
					html:  is_server() ? this.get_assets_html_url('{{url}}')   : this._runtime.ui()._ui_rendering.get_asset_url('{{url}}', 'html',   this._runtime.session_credentials)
				}
			},
			children:{
				separator:{
					name:'separator',
					type:'table',
					state:{},
					settings: {
						id:'separator',
						classes:'devapt-layout-persistent'
					}
				}
			}
		}
	}
	
	
	
	/**
	 * Get application initial state as a JSON string.
	 * 
	 * @param {string} arg_view_name - main view name.
	 * @param {string} arg_menubar_name - main menubar name.
	 * 
	 * @returns {string} - state JSON string.
	 */
	get_initial_state(arg_view_name, arg_menubar_name)
	{
		let initial_state = this._application ? this._application.export_settings() : {}

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

		initial_state.app_url    = this._application ? this._application.app_url : null
		initial_state.app_assets = this._application ? this._application.app_assets : null
		initial_state.commands   = this._application ? this._application.get_resources_settings('commands') : {}
		initial_state.views      = this._application ? this._application.get_resources_settings('views') : {}
		initial_state.menubars   = this._application ? this._application.get_resources_settings('menubars') : {}
		initial_state.menus      = this._application ? this._application.get_resources_settings('menus') : {}
		initial_state.models     = this._application ? this._application.get_resources_settings('models') : {}

		initial_state.assets_urls_templates = {
			script:this.get_assets_script_url('{{url}}'),
			style:this.get_assets_style_url('{{url}}'),
			image:this.get_assets_image_url('{{url}}'),
			html:this.get_assets_html_url('{{url}}')
		}

		initial_state.plugins_urls= {}
		if ( T.isArray(initial_state.used_plugins) )
		{
			const tenant = this._application.get_topology_owner()
			if (! tenant)
			{
				this.error('no owner tenant found for this application')
				console.error(context + ':get_initial_state:no owner tenant found for this application')
			} else {
				_.forEach(initial_state.used_plugins,
					(plugin_name)=>{
						// console.log('plugin_name', plugin_name)

						const plugin = tenant.get_topology_owner().plugin(plugin_name)
						if ( ! plugin )
						{
							console.error(context + ':get_initial_state:plugin not found for [' + plugin_name + ']')
							return
						}
						
						if ( T.isFunction(plugin.topology_plugin_instance.get_browser_plugin_file_url) )
						{
							const url = plugin.topology_plugin_instance.get_browser_plugin_file_url()
							if ( T.isString(url) )
							{
								initial_state.plugins_urls[plugin_name] = url
							}
						}
					}
				)
			}
		}
		
		if (! initial_state.views.content)
		{
			initial_state.views.content = this.get_content_description(arg_view_name, arg_menubar_name)
			// _.forEach(initial_state.views.content.children,
			// 	(view_desc, view_name)=>{
			// 		initial_state.views[view_name] = view_desc
			// 	}
			// )
		}

		return JSON.stringify(initial_state)
	}



	/**
	 * Render full page into HTML string.
	 * 
	 * @param {string|undefined} arg_title - page title, application title (optional).
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {object} arg_assets_services - assets record (optional).
	 * 
	 * @returns {string} - rendering HTML code.
	 */
	render_html_page(arg_title, arg_view, arg_menubar, arg_credentials, arg_assets_services=undefined)
	{
		const rendering_result = this.render_page(arg_title, arg_view, arg_menubar, arg_credentials, arg_assets_services)
		const html = '<!DOCTYPE html>' + rendering_result.get_final_html('page')
		const rendered_html = this._runtime.context.render_credentials_template(html, arg_credentials)

		return rendered_html
	}



	/**
	 * Render full page.
	 * 
	 * @param {string|undefined} arg_title - page title, application title (optional).
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {object} arg_assets_services - assets record (optional).
	 * 
	 * @returns {RenderingResult} - rendering result instance.
	 */
	render_page(arg_title, arg_view, arg_menubar, arg_credentials, arg_assets_services=undefined)
	{
		assert( T.isObject(arg_credentials) && arg_credentials.is_credentials, context + ':render_page:bad credentials object')
		
		// ONLY FOR SERVER SIDE
		assert( is_server(), context + ':render_page:only for server side')


		// SET ASSETS SERVICES NAMES
		if ( T.isObject(arg_assets_services) )
		{
			this.set_assets_services_names(arg_assets_services.style, arg_assets_services.script, arg_assets_services.image, arg_assets_services.html)
		}

		// GET TOPOLOGY DEFINED APPLICATION
		const topology_define_app = this.get_topology_defined_application(arg_credentials)
		assert(topology_define_app, context + ':render_page:bad topology_define_app')
		
		// GET VIEW
		const default_view_name = topology_define_app.app_default_view
		// const view = ( T.isString(arg_view) || ( T.isObject(arg_view) && arg_view.is_component ) ) ? arg_view : default_view_name
		
		// GET MENUBAR
		const default_menubar_name = topology_define_app.app_default_menubar
		// const menubar = ( T.isString(arg_menubar) || ( T.isObject(arg_menubar) && arg_menubar.is_component ) ) ? arg_menubar : default_menubar_name

		// GET DEFAULT TITLE IF NEEDED
		const default_title = topology_define_app.app_title
		const title = arg_title ? arg_title : default_title

		// TODO ADDSECURITY  HEADERS
		// const auth_basic_realm = '<meta http-equiv="WWW-Authenticate" content="Basic realm=Devtools"/>'
		// const auth_basic_credentials = '<meta http-equiv="Authorization" content="Basic {{{credentials_basic_base64}}}"/>'

		const view_name = T.isString(arg_view) ? arg_view : ( ( T.isObject(arg_view) && arg_view.is_component ) ? arg_view.get_name() : default_view_name )
		const menubar_name = T.isString(arg_menubar) ? arg_menubar : ( ( T.isObject(arg_menubar) && arg_menubar.is_component ) ? arg_menubar.get_name() : default_menubar_name )
		const content_result = this.render_json_content(view_name, menubar_name, arg_credentials, arg_assets_services)
		const stored_state = this.get_initial_state(view_name, menubar_name)

		const page = {
			type:'page',
			state:{
				title:title,
				metas:undefined,

				body_headers:undefined,
				body_contents:[],
				body_footers:undefined,
				
				head_styles_tags:content_result.head_styles_tags,
				head_styles_urls:topology_define_app.app_assets_css.concat(content_result.head_styles_urls),
				
				head_scripts_tags:content_result.head_scripts_tags,
				head_scripts_urls:content_result.head_scripts_urls,

				body_styles_tags:content_result.body_styles_tags,
				body_styles_urls:content_result.body_styles_urls,

				body_scripts_tags:content_result.body_scripts_tags, // SEE LATER FOR CONTENT
				body_scripts_urls:[
					{
						id:'js-socketio',
						src:'/socket.io/socket.io.js',
						absolute:true
					}
				].concat(content_result.body_scripts_urls, topology_define_app.app_assets_js)
			},
			settings:{
				html_lang:undefined,
				html_class:undefined,
				html_prefix:undefined,

				head_charset:'utf-8',
				head_viewport:undefined,
				head_description:undefined,
				head_robots:undefined,

				body_class:undefined,

				assets_urls_templates:{
					script:this.get_assets_script_url('{{url}}'),
					style:this.get_assets_style_url('{{url}}'),
					image:this.get_assets_image_url('{{url}}'),
					html:this.get_assets_html_url('{{url}}')
				}
			},
			children:{}
		}

		const rendering_context = {
			trace_fn:undefined, /*console.log,*/
			resolver:RenderingResolverBuilder.from_topology('server resolver from topology for page', topology_define_app),
			credentials:arg_credentials,
			rendering_factory:rendering_factory
		}
		
		content_result.head_styles_urls = []
		content_result.head_styles_tagss = []
		content_result.head_scripts_urls = []
		content_result.head_scripts_tags = []
		content_result.body_styles_urls = []
		content_result.body_styles_tags = []
		content_result.body_scripts_urls = []
		content_result.body_scripts_tags = []
		
		content_result.assets_urls_templates = page.settings.assets_urls_templates

		// console.log(context + ':render_page:content_result', content_result.vtrees.content.c)

		let content_json_str_result = JSON.stringify(content_result)
		content_json_str_result = content_json_str_result.replace(/"class"/g, '"className"')

		page.state.body_scripts_tags = page.state.body_scripts_tags.concat([
			{
				id:'js-initial-state',
				content:`window.__INITIAL_STATE__ = ${stored_state};`
			},
			{
				id:'js-initial-content',
				content:`window.__INITIAL_CONTENT__ = ${content_json_str_result};`
			}
		])

		const rendering_result = rendering_factory(page, rendering_context, page.children)
		return rendering_result
	}

	

	/**
	 * Render page content (inside 'content' DIV element) with a menubar and a view and convert rendering result to JSON.
	 * 
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {object} arg_assets_services - assets record (optional).
	 * 
	 * @returns {object} - rendering result converted to JSON object.
	 */
	render_json_content(arg_view, arg_menubar, arg_credentials, arg_assets_services)
	{
		const result = this.render_content(arg_view, arg_menubar, arg_credentials, arg_assets_services)
		const json = result.convert_to_json()
		return json
	}

	

	/**
	 * Render page content (inside 'content' DIV element) with a menubar and a view.
	 * 
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {object} arg_assets_services - assets record (optional).
	 * 
	 * @returns {RenderingResult} - rendering result instance.
	 */
	render_content(arg_view, arg_menubar, arg_credentials, arg_assets_services)
	{
		assert( T.isString(arg_view) || ( T.isObject(arg_view) && arg_view.is_component ), context + ':bad view string or object')
		assert( T.isObject(arg_credentials) && arg_credentials.is_credentials, context + ':bad credentials object')
		
		// SET ASSETS SERVICES NAMES
		if ( T.isObject(arg_assets_services) )
		{
			this.set_assets_services_names(arg_assets_services.style, arg_assets_services.script, arg_assets_services.image, arg_assets_services.html)
		}

		// RUN ON SERVER SIDE
		if ( is_server() )
		{
			assert( T.isString(arg_view) || T.isString(arg_menubar), context + ':bad view or menubar name string')
			
			// RUN ON BROWSER SIDE
			const rendering_result = this._render_content_on_server(arg_view, arg_menubar, arg_credentials)
			return rendering_result
		}

		// RUN ON BROWSER SIDE
		const rendering_result = this._render_content_on_browser(arg_view, arg_menubar, arg_credentials)
		return rendering_result
	}


	/**
	 * Get rendering function resolver.
	 * 
	 * @returns {Function} - rendering function resolver.
	 */
	static get_rendering_function_resolver(arg_credentials)
	{
		if ( is_server() )
		{
			// GET TOPOLOGY DEFINED APPLICATION
			const topology_define_app = this.get_topology_defined_application(arg_credentials)
			assert(topology_define_app, context + ':render_content:bad topology_define_app')
			
			// GET SERVER RESOLVER
			const resolver = RenderingResolverBuilder.from_topology('server resolver from topology', topology_define_app)
			return resolver
		}

		// GET BROWSER RESOLVER
		const res_resolver = window.devapt().ui().get_resource_description_resolver()
		const rf_resolver  = window.devapt().ui().get_rendering_function_resolver()
		const rendering_resolver = RenderingResolverBuilder.from_resolvers('browser resolver from ui', res_resolver, rf_resolver)
		return rendering_resolver
	}



	/**
	 * Render page content on browser side.
	 * @private
	 * 
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * 
	 * @returns {RenderingResult} - rendering result instance.
	 */
	_render_content_on_browser(arg_view_name, arg_menubar_name, arg_credentials)
	{
		const store = this._runtime.get_state_store()
		const state = store.get_state()

		const res_resolver = this._runtime.ui().get_resource_description_resolver()
		const rf_resolver  = this._runtime.ui().get_rendering_function_resolver()
		const rendering_resolver = RenderingResolverBuilder.from_resolvers('browser resolver from ui', res_resolver, rf_resolver)

		// GET DEFAULT VIEW
		const default_view_name = state.get('default_view', undefined)
		
		// GET DEFAULT MENUBAR
		const default_menubar_name = state.get('default_menubar', undefined)
		
		return this._render_content_common(arg_view_name, arg_menubar_name, arg_credentials, default_view_name, default_menubar_name, rendering_resolver)
	}



	/**
	 * Render page content on server side.
	 * @private
	 * 
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * 
	 * @returns {RenderingResult} - rendering result instance.
	 */
	_render_content_on_server(arg_view_name, arg_menubar_name, arg_credentials)
	{
		// GET TOPOLOGY DEFINED APPLICATION
		const topology_define_app = this.get_topology_defined_application(arg_credentials)
		assert(topology_define_app, context + ':render_content:bad topology_define_app')

		// GET DEFAULT VIEW
		const default_view_name = topology_define_app.app_default_view
		
		// GET DEFAULT MENUBAR
		const default_menubar_name = topology_define_app.app_default_menubar
		
		const resolver = RenderingResolverBuilder.from_topology('server resolver from topology', topology_define_app)

		return this._render_content_common(arg_view_name, arg_menubar_name, arg_credentials, default_view_name, default_menubar_name, resolver)
	}



	/**
	 * Render page content helper on browser or server side.
	 * @private
	 * 
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {string} arg_default_view_name - default view name.
	 * @param {string} arg_default_menubar_name - default menubar name.
	 * @param {RenderingResolver} arg_rendering_resolver - object with 'find_rendering_function(type name)' method.
	 * 
	 * @returns {RenderingResult} - rendering result instance.
	 */
	_render_content_common(arg_view_name, arg_menubar_name, arg_credentials, arg_default_view_name, arg_default_menubar_name, arg_rendering_resolver)
	{
		const menubar = (arg_menubar_name ? arg_menubar_name : arg_default_menubar_name)
		const view    = (arg_view_name    ? arg_view_name    : arg_default_view_name)
		const content = this.get_content_description(view, menubar)

		// DEBUG
		// console.log(context + ':_render_content_common:arg_view_name=%s,arg_menubar_name=%s,view=%s,menubar=%s', arg_view_name, arg_menubar_name, view, menubar)
		// console.log(context + ':_render_content_common:content', content)

		const rendering_context = {
			trace_fn:undefined,//console.log,//
			resolver:arg_rendering_resolver,
			credentials:arg_credentials,
			rendering_factory:rendering_factory
		}
		
		const rendering_result = rendering_factory(content, rendering_context, undefined)
		
		rendering_result.assets_urls_templates = content.settings.assets_urls_templates

		return rendering_result
	}
}

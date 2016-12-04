// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import {is_browser, is_server} from '../utils/is_browser'
import Loggable from '../base/loggable'
import RenderingResult from './rendering_result'
import rendering_factory from './rendering_factory'


const context = 'common/rendering/rendering_builder'



/**
 * Rendering wrapper class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RenderingBuilder extends Loggable
{
    /**
     * Create a rendering wrapper class.
	 * 
	 * API:
	 * 		->render_content(arg_title, arg_view, arg_menubar, arg_credentials):string - generate page HTML string.
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
		super(context)

		this.is_render = true

		this._application = arg_application
		this._runtime = arg_runtime

		// this._rendering_manager = this._runtime.get_plugins_factory().get_rendering_manager()
		
		this.set_assets_services_names(arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html)
		
		this.update_trace_enabled()
	}



	/**
	 * Set assets services names.
	 * 
	 * @param {string} arg_assets_styles  - styles assets service name.
	 * @param {string} arg_assets_scripts - scripts assets service name.
	 * @param {string} arg_assets_img     - images assets service name.
	 * @param {string} arg_assets_html    - html assets service name.
	 * 
	 * @returns {nothing}
	 */
	set_assets_services_names(arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html)
	{
		this.assets_styles_service_name = arg_assets_styles ? arg_assets_styles : null
		this.assets_scripts_service_name = arg_assets_scripts ? arg_assets_scripts : null
		this.assets_images_service_name = arg_assets_img ? arg_assets_img : null
		this.assets_html_service_name = arg_assets_html ? arg_assets_html : null

		this.assets_styles_service_consumer = null
		this.assets_scripts_service_consumer = null
		this.assets_images_service_consumer = null
		this.assets_html_service_consumer = null
	}
    


    /**
     * Get an url to server the given image asset.
	 * 
     * @param {string} arg_url - image asset relative url.
	 * 
     * @returns {string} absolute image asset url.
     */
	get_url_with_credentials(arg_url)
	{
		this.enter_group('get_url_with_credentials')

		const url = this._runtime.context.get_url_with_credentials(arg_url)

		this.leave_group('get_url_with_credentials')
		return url
	}
	
    
    /**
     * Get an url to server the given image asset.
     * @param {string} arg_url - image asset relative url.
     * @returns {string} absolute image asset url.
     */
	get_assets_image_url(arg_url)
	{
		this.enter_group('get_assets_image_url')

		const name = this.assets_images_service_name
		const url = this.get_assets_url(this.assets_images_service_consumer, name, arg_url)

		this.leave_group('get_assets_image_url')
		return url
	}
	
    
    /**
     * Get an url to server the given static html asset.
     * @param {string} arg_url - html asset relative url.
     * @returns {string} absolute html asset url.
     */
	get_assets_html_url(arg_url)
	{
		this.enter_group('get_assets_html_url')

		const name = this.assets_html_service_name
		const url = this.get_assets_url(this.assets_html_service_consumer, name, arg_url)

		this.leave_group('get_assets_html_url')
		return url
	}
	
    
    /**
     * Get an url to server the given script asset.
     * @param {string} arg_url - script asset relative url.
     * @returns {string} absolute script asset url.
     */
	get_assets_script_url(arg_url)
	{
		this.enter_group('get_assets_script_url')

		const name = this.assets_scripts_service_name
		const url = this.get_assets_url(this.assets_scripts_service_consumer, name, arg_url)

		this.leave_group('get_assets_script_url')
		return url
	}
	
    
    /**
     * Get an url to server the given style asset.
     * @param {string} arg_url - script asset relative url.
     * @returns {string} absolute script asset url.
     */
	get_assets_style_url(arg_url)
	{
		this.enter_group('get_assets_style_url')

		const name = this.assets_styles_service_name
		const url = this.get_assets_url(this.assets_styles_service_consumer, name, arg_url)

		this.leave_group('get_assets_style_url')
		return url
	}
	
    
    /**
     * Get an url to server the given image asset.
	 * 
     * @param {object} arg_consumer - service consumer.
     * @param {string} arg_svc_name - service name or null.
     * @param {string} arg_url - image asset relative url.
	 * 
     * @returns {string} absolute image asset url.
     */
	get_assets_url(arg_consumer, arg_svc_name, arg_url)
	{
		this.enter_group('get_assets_url')

		// console.log(typeof arg_url, 'arg_url', arg_url)
		assert( T.isString(arg_url), context + ':get_assets_url:bad url string for svc [' + arg_svc_name + '] for url [' + arg_url + ']')

		const has_consumer = T.isObject(arg_consumer) && arg_consumer.is_service_consumer
		if (! has_consumer)
		{
			assert( T.isString(arg_svc_name), context + ':get_assets_url:bad svc name string')

			const deployed_services = this._runtime.deployed_local_topology.deployed_services_map
			const service = (arg_svc_name in deployed_services) ? deployed_services[arg_svc_name] : undefined
			assert( T.isObject(service) && service.is_service, context + ':get_assets_script_url:bad service object')

			this.assets_scripts_service_consumer = service.create_consumer()
		}
		assert( T.isObject(this.assets_scripts_service_consumer) && this.assets_scripts_service_consumer.is_service_consumer, context + ':get_assets_script_url:bad consumer object')

		const service = this.assets_scripts_service_consumer.get_service()
		if (! service)
		{
			this.error('no service found for images assets')
			this.leave_group('get_assets_url')
			return null
		}

		const strategy = null
		const provider = service.get_a_provider(strategy)
		let url = this.assets_scripts_service_consumer.get_url_for(provider, { url: arg_url})
		url = this._runtime.context.get_url_with_credentials(url)

		this.leave_group('get_assets_url')
		return url
	}



	/**
	 * Get TopologyDefineApplication instance from registered application or from credentials.
	 * 
	 * @param {Credentials} arg_credentials - Credentials instance (optional).
	 * 
	 * @returns {TopologyDefineApplication} - request user credentials application.
	 */
	get_topology_defined_application(arg_credentials)
	{
		// GET TOPOLOGY DEFINED APPLICATION
		if ( ! this._application )
		{
			if ( T.isObject(arg_credentials) && arg_credentials.is_credentials )
			{
				const defined_topology = this._runtime.get_defined_topology()
				this._application = defined_topology.find_application_with_credentials(arg_credentials)
				
				if(! this._application)
				{
					console.error(context + ':get_topology_defined_application:application not found')
					return undefined
				}

				return this._application
			}

			console.error(context + ':get_topology_defined_application:bad credentials object')
			return undefined
		}

		return this._application
	}
	
	
	
	/**
	 * Get application initial state.
	 * 
	 * @param {string} arg_view_name - main view name.
	 * @param {string} arg_menubar_name - main menubar name.
	 * 
	 * @returns {string} - state string.
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
		if (! initial_state.views.content)
		{
			initial_state.views.content = {
				name:'content',
				type:'Container',
				state:{
					items:[arg_view_name, arg_menubar_name]
				},
				settings:{},
				children:{}
			}
		}

		return JSON.stringify(initial_state)
	}



	/**
	 * Render a complete page.
	 * 
	 * @param {string|undefined} arg_tile - page title, application title (optional).
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {object} arg_assets_services - assets record (optional).
	 * 
	 * @returns {string|RenderingResult} - rendering result.
	 */
	render_page_content(arg_title, arg_view, arg_menubar, arg_credentials, arg_assets_services=undefined)
	{
		assert( T.isObject(arg_credentials) && arg_credentials.is_credentials, context + ':render_page_content:bad credentials object')
		
		// ONLY FOR SERVER SIDE
		assert( is_server(), context + ':render_page_content:only for server side')


		// SET ASSETS SERVICES NAMES
		if ( T.isObject(arg_assets_services) )
		{
			this.set_assets_services_names(arg_assets_services.style, arg_assets_services.script, arg_assets_services.image, arg_assets_services.html)
		}

		// GET TOPOLOGY DEFINED APPLICATION
		const topology_define_app = this.get_topology_defined_application(arg_credentials)
		assert(topology_define_app, context + ':render_page_content:bad topology_define_app')
		
		// GET VIEW
		const default_view_name = topology_define_app.app_default_view
		const view = ( T.isString(arg_view) || ( T.isObject(arg_view) && arg_view.is_component ) ) ? arg_view : default_view_name
		
		// GET MENUBAR
		const default_menubar_name = topology_define_app.app_default_menubar
		const menubar = ( T.isString(arg_menubar) || ( T.isObject(arg_menubar) && arg_menubar.is_component ) ) ? arg_menubar : default_menubar_name

		// GET DEFAULT TITLE IF NEEDED
		const default_title = topology_define_app.app_title
		const title = arg_title ? arg_title : default_title

		// TODO ADDSECURITY  HEADERS
		// const auth_basic_realm = '<meta http-equiv="WWW-Authenticate" content="Basic realm=Devtools"/>'
		// const auth_basic_credentials = '<meta http-equiv="Authorization" content="Basic {{{credentials_basic_base64}}}"/>'

		const separator = {
			type:'table'
		}

		const view_name = T.isString(arg_view) ? arg_view : ( ( T.isObject(arg_view) && arg_view.is_component ) ? arg_view.get_name() : default_view_name )
		const menubar_name = T.isString(arg_menubar) ? arg_menubar : ( ( T.isObject(arg_menubar) && arg_menubar.is_component ) ? arg_menubar.get_name() : default_menubar_name )
		const content_result = this.render_content(view_name, menubar_name, arg_credentials, arg_assets_services)
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
			topology_defined_application:topology_define_app,
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
		const html = rendering_result.get_final_html('page')
		const rendered_html = this._runtime.context.render_credentials_template(html, arg_credentials)

		return rendered_html
	}

	

	/**
	 * Render a page part.
	 * 
	 * @param {string|Component|undefined} arg_view - main view name or instance (optional) (default application view name).
	 * @param {string|Component|undefined} arg_menubar - main menubar name or instance (optional) (default application menubar name).
	 * @param {Credentials} arg_credentials - credentials instance.
	 * @param {object} arg_assets_services - assets record (optional).
	 * 
	 * @returns {string|RenderingResult} - rendering result.
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
			
			return this._render_content_on_server(arg_view, arg_menubar, arg_credentials)
		}

		// RUN ON BROWSER SIDE
		return this._render_content_on_browser(arg_view, arg_menubar, arg_credentials)
	}



	_render_content_on_browser(arg_view, arg_menubar, arg_credentials)
	{
		const view_state = T.isString(arg_view) ? window.devapt().ui(view_name) : ( ( T.isObject(arg_view) && arg_view.is_component ) ? arg_view.get_state() : undefined)
		const store = window.devapt().runtime().get_state_store()
		const rendering_resolver = undefined

		// GET DEFAULT VIEW
		const default_view_name = store.get('default_view', undefined)
		
		// GET DEFAULT MENUBAR
		const default_menubar_name = store.get('default_menubar', undefined)
		
		return this._render_content_common(arg_view_name, arg_menubar_name, arg_credentials, default_view_name, default_menubar_name, rendering_resolver)
	}


	
	_render_content_on_server(arg_view_name, arg_menubar_name, arg_credentials)
	{
		// GET TOPOLOGY DEFINED APPLICATION
		const topology_define_app = this.get_topology_defined_application(arg_credentials)
		assert(topology_define_app, context + ':render_content:bad topology_define_app')

		// GET DEFAULT VIEW
		const default_view_name = topology_define_app.app_default_view
		
		// GET DEFAULT MENUBAR
		const default_menubar_name = topology_define_app.app_default_menubar
		
		return this._render_content_common(arg_view_name, arg_menubar_name, arg_credentials, default_view_name, default_menubar_name, topology_define_app)
	}


	_render_content_common(arg_view_name, arg_menubar_name, arg_credentials, arg_default_view_name, arg_default_menubar_name, arg_rendering_resolver)
	{
		const separator = {
			type:'table'
		}

		const rendering_context = {
			trace_fn:undefined,//console.log,
			topology_defined_application:arg_rendering_resolver,
			credentials:arg_credentials,
			rendering_factory:rendering_factory
		}

		const content = {
			type:'page_content',
			state:{
				body_contents:[
					(arg_menubar_name ? arg_menubar_name : arg_default_menubar_name),
					separator,
					(arg_view_name    ? arg_view_name    : arg_default_view_name)
				]
			},
			settings:{
				assets_urls_templates:{
					script:this.get_assets_script_url('{{url}}'),
					style:this.get_assets_style_url('{{url}}'),
					image:this.get_assets_image_url('{{url}}'),
					html:this.get_assets_html_url('{{url}}')
				}
			},
			children:{}
		}
		const rendering_result = rendering_factory(content, rendering_context, undefined)
		
		rendering_result.assets_urls_templates = content.settings.assets_urls_templates

		return rendering_result.convert_to_json()
	}
}

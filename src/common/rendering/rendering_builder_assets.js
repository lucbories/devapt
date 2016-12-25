// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import Loggable from '../base/loggable'


const context = 'common/rendering/rendering_builder'



/**
 * Rendering wrapper class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RenderingBuilderAssets extends Loggable
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
		
		this.set_assets_services_names(arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html)
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
}


import T from 'typr'
import assert from 'assert'
// import path from 'path'

import Loggable from '../base/loggable'
import runtime from '../base/runtime'
import RenderStack from './base/render_stack'
import RenderingManager from './base/rendering_manager'


const context = 'common/rendering/render'



/**
 * Rendering wrapper class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Render extends Loggable
{
    /**
     * Create a rendering wrapper class.
     */
	constructor(arg_assets_img, arg_assets_html, arg_assets_scripts)
	{
        super(context)
        
        this.is_render = true
        
		this.stack = new RenderStack()
        
        // const plugins = undefined
        const f6_plugin_path = runtime.context.get_rendering_plugin_path('backend-foundation6', 'plugin/rendering_plugin')
        const plugins = [f6_plugin_path]
        // const plugins = [ path.join(__dirname, '../../plugins/backend-foundation6/plugin/rendering_plugin') ]
		this.rendering_manager = new RenderingManager(plugins)
        
        this.assets_images_service_name = arg_assets_img ? arg_assets_img : null
        this.assets_html_service_name = arg_assets_html ? arg_assets_html : null
        this.assets_scripts_service_name = arg_assets_scripts ? arg_assets_scripts : null
        this.assets_styles_service_name = arg_assets_scripts ? arg_assets_scripts : null
        
        this.assets_images_service_consumer = null
        this.assets_html_service_consumer = null
        this.assets_scripts_service_consumer = null
        this.assets_styles_service_consumer = null
	}
	
    
    /**
     * Get an url to server the given image asset.
     * @param {string} arg_url - image asset relative url.
     * @returns {string} absolute image asset url.
     */
    /*get_url_with_credentials(arg_url)
    {
        this.enter_group('get_url_with_credentials')
        
        // TODO: credentials
        const url = arg_url + '?username=demo&password=6c5ac7b4d3bd3311f033f971196cfa75'
        
        this.leave_group('get_url_with_credentials')
        return url
    }*/
	
    
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
     * @param {object} arg_consumer - service consumer.
     * @param {string} arg_svc_name - service name or null.
     * @param {string} arg_url - image asset relative url.
     * @returns {string} absolute image asset url.
     */
    get_assets_url(arg_consumer, arg_svc_name, arg_url)
    {
        this.enter_group('get_assets_url')
        
        console.log(typeof arg_url, 'arg_url', arg_url)
        assert( T.isString(arg_url), context + ':get_assets_url:bad url string for svc [' + arg_svc_name + '] for url [' + arg_url + ']')
        
        const has_consumer = T.isObject(arg_consumer) && arg_consumer.is_service_consumer
        if (! has_consumer)
        {
            assert( T.isString(arg_svc_name), context + ':get_assets_url:bad svc name string')
            
            const service = runtime.services.find_by_name(arg_svc_name)
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
        url = runtime.context.get_url_with_credentials(url)
        
        this.leave_group('get_assets_url')
        return url
    }
    
	
    /**
     * Move up to the rendered components stack.
     * @returns {object} the Render instance.
     */
	up()
	{
		this.stack.leave()
		return this
	}
	
	
    /**
     * Push a Component instance on the rendering stack.
     * @param {object} arg_component - Component instance.
     * @returns {object} this.
     */
	push(arg_component)
	{
		this.stack.enter(arg_component)
		return this
	}
	
	
    /**
     * Add a Component instance to the current component children and push it on the rendering stack.
     * @param {object} arg_component - Component instance.
     * @returns {object} this.
     */
	add(arg_component)
	{
		assert( T.isObject(arg_component) && arg_component.is_component, context + ':bad component object')
		
		this.current().add_child(arg_component)
		this.push(arg_component)
		
		return this
	}
	
	
    /**
     * Get the current Component instance.
     * @returns {object} current Component instance..
     */
	current()
	{
		return this.stack.current()
	}
	
	
    /**
     * Create a Page component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @returns {object} this.
     */
	page(arg_name, arg_settings)
	{
        arg_settings = arg_settings ? arg_settings : {}
        arg_settings.render = this
        
		let component = this.rendering_manager.create('Page', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Page component object')
		
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a Button component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	button(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Button', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Button component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a Tree component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	tree(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Tree', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Tree component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a HBox component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	hbox(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('HBox', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad HBox component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a VBox component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	vbox(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('VBox', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad VBox component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a List component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	list(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('List', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad List component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a Table component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	table(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Table', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Table component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a Script component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	script(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Script', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Script component object')
		
		this.current().add_child(component)
		this.push(component)
		// this.up()
		
		return this
	}
	
	
    /**
     * Render the rendering stack of componenents.
     * @returns {string} rendered HTML string.
     */
	render()
	{
		if (! this.current())
		{
			return null
		}
		
		console.log('render ' + (this.current().get_type()) )
		return this.current().render()
	}
}

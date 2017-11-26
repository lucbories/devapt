// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import FeaturesManager from './features_manager'



const context = 'server/plugins/rendering_manager'




/**
 * Rendering manager class for renderer plugins managing.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RenderingManager extends FeaturesManager
{
    /**
     * Create a RenderingManager instance
	 * @extends FeaturesManager
	 * @param {string|undefined} arg_log_context - optional.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
     * @returns {nothing}
     */
	constructor(arg_runtime, arg_log_context, arg_logger_manager)
	{
		super(arg_runtime, arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_rendering_manager = true
	}
	
	
	/**
	 * Test if plugin is valid.
	 * @param {Plugin} arg_plugin - plugin instance.
	 * @returns {boolean} - given plugin is valid for this manager.
	 */
	plugin_is_valid(arg_plugin)
	{
		return arg_plugin.is_rendering_plugin
	}
	
	
	
	/**
	 * Get all plugin public assets (CSS, JS, HTML...).
	 * @returns {object} - a map of assets: plugin name => type => public name => absolute file path
	 */
	get_public_assets()
	{
		let assets = {}
		this.registered_plugins.forEach(
			(plugin) => {
				assets[plugin.get_name()] = plugin.get_public_assets()
			}
		)
		return assets
	}
	
	
	/**
	 * Get all plugin public  assets.
	 * @param {string} arg_type - asset type: js, css, html...
	 * @returns {object} - a map of assets:public name => absolute file path
	 */
	get_public_assets_of_type(arg_type)
	{
		assert( T.isString(arg_type), context + ':get_public_assets_of_type:bad asset type string')
		arg_type = arg_type.toLocaleLowerCase()
		
		let assets = {}
		this.registered_plugins.forEach(
			(plugin) => {
				const plugin_assets = plugin.get_public_assets_of_type(arg_type)
				assets = Object.assign(assets, plugin_assets)
			}
		)
		
		return assets
	}
	
	
	/**
	 * Get all plugin public JS assets.
	 * @returns {object} - a map of assets:public name => absolute file path
	 */
	get_public_js_assets()
	{
		return this.get_public_assets_of_type('js')
	}
	
	
	/**
	 * Get all plugin public css assets.
	 * @returns {object} - a map of assets:public name => absolute file path
	 */
	get_public_css_assets()
	{
		return this.get_public_assets_of_type('css')
	}
	
	
	/**
	 * Get all plugin public html assets.
	 * @returns {object} - a map of assets:public name => absolute file path
	 */
	get_public_html_assets()
	{
		return this.get_public_assets_of_type('html')
	}
}

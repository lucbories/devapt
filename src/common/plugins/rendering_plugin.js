
import T from 'typr'
import assert from 'assert'

import FeaturesPlugin from './features_plugin'


const context = 'common/plugins/rendering_plugin'



/**
 * Plugin class for renderers plugin.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RenderingPlugin extends FeaturesPlugin
{
    /**
     * Create a rendering Plugin instance.
	 * @extends Instance
	 * @param {PluginsManager} arg_manager - plugins manager
	 * @param {string} arg_name - plugin name
	 * @param {string} arg_version - plugin version.
	 * @returns {nothing}
     */
	constructor(arg_manager, arg_name, arg_version)
	{
		super(arg_manager, arg_name, 'RenderingPlugin', { version: arg_version }, context)
		
		this.is_rendering_plugin = true
		
		/**
		 * A map of public assets as name : absolute file path.
		 * @protected
		 */
		this.public_assets = {
			css:{},
			js:{},
			html:{}
		}
	}
	
	
	/**
	 * Get all plugin public assets (CSS, JS, HTML...).
	 * @returns {object} - a map of assets: type => public name => absolute file path
	 */
	get_public_assets()
	{
		return this.public_assets
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
		return this.public_assets[arg_type] ? this.public_assets[arg_type] : {}
	}
	
	
	/**
	 * Get all plugin public JS assets.
	 * @returns {object} - a map of assets:public name => absolute file path
	 */
	get_public_js_assets()
	{
		return this.public_assets['js'] ? this.public_assets['js'] : {}
	}
	
	
	/**
	 * Get all plugin public css assets.
	 * @returns {object} - a map of assets:public name => absolute file path
	 */
	get_public_css_assets()
	{
		return this.public_assets['css'] ? this.public_assets['css'] : {}
	}
	
	
	/**
	 * Get all plugin public html assets.
	 * @returns {object} - a map of assets:public name => absolute file path
	 */
	get_public_html_assets()
	{
		return this.public_assets['html'] ? this.public_assets['html'] : {}
	}
	
	
	/**
	 * Add a public asset.
	 * @param {string} arg_type - asset type: js, css, html...
	 * @param {string} arg_name - asset public name (for url access).
	 * @param {string} arg_absolute_path - asset absolute path.
	 * @returns {nothing}
	 */
	add_public_asset(arg_type, arg_name, arg_absolute_path)
	{
		assert( T.isString(arg_type), context + ':add_public_asset:bad asset type string')
		assert( T.isString(arg_name), context + ':add_public_asset:bad asset name string')
		assert( T.isString(arg_absolute_path), context + ':add_public_asset:bad asset path string')
		
		arg_type = arg_type.toLocaleLowerCase()
		if ( ! T.isObject(this.public_assets[arg_type]) )
		{
			this.public_assets[arg_type] = {}
		}
		
		this.public_assets[arg_type][arg_name] = arg_absolute_path
	}
	
	
	/**
	 * Get a public asset by its name.
	 * @param {string} arg_name - asset public name (for url access).
	 * @returns {string|null} - absolute file path
	 */
	get_public_asset(arg_name)
	{
		const types = Object.keys(this.public_assets)
		for(let type of types)
		{
			if (arg_name in this.public_assets[type])
			{
				return this.public_assets[type][arg_name]
			}
		}
		return null
	}
}

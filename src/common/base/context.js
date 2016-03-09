
import T from 'typr'
import assert from 'assert'
import path from 'path'

import logs from '../utils/logs'


let context = 'common/base/context'



/**
 * Context class: provides contextual mathods (browser/server, locales, i18n).
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Context
{
    /**
     * Create a context instance.
     * @param {object} arg_runtime - current runtime.
     * @returns {nothing}
     */
	constructor(arg_runtime)
	{
		assert( T.isObject(arg_runtime) && arg_runtime.is_runtime, context + ':bad runtime object')
		this.is_context = true
		this.$runtime = arg_runtime
	}
    
    
	
	// *************************************************** FILE PATH ********************************************************
	
	/**
	 * Get project base directory, the root directory of the project.
	 * @returns {string} - absolute root directory path
	 */
	get_base_dir()
	{
		return this.$runtime ? this.$runtime.get_setting('base_dir') : null
	}
	
	
	/**
	 * Get absolute path of given relative path.
	 * @param {string} arg_relative_path1 - relative path 1
	 * @param {string} arg_relative_path2 - relative path 2
	 * @param {string} arg_relative_path3 - relative path 3
	 * @returns {string} - absolute path
	 */
	get_absolute_path(arg_relative_path1, arg_relative_path2, arg_relative_path3)
	{
		assert( T.isString(arg_relative_path1), context + 'get_absolute_path: bad base dir string')
		let base_dir = path.isAbsolute(arg_relative_path1) ? '' : this.get_base_dir()
		assert( T.isString(base_dir), context + 'get_absolute_path: bad base dir string')

		if ( T.isString(arg_relative_path2) )
		{
			if ( T.isString(arg_relative_path3) )
			{
				return path.join(base_dir, arg_relative_path1, arg_relative_path2, arg_relative_path3)
			}

			return path.join(base_dir, arg_relative_path1, arg_relative_path2)
		}

		return path.join(base_dir, arg_relative_path1)
	}
	
	
	/**
	 * Get absolute path of given relative plugin name.
	 * @param {string} arg_relative_plugin - plugin name
	 * @param {string} arg_relative_path1 - relative path 1
	 * @param {string} arg_relative_path2 - relative path 2
	 * @returns {string} - absolute path
	 */
	get_absolute_plugin_path(arg_relative_plugin, arg_relative_path1, arg_relative_path2)
	{
		assert( T.isString(arg_relative_plugin), context + 'get_absolute_plugin_path: bad plugin name string')
		if ( path.isAbsolute(arg_relative_plugin) )
		{
			return this.get_absolute_path(arg_relative_plugin, arg_relative_path1, arg_relative_path2)
		}
		return this.get_absolute_path('plugins', arg_relative_plugin, arg_relative_path1, arg_relative_path2)
	}
	
	
	/**
	 * Get absolute path of given relative resource file.
	 * @param {string} arg_relative_resource - resource file name
	 * @param {string} arg_relative_path1 - relative path 1
	 * @param {string} arg_relative_path2 - relative path 2
	 * @returns {string} - absolute path
	 */
	get_absolute_resources_path(arg_relative_resource, arg_relative_path1, arg_relative_path2)
	{
		assert( T.isString(arg_relative_resource), context + 'get_absolute_resources_path: bad resource file string')
		return this.get_absolute_path('resources', arg_relative_resource, arg_relative_path1, arg_relative_path2)
	}
	
	
	
	// *************************************************** URL ********************************************************
	
    /**
     * Get an url to server the given image asset.
     * @param {string} arg_url - image asset relative url.
     * @returns {string} absolute image asset url.
     */
	get_url_with_credentials(arg_url)
	{
		// logs.debug('get_url_with_credentials')

		// TODO: credentials
		const url = arg_url + '?username=demo&password=6c5ac7b4d3bd3311f033f971196cfa75'
		
		return url
	}
    
    
    /**
     * ...
     * @param {ostring} arg_url - url
     * @returns {string} - partial URL
     */
	get_relative_url(arg_url)
    {
		return arg_url
	}
    
    
	get_absolute_url(arg_url)
	{
		return arg_url
	}


	get_absolute_plugin_url(arg_plugin)
	{
		return arg_plugin
	}
}
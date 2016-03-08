
import T from 'typr'
import assert from 'assert'



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
        return runtime ? runtime.get_setting('base_dir') : null
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
		const base_dir = this.get_base_dir()
		assert( T.isString(base_dir), context + 'get_absolute_path: bad base dir string')
		assert( T.isString(arg_relative_path1), context + 'get_absolute_path: bad base dir string')
        
		if ( T.isString(arg_relative_path2) )
		{
			if ( T.isString(arg_relative_path3) )
			{
				return path.join(base_dir, arg_relative_path1, arg_relative_path2, , arg_relative_path3)
			}
			
			return path.join(base_dir, arg_relative_path1, arg_relative_path2)
		}
		
		return path.join(base_dir, arg_relative_path1)
    }
	
    
	
	// *************************************************** URL ********************************************************
	
    /**
     * Get an url to server the given image asset.
     * @param {string} arg_url - image asset relative url.
     * @returns {string} absolute image asset url.
     */
    get_url_with_credentials(arg_url)
    {
        logs.debug('get_url_with_credentials')
        
        // TODO: credentials
        const url = arg_url + '?username=demo&password=6c5ac7b4d3bd3311f033f971196cfa75'
        
        this.leave_group('get_url_with_credentials')
        return url
    }
    
    
    /**
     * Enable a plugin.
     * @abstract
     * @param {object|undefined} arg_context - optional contextual map
     * @returns {object} - a promise object of a boolean result (success:true, failure:false)
     */
    get_relative_url(arg_url)
    {
        this.$runtime
    }
    
    
    get_absolute_url(arg_url)
    {
        this.$runtime
    }
    
    get_absolute_plugin_path
    get_absolute_plugin_url
}
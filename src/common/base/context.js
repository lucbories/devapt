// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import mustache from 'mustache'
import forge from 'node-forge'


let context = 'common/base/context'



/**
 * @file Context class: provides contextual mathods (browser/server, locales, i18n).
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
		assert( T.isObject(arg_runtime) && arg_runtime.is_server_runtime, context + ':bad runtime object')
		this.is_context = true
		this.$runtime = arg_runtime
	}
    
    
	
	// *************************************************** FILE PATH ********************************************************
	
	/**
	 * Get project base directory, the root directory of the project.
	 * 
	 * @returns {string} - absolute root directory path.
	 */
	get_base_dir()
	{
		return this.$runtime ? this.$runtime.get_setting('base_dir') : null
	}



	/**
	 * Get topology  world resources directory, by default: the root directory of the project.
	 * 
	 * @returns {string} - absolute root directory path.
	 */
	get_world_dir()
	{
		return this.$runtime ? this.$runtime.get_setting('world_dir') : this.get_base_dir()
	}
	

	
	/**
	 * Get absolute path of given relative path.
	 * 
	 * @param {string} arg_relative_path1 - relative path 1.
	 * @param {string} arg_relative_path2 - relative path 2.
	 * @param {string} arg_relative_path3 - relative path 3.
	 * 
	 * @returns {string} - absolute path.
	 */
	get_absolute_path(arg_relative_path1, arg_relative_path2, arg_relative_path3)
	{
		assert( T.isString(arg_relative_path1), context + ':get_absolute_path: bad paths strings')
		let base_dir = path.isAbsolute(arg_relative_path1) ? '' : this.get_base_dir()
		assert( T.isString(base_dir), context + ':get_absolute_path: bad base dir string')

		// console.log(this.get_world_dir(), 'world_dir')

		let ext = undefined
		let p0 = undefined
		let p1 = undefined
		let p2 = undefined

		if ( T.isString(arg_relative_path2) )
		{
			if ( T.isString(arg_relative_path3) )
			{
				ext = path.extname(arg_relative_path3)
				p0 = path.join(arg_relative_path1, arg_relative_path2, arg_relative_path3)
				p1 = path.join(this.get_world_dir(), arg_relative_path1, arg_relative_path2, arg_relative_path3)
				p2 = path.join(base_dir, arg_relative_path1, arg_relative_path2, arg_relative_path3)
			}
			else
			{
				ext = path.extname(arg_relative_path2)
				p0 = path.join(arg_relative_path1, arg_relative_path2)
				p1 = path.join(this.get_world_dir(), arg_relative_path1, arg_relative_path2)
				p2 = path.join(base_dir, arg_relative_path1, arg_relative_path2)
			}
		}
		else
		{
			ext = path.extname(arg_relative_path1)
			p0 = arg_relative_path1
			p1 = path.join(this.get_world_dir(), arg_relative_path1)
			p2 = path.join(base_dir, arg_relative_path1)
		}
		
		if ( path.isAbsolute(p0) )
		{
			try
			{
				const fs_stat = fs.statSync(p0)
				if ( fs_stat.isFile() || fs_stat.isDirectory() )
				{
					// console.log(context + ':get_absolute_path:path found [%s] for [%s, %s, %s]', p0, arg_relative_path1, arg_relative_path2, arg_relative_path3)
					return p0
				}
			}
			catch(e) {}
		}

		if ( path.isAbsolute(p1) )
		{
			try
			{
				const fs_stat = fs.statSync(p1)
				if ( fs_stat.isFile() || fs_stat.isDirectory() )
				{
					// console.log(context + ':get_absolute_path:path found [%s] for [%s, %s, %s]', p1, arg_relative_path1, arg_relative_path2, arg_relative_path3)
					return p1
				}
			}
			catch(e) {}
		}

		if ( path.isAbsolute(p2) )
		{
			try
			{
				const fs_stat = fs.statSync(p2)
				if ( fs_stat.isFile() || fs_stat.isDirectory() )
				{
					// console.log(context + ':get_absolute_path:path found [%s] for [%s, %s, %s]', p2, arg_relative_path1, arg_relative_path2, arg_relative_path3)
					return p2
				}
			}
			catch(e) {}
		}

		
		if (! ext)
		{
			return this.get_absolute_path((arg_relative_path1 && ! arg_relative_path2) ? arg_relative_path1 + '.js' : arg_relative_path1, (arg_relative_path2 && ! arg_relative_path3) ? arg_relative_path2 + '.js' : arg_relative_path2, arg_relative_path3 ? arg_relative_path3 + '.js' : undefined)
		}

		console.error(context + ':get_absolute_path:path not found [%s, %s, %s] for [%s, %s, %s]', p0, p1, p2, arg_relative_path1, arg_relative_path2, arg_relative_path3)
		return undefined
	}
	
	

	/**
	 * Get absolute path of given relative plugin name.
	 * 
	 * @param {string} arg_relative_plugin - plugin name.
	 * @param {string} arg_relative_path1 - relative path 1.
	 * @param {string} arg_relative_path2 - relative path 2.
	 * 
	 * @returns {string} - absolute path.
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
	 * 
	 * @param {string} arg_relative_resource - resource file name.
	 * @param {string} arg_relative_path1 - relative path 1.
	 * @param {string} arg_relative_path2 - relative path 2.
	 * 
	 * @returns {string} - absolute path.
	 */
	get_absolute_resources_path(arg_relative_resource, arg_relative_path1, arg_relative_path2)
	{
		assert( T.isString(arg_relative_resource), context + 'get_absolute_resources_path: bad resource file string')
		return this.get_absolute_path('resources', arg_relative_resource, arg_relative_path1, arg_relative_path2)
	}
	
	
	

	// *************************************************** URL ********************************************************
	
    /**
     * Get credentials.
	 * 
     * @param {object} arg_request - request object.
	 * 
     * @returns {object} credentials plain object.
     */
	get_credentials(arg_request)
	{
		// logs.debug('get_credentials')

		const auth_mgr = this.$runtime ? this.$runtime.security().authentication() : null
		if (! auth_mgr)
		{
			return undefined
		}
		
		if ( ! arg_request )
		{
			return undefined
		}
		
		const credentials = auth_mgr.get_credentials(arg_request)
		return credentials
	}
	
	
	
    /**
     * Get credentials string.
	 * 
     * @param {object} arg_request - request object.
	 * 
     * @returns {string} credentials string.
     */
	get_credentials_string(arg_request)
	{
		// logs.debug('get_credentials_string')

		// TODO: credentials
		const auth_mgr = this.$runtime ? this.$runtime.security().authentication() : null
		if (! auth_mgr)
		{
			return undefined
		}
		
		if ( ! arg_request )
		{
			return undefined
		}
		
		const credentials = auth_mgr.get_credentials(arg_request)
		if (! credentials)
		{
			return ''
		}
		
		// TODO: use security token
		return 'username=' + credentials.username + '&password=' + credentials.password
	}
	
	
	
    /**
     * Get an url to server the given image asset.
	 * 
     * @param {string} arg_url - image asset relative url.
     * @param {object} arg_request - request object.
	 * 
     * @returns {string} absolute image asset url.
     */
	get_url_with_credentials(arg_url, arg_request)
	{
		// logs.debug('get_url_with_credentials')
		
		if ( ! arg_request )
		{
			return arg_url + '?{{credentials_url}}'
		}
		
		const credentials_str = this.get_credentials_string(arg_request)
		
		if (credentials_str)
		{
			return arg_url + '?' + credentials_str
		}
		
		return arg_url
	}
    
	
	
	/**
     * Render credentials template.
	 * 
     * @param {string} arg_html - template html string.
     * @param {object} arg_request - request object.
	 * 
     * @returns {string} rendered template.
     */
	render_credentials_template(arg_html, arg_request)
	{
		let credentials_str = this.get_credentials_string(arg_request)
		let credentials_url = this.get_credentials_string(arg_request)
		let credentials_obj = this.get_credentials(arg_request)
		// console.log(credentials_str, 'credentials_str')
		
		
		// TODO 2 cases:
		/*
			url:string
			var:JSON.stringiy(object)
		*/
		
		
		
		if (credentials_str)
		{
			const base64_encoded = forge.util.encode64(credentials_obj.username + ':' + credentials_obj.password)

			const credentials_datas = {
				credentials_str:credentials_str,
				credentials_url:credentials_url,
				credentials_username:credentials_obj.username,
				credentials_password:credentials_obj.password,
				credentials_token:credentials_obj.token,
				credentials_expire:credentials_obj.expire,
				credentials_basic_base64:base64_encoded
				// credentials_obj: `{ \"username\":\"${credentials_obj.username}\", "password":"${credentials_obj.password}" }`
			}
			return mustache.render(arg_html, credentials_datas)
		}
		
		return arg_html
	}
	
	
    
	// TODO:TO CLEAN OR IMPLEMENT
	// get_relative_url(arg_url)
    // {
	// 	return arg_url
	// }
    
    
	// get_absolute_url(arg_url)
	// {
	// 	return arg_url
	// }


	// get_absolute_plugin_url(arg_plugin)
	// {
	// 	return arg_plugin
	// }
}
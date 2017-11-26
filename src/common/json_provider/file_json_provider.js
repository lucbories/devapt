// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Context from '../base/context'
import JsonProvider from './json_provider'
import { SOURCE_LOCAL_FILE } from './json_provider_sources'


const context = 'common/json_provider/file_json_provider'



/**
 * Json providier class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class FileJsonProvider extends JsonProvider
{
    /**
     * Create a FileJsonProvider instance.
	 * 
	 * @param {object} arg_settings - provider settings.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_settings)
    {
		super(arg_settings)
	}
    
    
    
    /**
     * Provide JSON datas inside a promise.
	 * 
     * @param {function} resolve - a promise should be resolved.
     * @param {function} reject - a promise should be rejected.
	 * 
     * @returns {nothing}
     */
	provide_json_self(resolve, reject)
	{
		assert( this.source == SOURCE_LOCAL_FILE, context + ':provide_json_self:bad source')
		assert( T.isString(this.$settings.relative_path), context + ':provide_json_self:bad settings.relative_path string')

		const file_path = this.$settings.relative_path
		const absolute_file_path = new Context(this.$settings.runtime).get_absolute_path(file_path)
		const json = require(absolute_file_path)
		
		if ( T.isObject(json) )
		{
			resolve(json)
			return
		}

		reject('bad json result for absolute file path [' + absolute_file_path + ']')
	}
}

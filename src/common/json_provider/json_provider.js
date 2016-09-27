// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import SOURCES from './json_provider_sources'


const context = 'common/json_provider/json_provider'



/**
 * Json providier class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class JsonProvider
{
    /**
     * Create a Json Provider instance.
	 * @abstract
	 * 
	 * @param {object} arg_settings - provider settings.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_settings)
    {
		// CHECK SETTINGS
		assert( T.isObject(arg_settings), context + ':bad settings object')
		if ( T.isFunction(arg_settings.toJS) )
		{
			arg_settings = arg_settings.toJS()
		}
		this.$settings = arg_settings

		// GET PROVIDER SOURCE
		assert( T.isString(this.$settings.source), context + ':bad settings.source string')
		this.source = this.$settings.source
		assert( SOURCES.indexOf(this.source) > -1, context + ':bad source string, should be part of [' + SOURCES + ']')
	}
    
    

    /**
     * Provide JSON datas.
	 * 
     * @returns {object} JSON datas Promise
     */
	provide_json()
	{
		const self = this

		let promise = new Promise(
			function(resolve, reject)
			{
				try
				{
					self.provide_json_self(resolve, reject)
				}
				catch(e)
				{
					reject(e)
				}
			}
		)

		return promise
	}
    
    

    /**
     * Provide JSON datas inside a promise
	 * @abstract
	 * 
     * @param {function} resolve - a promise should be resolved.
     * @param {function} reject - a promise should be rejected.
	 * 
     * @returns {nothing}
     */
	provide_json_self(resolve, reject)
	{
		reject(context + ':provide_json_self:should be implemented in sub classes.')
	}
}

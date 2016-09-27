// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import FileJsonProvider from './file_json_provider'
import MasterJsonProvider from './master_json_provider'
import { SOURCE_LOCAL_FILE, SOURCE_MASTER, SOURCE_MSG_BUS, SOURCE_REMOTE_URL,
	SOURCE_SQL_DATABASE, SOURCE_REDIS_DATABASE, SOURCE_MONGODB_DATABASE } from './json_provider_sources'


const context = 'common/json_provider/json_provider_factory'



/**
 * Json providier class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class JsonProviderFactory
{
    /**
     * Create JsonProviderFactory instance.
	 * 
	 * @returns {nothing}
     */
	constructor()
    {
	}
    
    
    /**
     * Create a JsonProvider instance.
	 * 
	 * @param {object} arg_settings - provider settings.
	 * 
     * @returns {object} JSON datas Promise
     */
	static create(arg_settings)
	{
		if ( T.isFunction(arg_settings.toJS) )
		{
			arg_settings = arg_settings.toJS()
		}
		assert( T.isObject(arg_settings), context + ':create:bad settings object')
		assert( T.isString(arg_settings.source), context + ':create:bad settings.source string')
		
		const source = arg_settings.source
		
		switch(source)
		{
			case SOURCE_LOCAL_FILE: return new FileJsonProvider(arg_settings)
			case SOURCE_MASTER:     return new MasterJsonProvider(arg_settings)
			
			case SOURCE_MSG_BUS:
			case SOURCE_REMOTE_URL:
			case SOURCE_SQL_DATABASE:
			case SOURCE_REDIS_DATABASE:
			case SOURCE_MONGODB_DATABASE:
			default:{
				console.error(context + ':bad provider source string [' + this.source + ']')
			}
		}

		return undefined
	}
}

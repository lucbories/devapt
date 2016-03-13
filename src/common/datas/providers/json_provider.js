
import T from 'typr'
import assert from 'assert'

import logs from '../../utils/logs'
import runtime from '../../base/runtime'



const context = 'common/datas/providers/provider'

export const SOURCE_LOCAL_FILE = 'local_file'
export const SOURCE_MSG_BUS = 'message_bus'
export const SOURCE_REMOTE_URL = 'remote_url'
export const SOURCE_SQL_DATABASE = 'sql_database'
export const SOURCE_NOSQL_DATABASE = 'nosql_database'

const SOURCES = [SOURCE_LOCAL_FILE, SOURCE_MSG_BUS, SOURCE_REMOTE_URL, SOURCE_SQL_DATABASE, SOURCE_NOSQL_DATABASE]



/**
 * Json providier class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class JsonProvider
{
    /**
     * Create a Provider instance
     */
	constructor(arg_settings)
    {
		// CHECK SETTINGS
		assert( T.isObject(arg_settings), context + ':bad settings object')
		this.$settings = arg_settings.toJS()

		// GET PROVIDER SOURCE
		assert( T.isString(this.$settings.source), context + ':bad settings.source string')
		this.source = this.$settings.source
		assert( SOURCES.indexOf(this.source) > -1, context + ':bad source string, should be part of [' + SOURCES + ']')
	}
    
    
    /**
     * Provide JSON datas
     * @returns {object} JSON datas Promise
     */
	provide_json()
	{
		const self = this
		logs.debug(context, 'enter')

		let promise = new Promise(
			function(resolve, reject)
			{
				self.provide_json_self(resolve, reject)
			}
		)

		logs.debug(context, 'leave')
		return promise
    }
    
    
    /**
     * Provide JSON datas inside a promise
     * @param {function} resolve - a promise should be resolved
     * @param {function} reject - a promise should be rejected
     * @returns {nothing}
     */
	provide_json_self(resolve, reject)
	{
		logs.debug(context + ':provide_json_self', this.source)

		switch(this.source)
		{
			case SOURCE_LOCAL_FILE:
			{
				assert( T.isString(this.$settings.relative_path), context + ':bad settings.relative_path string')

				const file_path = this.$settings.relative_path
				logs.debug('file_path', file_path)

				if ( T.isString(file_path) )
				{
					logs.debug('Node is master: load settings file', file_path)

					const absolute_file_path = runtime.get_absolute_path(file_path)
					const json = require(absolute_file_path)

					// console.log(context + '.json', json)

					logs.debug(context, 'leave')
					resolve(json)
					return
				}

				logs.debug('file_path', file_path)
				logs.error(context + ':bad file path string')
				break
			}
			
			case SOURCE_MSG_BUS:
			{

			}

			case SOURCE_REMOTE_URL:
			{

			}

			case SOURCE_SQL_DATABASE:
			{

			}

			case SOURCE_NOSQL_DATABASE:
			{

			}

			default:{
				logs.error(context + ':bad provider source string [' + this.source + ']')
			}
		}

		reject('bad source')
		logs.debug(context + ':leave')
	}
}

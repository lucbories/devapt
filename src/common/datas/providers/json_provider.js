// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import {is_browser, is_server} from '../../utils/is_browser'


const context = 'common/datas/providers/provider'



export const SOURCE_LOCAL_FILE = 'local_file'
export const SOURCE_MASTER = 'master'
export const SOURCE_MSG_BUS = 'message_bus'
export const SOURCE_REMOTE_URL = 'remote_url'
export const SOURCE_SQL_DATABASE = 'sql_database'
export const SOURCE_NOSQL_DATABASE = 'nosql_database'

const SOURCES = [SOURCE_LOCAL_FILE, SOURCE_MASTER, SOURCE_MSG_BUS, SOURCE_REMOTE_URL, SOURCE_SQL_DATABASE, SOURCE_NOSQL_DATABASE]



// GET RUNTIME
const server_runtime_file = '../../../server/base/runtime'
const browser_runtime_file = 'see window.devapt().runtime()'

let runtime = undefined

if (is_server())
{
	runtime = require(server_runtime_file).default
}

else if (is_browser())
{
	runtime = window.devapt().runtime()
}



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
		// logs.debug(context, 'enter')

		let promise = new Promise(
			function(resolve, reject)
			{
				self.provide_json_self(resolve, reject)
			}
		)

		// logs.debug(context, 'leave')
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
		// logs.debug(context + ':provide_json_self', this.source)

		switch(this.source)
		{
			case SOURCE_LOCAL_FILE: {
				assert( T.isString(this.$settings.relative_path), context + ':bad settings.relative_path string')

				const file_path = this.$settings.relative_path
				// logs.debug('file_path', file_path)

				if ( T.isString(file_path) )
				{
					// logs.debug('Node is master: load settings file', file_path)

					const absolute_file_path = runtime.context.get_absolute_path(file_path)
					const json = require(absolute_file_path)

					// console.log(context + '.json', json)

					// logs.debug(context, 'leave')
					resolve(json)
					return
				}

				// logs.debug('file_path', file_path)
				// logs.error(context + ':bad file path string')
				break
			}
			
			case SOURCE_MASTER: {
				console.log(context + ':provide_json_self:SOURCE_MASTER begin')
				const node = runtime.node
				const master_name = node.master_name
				assert( T.isString(master_name), context + ':provide_json_self:bad master name string')
				const delay = T.isNumber(this.$settings.delay) ? this.$settings.delay : 0

				// WAIT FOR BUS GATEWAY IS STARTED AND CONNECTED TO THE LOCAL BUS
				const do_cb = () => {
					node.on_registering_callback = resolve
					node.register_to_master()
					console.log(context + ':provide_json_self:SOURCE_MASTER end')
				}
				setTimeout(do_cb, delay)

				return
			}
			
			case SOURCE_MSG_BUS: {
				// TODO
				break
			}

			case SOURCE_REMOTE_URL: {
				// TODO
				break
			}

			case SOURCE_SQL_DATABASE: {
				// TODO
				break
			}

			case SOURCE_NOSQL_DATABASE: {
				// TODO
				break
			}

			default:{
				console.error(context + ':bad provider source string [' + this.source + ']')
			}
		}

		reject('bad source')
		// logs.debug(context + ':leave')
	}
}

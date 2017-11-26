// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import redis from 'redis'

// COMMON IMPORTS
import JsonProvider from './json_provider'
import { SOURCE_REDIS_DATABASE } from './json_provider_sources'


const context = 'common/json_provider/redis_json_provider'



/**
 * Redis Json provider class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class RedisJsonProvider extends JsonProvider
{
    /**
     * Create a RedisJsonProvider instance.
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
		assert( this.source == SOURCE_REDIS_DATABASE, context + ':provide_json_self:bad source')
		
		// CHECK SETTINGS VALUES
		assert( T.isString(this.$settings.host), context + ':provide_json_self:bad settings.host string')
		assert( T.isString(this.$settings.port), context + ':provide_json_self:bad settings.port string')
		assert( T.isString(this.$settings.db), context + ':provide_json_self:bad settings.db string')
		assert( T.isString(this.$settings.password), context + ':provide_json_self:bad settings.password string')
		assert( T.isString(this.$settings.json_key), context + ':provide_json_self:bad settings.json_key string')

		// GET SETTINGS VALUES
		const host_value = this.$settings.host
		const port_value = this.$settings.port
		const db_value = this.$settings.db
		const password_value = this.$settings.password
		const json_key = this.$settings.json_key

		// CONNECT TO REDIS
		const redis_options = {
			host:host_value,
			port:port_value,
			db:db_value,
			password:password_value,
			
			string_numbers:true,
			return_buffers:false
		}
		const retry_options = {
			retry_strategy: (options) => {
				if (options.error.code === 'ECONNREFUSED')
				{
					// End reconnecting on a specific error and flush all commands with a individual error
					reject('The server refused the connection')
					return
				}
				if (options.total_retry_time > 1000 * 60 * 60)
				{
					// End reconnecting after a specific timeout and flush all commands with a individual error
					reject('Retry time exhausted')
					return
				}
				if (options.times_connected > 10)
				{
					// End reconnecting with built in error
					return undefined
				}
				// reconnect after
				return Math.max(options.attempt * 100, 3000)
			}
		}
		this.client = redis.createClient(redis_options.attempt ? retry_options : redis_options)

		// HANDLE ERROR
		this.client.on("error",
			(err) => {
				reject(context + ':' + err)
				return
			}
		)

		// PROCESS REQUEST ON READY
		this.client.get(json_key,
			(err, reply) => {
				if (err)
				{
					reject(err)
					return
				}
				resolve(reply)
			}
		)

		this.client.quit()
	}
}

// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import NodeCache from 'node-cache' // https://www.npmjs.com/package/node-cache

// COMMON IMPORTS
import CacheAdapter from './cache_adapter'


// let context = 'common/cache/cache_adapter_node_cache'



/**
 * @file Cache adapter for node-cache.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class CacheAdapterNodecache extends CacheAdapter
{
	/**
	 * Create Cache instance to manage cached datas.
	 * 
	 * API:
	 * 		->constructor(arg_settings={ttl:5000, check_period:1000}) - time unit is milliseconds
	 * 
	 * 		->get(arg_key:string, arg_default):Promise
	 * 		->mget(arg_keys:array, arg_default:any|array):Promise
	 * 		->has(arg_key:string):Promise
	 * 		->set(arg_key:string, arg_value, arg_ttl=undefined):Promise
	 * 
	 * 		->set_ttl(arg_key:string, arg_ttl):Promise
	 * 		->get_ttl(arg_key:string):Promise
	 * 
	 * 		->get_keys():Promise
	 * 		->remove(arg_keys:string|array):Promise
	 * 
	 * 		->flush():nothing - delete all entries.
	 * 		->close():nothing - clear interval timeout for checks.
	 * 
	 * @param {object} arg_settings - cache engine settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings={ttl:5000, check_period:1000})
	{
		super(arg_settings)
		
		this.is_cache_adapter_node_cache = true

		const options = {stdTTL: 1, checkperiod: 5} // in seconds
		options.stdTTL = T.isNumber(arg_settings.ttl) ? arg_settings.ttl / 1000 : options.stdTTL
		options.checkperiod = T.isNumber(arg_settings.check_period) ? arg_settings.check_period / 1000 : options.checkperiod

		this.engine = new NodeCache(options)
	}



	/**
	 * Get a cached value.
	 * 
	 * @param {string} arg_key - key string to retrieve the value.
	 * @param {any} arg_default - returned default value if the key is not found (optional) (default:undefined).
	 * 
	 * @returns {Promise} - Promise of cached value or undefined.
	 */
	get(arg_key, arg_default=undefined)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.get(arg_key, (err, value)=> {
					if (err)
					{
						reject(err)
						return
					}
					if (value == undefined)
					{
						resolve(arg_default)
						return
					}
					resolve(value)
				})
			}
		)
		
		return promise
	}



	/**
	 * Get a cached value.
	 * 
	 * @param {array} arg_keys - key strings to retrieve the values.
	 * @param {any} arg_default - returned default value if the key is not found (optional) (default:undefined).
	 * 
	 * @returns {Promise} - Promise of cached value or undefined array.
	 */
	mget(arg_keys, arg_default=undefined)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.mget(arg_keys, (err, value)=> {
					if (err)
					{
						reject(err)
						return
					}
					if (value == undefined)
					{
						resolve(arg_default)
						return
					}
					resolve(value)
				})
			}
		)
		
		return promise
	}



	/**
	 * Test if given key has a cached value.
	 * 
	 * @param {string} arg_key - key string to retrieve the value.
	 * 
	 * @returns {Promise} - Promise of cached value or undefined.
	 */
	has(arg_key)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.get(arg_key, (err, value)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(value == undefined ? false : true)
				})
			}
		)
		
		return promise
	}



	/**
	 * Set a cached value with given key.
	 * 
	 * @param {string} arg_key - key string to retrieve the value.
	 * @param {any} arg_value - value to cache.
	 * @param {integer} arg_ttl - time to leave for cached value.
	 * 
	 * @returns {Promise} - Promise of nothing.
	 */
	set(arg_key, arg_value, arg_ttl=undefined)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.set(arg_key, arg_value, arg_ttl / 1000, (err, success)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(success)
				})
			}
		)
		
		return promise
	}



	/**
	 * Set cached value ttl.
	 * 
	 * @param {string} arg_key - key string to retrieve the value.
	 * @param {integer} arg_ttl - time to leave for cached value in milliseconds.
	 * 
	 * @returns {Promise} - Promise of nothing.
	 */
	set_ttl(arg_key, arg_ttl)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.ttl(arg_key, arg_ttl / 1000, (err, success)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(success)
				})
			}
		)
		
		return promise
	}



	/**
	 * Get cached value ttl.
	 * 
	 * @param {string} arg_key - key string to retrieve the value.
	 * 
	 * @returns {Promise} - Promise of integer|undefined:ttl in milliseconds.
	 */
	get_ttl(arg_key)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.getTtl(arg_key, (err, ttl)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(ttl * 1000)
				})
			}
		)
		
		return promise
	}



	/**
	 * Get cached keys.
	 * 
	 * @returns {Promise} - Promise of keys array.
	 */
	get_keys()
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.get_keys( (err, keys)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(keys)
				})
			}
		)
		
		return promise
	}



	/**
	 * Remove a cached value.
	 * 
	 * @param {string|array} arg_keys - value key string or array.
	 * 
	 * @returns {Promise} - Promise of undefined.
	 */
	remove(arg_keys)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.del(arg_keys, (err, success)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(success)
				})
			}
		)
		
		return promise
	}



	/**
	 * Flush all cached values (clear interval timeout for checks).
	 * 
	 * @returns {Promise} - Promise of undefined.
	 */
	flush()
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.flushAll()
				resolve()
			}
		)
		
		return promise
	}



	/**
	 * Close cache engine.
	 * 
	 * @returns {Promise} - Promise of undefined.
	 */
	close()
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.close()
				resolve()
			}
		)
		
		return promise
	}
}


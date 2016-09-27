// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import CacheManager from 'cache-manager' // https://www.npmjs.com/package/cache-manager

// COMMON IMPORTS
import CacheAdapter from './cache_adapter'


let context = 'common/cache/cache_adapter_cache_manager'


/*
node-cache-manager-redis

node-cache-manager-mongodb

node-cache-manager-mongoose

node-cache-manager-fs

node-cache-manager-fs-binary

node-cache-manager-hazelcast

node-cache-manager-memcached-store
*/



/**
 * @file Cache base class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class CacheAdapterCacheManager extends CacheAdapter
{
	/**
	 * Create Cache instance to manage cached datas.
	 * 
	 * API:
	 * 		->get(arg_key:string, arg_default):Promise
	 * 		->mget(arg_keys:array, arg_default:any|array):Promise
	 * 		->has(arg_key:string):Promise
	 * 		->set(arg_key:string, arg_value, arg_ttl=undefined):Promise
	 * 		->set_ttl(arg_key:string, arg_ttl):Promise
	 * 		->get_ttl(arg_key:string):Promise
	 * 		->get_keys():Promise
	 * 		->remove(arg_keys:string|array):Promise
	 * 		->flush():nothing - delete all entries.
	 * 		->close():nothing - clear interval timeout for checks.
	 * 
	 * @param {object} arg_settings - cache engine settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		super(arg_settings)
		
		this.is_cache_adapter_cache_manager = true

		const options = {ttl: 5} // seconds
		options.ttl = T.isNumber(arg_settings.ttl) ? arg_settings.ttl / 1000 : options.ttl

		this.engine_stores = []
		this.init_stores(arg_settings.stores)

		if ( this.engine_stores.length > 1 )
		{
			this.engine = CacheManager.multiCaching(this.engine_stores)
		} else if (this.engine_stores.length == 0)
		{
			this.engine = CacheManager.caching({store: 'memory', max: 100, ttl: options.ttl / 1000 /*seconds*/})
		} else if (this.engine_stores.length == 1)
		{
			this.engine = this.engine_stores[0]
		}
	}



	/**
	 * Create and configure cache stores.
	 * 
	 * @param {object} arg_stores_settings - stores settings.
	 * 
	 * @returns {nothing}
	 */
	init_stores(arg_stores_settings)
	{
		assert( T.isArray(arg_stores_settings), context + ':init_stores:bad stores settings array' )

		arg_stores_settings.forEach( (store_settings, index) => {
			assert( T.isObject(store_settings), context + ':init_stores:bad store settings object at index [' + index + ']' )
			
			const store_type = store_settings.type
			assert( T.isString(store_type), context + ':init_stores:bad store type string at index [' + index + ']' )

			let store = undefined
			switch(store_type) {
				case 'memory':
					{
						const cfg_ttl = store_settings.ttl ? store_settings.ttl / 1000 : 10
						const cfg_max = store_settings.max ? store_settings.max : 100

						store = CacheManager.caching({store: 'memory', max: cfg_max, ttl: cfg_ttl/*seconds*/})
						break
					}
				case 'memcached':
					{
						try {
							const memcachedStore = require('cache-manager-memcached-store')
							const cfg_host = store_settings.host ? store_settings.host : 'localhost'
							const cfg_port = store_settings.port ? store_settings.port : '11211'
							const cfg_options = store_settings.options ? store_settings.options : {}
							store = CacheManager.caching({
								store: memcachedStore,
								host: cfg_host,
								port: cfg_port,
								memcached: cfg_options
							})
						} catch(e)
						{
							console.error(context + ':init_stores:memcached error')
						}
						break
					}
				case 'redis':
					{
						try {
							const redisStore  = require('cache-manager-redis')
							const cfg_ttl = store_settings.ttl ? store_settings.ttl/1000 : 1
							const cfg_host = store_settings.host ? store_settings.host : 'localhost'
							const cfg_port = store_settings.port ? store_settings.port : '6379'
							const cfg_auth_path = store_settings.auth_path ? store_settings.auth_path : undefined
							const cfg_db = store_settings.db ? store_settings.db : undefined
							store = CacheManager.caching({
								store: redisStore ,
								host: cfg_host,
								port: cfg_port,
								auth_path: cfg_auth_path,
								db: cfg_db,
								ttl:cfg_ttl
							})
						} catch(e)
						{
							console.error(context + ':init_stores:memcached error')
						}
						break
					}
			}
			if (store)
			{
				this.engine_stores.push(store)
			}
		})
		
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
		if ( T.isString(arg_keys) )
		{
			return this.get(arg_keys, arg_default)
		}

		if ( ! T.isArray(arg_keys) )
		{
			return Promise.reject('bad keys array')
		}

		let promises = []
		this.arg_keys.forEach(
			(arg_key)=>{
				const promise = new Promise(
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
				promises.push(promise)
			}
		)
		
		return promises
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
		// let promise = new Promise(
		// 	(resolve, reject)=>{
		// 		this.engine.get(arg_key, (err, value)=> {
		// 			if (err)
		// 			{
		// 				reject(err)
		// 				return
		// 			}
		// 			resolve(value == undefined ? false : true)
		// 		})
				
		// 	}
		// )
		
		// return promise
		return this.engine.get(arg_key).then( (result)=>{ return (result == undefined ? false : true) } )
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
		arg_ttl = T.isNumber(arg_ttl) ? arg_ttl / 1000 : undefined
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.set(arg_key, arg_value, { ttl:arg_ttl }, (err, success)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(success ? true : false)
				})
			}
		)
		
		return promise
	}



	/**
	 * Set cached value ttl.
	 * 
	 * @param {string} arg_key - key string to retrieve the value.
	 * @param {integer} arg_ttl - time to leave for cached value.
	 * 
	 * @returns {Promise} - Promise of nothing.
	 */
	set_ttl(arg_key, arg_ttl)
	{
		if ( T.isNumber(arg_ttl) )
		{
			return this.get(arg_key).then( (value)=>{ this.set(arg_key, value, arg_ttl / 1000) } )
		}
	}



	/**
	 * Get cached value ttl.
	 * 
	 * @param {string} arg_key - key string to retrieve the value.
	 * 
	 * @returns {Promise} - Promise of integer|undefined.
	 */
	get_ttl(arg_key)
	{
		let promise = new Promise(
			(resolve, reject)=>{
				this.engine.ttl(arg_key, (err, value)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve(IDBCursorWithValue)
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
				this.engine.keys( (err, keys)=> {
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
		if ( T.isString(arg_keys) )
		{
			let promise = new Promise(
				(resolve, reject)=>{
					this.engine.del(arg_keys, (err, keys)=> {
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

		if ( ! T.isArray(arg_keys) )
		{
			return Promise.reject('bad keys string or array')
		}

		let promises = []
		this.arg_keys.forEach(
			(arg_key)=>{
				const promise = this.remove(arg_key)
				promises.push(promise)
			}
		)
		
		return promises
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
				this.engine.reset( (err, undefined)=> {
					if (err)
					{
						reject(err)
						return
					}
					resolve()
				})
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
		return this.flus()
	}
}


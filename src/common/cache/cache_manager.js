// NPM IMPORTS
import T from 'typr'
import assert from 'assert'


let context = 'common/cache/cache_manager'



/**
 * @file Cache manager class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class CacheManager
{
	/**
	 * Create Cache instance to manage cached datas.
	 * 
	 * API:
	 * 		get(arg_key:string, arg_default):Promise
	 * 		mget(arg_keys:array, arg_default:any|array):Promise
	 * 		has(arg_key:string):Promise
	 * 		set(arg_key:string, arg_value, arg_ttl=undefined):Promise
	 * 		set_ttl(arg_key:string, arg_ttl):Promise
	 * 		get_ttl(arg_key:string):Promise
	 * 		get_keys():Promise
	 * 		remove(arg_key:string|array):Promise
	 * 		flush():nothing - delete all entries.
	 * 		close():nothing - clear interval timeout for checks.
	 * 
	 * 		add_adapter(arg_cache_adapter):nothing - add a cache adapters.
	 * 
	 * @param {array} arg_cache_adapters - cache adapters.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_cache_adapters=[])
	{
		assert( T.isArray(arg_cache_adapters), context + ':constructor:bad cache adapters array')
		
		this.is_cache_manager = true
		this.cache_adapters = arg_cache_adapters
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
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve(arg_default)
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].get(arg_key, arg_default)
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				return adapter.get(arg_key, arg_default)
			}
		)
		return Promise.race(promises)
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
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve([arg_default])
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].mget(arg_keys, arg_default)
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.mget(arg_keys, arg_default) )
			}
		)
		return Promise.race(promises)
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
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve(false)
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].has(arg_key)
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.has(arg_key) )
			}
		)
		return Promise.race(promises)
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
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve()
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].set(arg_key, arg_value, arg_ttl)
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.set(arg_key, arg_value, arg_ttl) )
			}
		)
		return Promise.all(promises)
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
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve()
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].set_ttl(arg_key, arg_ttl)
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.set_ttl(arg_key, arg_ttl) )
			}
		)
		return Promise.all(promises)
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
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve()
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].get_ttl(arg_key)
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.get_ttl(arg_key) )
			}
		)
		return Promise.race(promises)
	}



	/**
	 * Get cached keys.
	 * 
	 * @returns {Promise} - Promise of keys array.
	 */
	get_keys()
	{
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve([])
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].get_keys()
		}
		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.get_keys() )
			}
		)
		return Promise.race(promises)
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
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve()
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].remove(arg_keys)
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.remove(arg_keys) )
			}
		)
		return Promise.all(promises)
	}



	/**
	 * Flush all cached values (clear interval timeout for checks).
	 * 
	 * @returns {Promise} - Promise of undefined.
	 */
	flush()
	{
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve()
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].flush()
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.flush() )
			}
		)
		return Promise.all(promises)
	}



	/**
	 * Close cache engine.
	 * 
	 * @returns {Promise} - Promise of undefined.
	 */
	close()
	{
		if (this.cache_adapters.length == 0)
		{
			return Promise.resolve()
		}
		if (this.cache_adapters.length == 1)
		{
			return this.cache_adapters[0].close()
		}

		let promises = []
		this.cache_adapters.forEach(
			(adapter)=>{
				promises.push( adapter.close() )
			}
		)
		return Promise.all(promises)
	}



	/**
	 * Add a cache adapter.
	 * 
	 * @param{DataCacheAdapter} arg_cache_adapter - cache adapter.
	 * 
	 * @returns {nothing}
	 */
	add_adapter(arg_cache_adapter)
	{
		assert( T.isObject(arg_cache_adapter) && arg_cache_adapter.is_cache_adapter, context + ':add_adapter:bad cache adapters array')

		this.cache_adapters.push(arg_cache_adapter)
	}
}


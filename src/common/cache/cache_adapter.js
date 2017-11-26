// NPM IMPORTS
import T from 'typr'
import assert from 'assert'


let context = 'common/cache/cache_adapter'



/**
 * @file CacheAdapter base class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class CacheAdapter
{
	/**
	 * Create CacheAdapter instance to manage cached datas.
	 * 
	 * API:
	 * 		->get(arg_key:string, arg_default):Promise - get a cached value with its key.
	 * 		->mget(arg_keys:array, arg_default:any|array):Promise - get cached values with their keys.
	 * 		->has(arg_key:string):Promise - testif a cached value exists with given key.
	 * 		->set(arg_key:string, arg_value, arg_ttl=undefined):Promise - set a cached value with its key and ttl.
	 * 		->set_ttl(arg_key:string, arg_ttl):Promise - set cached value ttl.
	 * 		->get_ttl(arg_key:string):Promise - get cached value ttl.
	 * 		->get_keys():Promise - get all cached values keys.
	 * 		->remove(arg_key:string|array):Promise - remove a cached value.
	 * 		->flush():nothing - delete all entries.
	 * 		->close():nothing - clear interval timeout for checks.
	 * 
	 * @param {object} arg_settings - cache engine settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':constructor:bad settigns object')

		this.is_cache_adapter = true
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
		return Promise.resolve(arg_default)
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
		return Promise.resolve(arg_default)
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
		return Promise.resolve(false)
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
		return Promise.resolve()
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
		return Promise.resolve()
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
		return Promise.resolve(undefined)
	}



	/**
	 * Get cached keys.
	 * 
	 * @returns {Promise} - Promise of keys array.
	 */
	get_keys()
	{
		return Promise.resolve([])
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
		return Promise.resolve()
	}



	/**
	 * Flush all cached values (clear interval timeout for checks).
	 * 
	 * @returns {Promise} - Promise of undefined.
	 */
	flush()
	{
		return Promise.resolve()
	}



	/**
	 * Close cache engine.
	 * 
	 * @returns {Promise} - Promise of undefined.
	 */
	close()
	{
		return Promise.resolve()
	}
}


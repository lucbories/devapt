/**
 * @file        core/cache.js
 * @desc        Devapt static cache features
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'jStorage'],
function(Devapt, DevaptTrace, DevaptTypes, jStorage)
{
	/**
	 * @memberof	DevaptCache
	 * @public
	 * @class
	 * @desc		Devapt cache features container
	 */
	var DevaptCache = function() {};
	
	
	/**
	 * @memberof	DevaptCache
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptCache.cache_trace = false;
	
	
	/**
	 * @memberof	DevaptCache
	 * @public
	 * @static
	 * @desc		Default TTL value
	 */
	DevaptCache.cache_default_ttl = 0; // 0 for Production, 5000 for DEV
	
	
	/**
	 * @memberof			DevaptCache
	 * @public
	 * @static
	 * @method				DevaptCache.get_from_cache(arg_key, arg_default)
	 * @desc				Get a value from cache
	 * @param {string}		arg_key			name of the value
	 * @param {mixed}		arg_default		default value
	 * @return {mixed}		Found value or default value
	 */
	DevaptCache.get_from_cache = function(arg_key, arg_default)
	{
		var context = 'DevaptCache.get(key,default)';
		DevaptTrace.trace_enter(context, '', DevaptCache.cache_trace);
		
		
		var value = $.jStorage.get(arg_key, arg_default);
		if (!value)
		{
			DevaptTrace.trace_leave(context, 'not found', DevaptCache.cache_trace);
			return false;
		}
		
		
		DevaptTrace.trace_leave(context, 'found', DevaptCache.cache_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptCache
	 * @public
	 * @static
	 * @method				DevaptCache.has_into_cache(arg_key)
	 * @desc				Test if a value is registered for a key into cache
	 * @param {string}		arg_key			name of the value
	 * @return {boolean}
	 */
	DevaptCache.has_into_cache = function(arg_key)
	{
		var context = 'DevaptCache.has_into_cache(key)';
		DevaptTrace.trace_enter(context, '', DevaptCache.cache_trace);
		
		var value = $.jStorage.get(arg_key, null);
		
		DevaptTrace.trace_leave(context, '', DevaptCache.cache_trace);
		return ! DevaptTypes.is_null(value);
	}
	
	
	/**
	 * @memberof			Libapt
	 * @public
	 * @static
	 * @method				DevaptCache.set_into_cache(arg_key, arg_value, arg_ttl)
	 * @desc				Register a value into cache
	 * @param {string}		arg_key			name of the value
	 * @param {mixed}		arg_value		value
	 * @param {integer}		arg_ttl			remaining TTL (in milliseconds) or 0 for no TTL
	 * @return {boolean}
	 */
	DevaptCache.set_into_cache = function(arg_key, arg_value, arg_ttl)
	{
		var context = 'DevaptCache.set_into_cache(key,value,ttl)';
		DevaptTrace.trace_enter(context, '', DevaptCache.cache_trace);
		
		
		var options = DevaptTypes.is_number(arg_ttl) ? { 'TTL': arg_ttl } : { 'TTL': DevaptCache.cache_default_ttl };
		var result = $.jStorage.set(arg_key, arg_value, options);
		if (!result)
		{
			DevaptTrace.trace_leave(context, 'failure', LibaptCache.cache_trace);
			return false;
		}
		
		
		DevaptTrace.trace_leave(context, '', DevaptCache.cache_trace);
		return true;
	}


	/**
	 * @memberof			DevaptCache
	 * @public
	 * @static
	 * @method				DevaptCache.set_ttl_into_cache(arg_key, arg_ttl)
	 * @desc				Set TTL of a cache record for a key
	 * @param {string}		arg_key			name of the value
	 * @param {integer}		arg_ttl			remaining TTL (in milliseconds) or 0 for no TTL
	 * @return {boolean}
	 */
	DevaptCache.set_ttl_into_cache = function(arg_key, arg_ttl)
	{
		var context = 'DevaptCache.set_ttl_into_cache(key,value,ttl)';
		DevaptTrace.trace_enter(context, '', DevaptCache.cache_trace);
		
		var result = $.jStorage.setTTL(arg_key, arg_ttl);
		
		DevaptTrace.trace_leave(context, '', DevaptCache.cache_trace);
		return result;
	}


	/**
	 * @memberof			DevaptCache
	 * @public
	 * @static
	 * @method				DevaptCache.delete_from_cache(arg_key)
	 * @desc				Delete a value from cache
	 * @param {string}		arg_key			name of the value
	 * @return {boolean}
	 */
	DevaptCache.delete_from_cache = function(arg_key)
	{
		var context = 'DevaptCache.delete_from_cache(key)';
		DevaptTrace.trace_enter(context, '', DevaptCache.cache_trace);
		
		var result = $.jStorage.deleteKey(arg_key);
		
		DevaptTrace.trace_leave(context, '', DevaptCache.cache_trace);
		return result;
	}
	
	return DevaptCache;
} );
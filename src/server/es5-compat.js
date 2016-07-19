

// POLYFILL FOR PROMISE
// FOR NODE 0.10
if (! Promise)
{
	// var Promise = require('es6-promise').Promise
	require('es6-promise').polyfill()
}



// POLYFILL FOR SYMBOL
// FOR NODE 0.10
if (! Symbol)
{
	var Symbol = require('es6-symbol')
	require('es6-symbol/implement')
}



// POLYFILL FOR PATH.ISABSOLUTE
// FOR NODE 0.10
var path = require('path')
if (typeof path.isAbsolute != 'function')
{
	var pathIsAbsolute = require('path-is-absolute')
	{
		path.isAbsolute = pathIsAbsolute
	}
}



// POLYFILL FOR ARRAY.FIND
// FOR NODE 0.10
if (!Array.prototype.find)
{
	Array.prototype.find = function(predicate)
	{
		if (this == null)
		{
			throw new TypeError('Array.prototype.find a été appelé sur null ou undefined');
		}
		if (typeof predicate !== 'function')
		{
			throw new TypeError('predicate doit être une fonction');
		}
		var list = Object(this)
		var length = list.length >>> 0
		var thisArg = arguments[1]
		var value

		for (var i = 0; i < length; i++)
		{
			value = list[i]
			if (predicate.call(thisArg, value, i, list))
			{
				return value
			}
		}
		return undefined
	}
}



// POLYFILL OBJECT.ASSIGN
// FOR NODE 0.10
if (typeof Object.assign != 'function')
{
	Object.assign = function(target) {
		'use strict'
		if (target == null)
		{
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target)
		for (var index = 1; index < arguments.length; index++)
		{
			var source = arguments[index]
			if (source != null)
			{
				for (var key in source)
				{
					if (Object.prototype.hasOwnProperty.call(source, key))
					{
						target[key] = source[key];
					}
				}
			}
		}
		return target
	}
}

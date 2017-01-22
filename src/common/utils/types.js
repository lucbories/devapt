
// Similar to typr module which has a problem with recent nodejs: lib-cov not found error.

var toStr = Object.prototype.toString
const types_fn = {}



const types = ['Function', 'Object', 'Date', 'Number', 'String', 'Boolean', 'RegExp', 'Arguments']
types.forEach(
	(type)=>{
		const expected = '[object ' + type + ']'
		types_fn['is' + type] = (o)=>{
			return toStr.call(o) === expected
		}
	}
)


types_fn.isNotEmptyString = (o)=>{
	return types_fn.isString(o) && o.length > 0
}


// DOM ELEMENT TEST
// For a tr element: "[object HTMLTableRowElement]"
types_fn.isElement = (o)=>{
	if (typeof o != 'object')
	{
		return false
	}
	const str = o.toString()
	return str.startsWith('[object HTML') && str.endsWith('Element]')
}


types_fn.isArray = Array.isArray
types_fn.isNaN = Number.isNaN
types_fn.isNumeric = Number.isFinite

types_fn.isInfinite = (n)=>{
	return Math.abs(n) === Infinity
}

types_fn.isNull = (o)=>{
	return o === null
}

types_fn.isUndefined = (o)=>{
	var undef
	return o === undef
}


export default types_fn


// NPM IMPORTS
import _ from 'lodash'

// COMMON IMPORTS
import T from './types'

const iterator_fn = (arg_value, arg_fn)=>{
	if ( T.isArray(arg_value) || T.isObject(arg_value) )
	{
		_.forEach(arg_value,
			(item, key)=>{
				const new_key = arg_fn(key)
				if (key != new_key)
				{
					delete arg_value[key]
					key = new_key
				}
				arg_value[key] = iterator_fn(item, arg_fn)
			}
		)

		return arg_value
	}

	return arg_fn(arg_value)
}

export default iterator_fn
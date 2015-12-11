import T from 'typr'


// RETURN DIFFERENT (KEYS PATH, VALUE) BETWEEN TWO JS CONFIG
const diff = function(config_1, config_2)
{
	if (! config_1)
	{
		return config_2 ? config_2 : null
	}
	
	if (! config_2)
	{
		return config_1 ? config_1 : null
	}
	
	if ( T.isObject(config_1) && ! T.isObject(config_2) )
	{
		return null
	}
	
	if ( ! T.isObject(config_1) && T.isObject(config_2) )
	{
		return null
	}
	
	if ( T.isArray(config_1) && ! T.isArray(config_2) )
	{
		return null
	}
	
	if ( ! T.isArray(config_1) && T.isArray(config_2) )
	{
		return null
	}
	
	let keys_1 = Object.keys(config_1)
	let keys_2 = Object.keys(config_2)
	
	// LOOP ON CONFIG 1
	keys_1.forEach(
		(key_1) => {
			let value_1 = config_1[key_1]
			if (keys_2.indexOf(key_1) < 0)
			{
				return value_1
			}
			
			let value_2 = config_2[key_1]
			if ( T.isObject(value_2) )
			{
				return diff(value_1, value_2)
			}
		}
	)
}

export default diff

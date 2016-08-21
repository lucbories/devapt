
import T from 'typr'
import assert from 'assert'
import Ramda from 'ramda'



const context = 'common/utils/transform'


const cursor_at_index = Ramda.lensIndex
// const cursor_at_key = Ramda.lensProp
const get = Ramda.view
const prop = Ramda.prop // f(field_name, value_to_query)
const prop_default = Ramda.propOr // f(default_value, field_name, value_to_query)
const deep_prop = Ramda.path // f(field_path, value_to_query)
// const clone = Ramda.clone
// const map = Ramda.map
const merge = Ramda.merge


/*
	FLAT
	
	Example:
		stream values: {
			target:'...',
			ts:'...',
			datas:[
				{level:'...', text:'...'},
				{level:'...', text:'...'},
				{level:'...', text:'...'}
			]
		}
	Attempded result: an array of {
			target:'...',
			timestamp:'...',
			level:'...',
			text:'...'
		}
	Transform object: {
		result_type:'array',
		flat_field_name:'datas'
		flat_fields:[
			{
				name:'level,
				flat_path:['datas'],
				path:['level']
			},
			{
				name:'text,
				flat_path:['datas'],
				path:['text']
			}
		],
		fields:[
			{
				name:'target,
				path:'target'
			},
			{
				name:'timestamp,
				path:'ts'
			}
		]
	}
*/



/**
 * Function to extract avalue from an object. 
 * @public
 * @param {object} arg_field_config - field configuration.
 * @returns {function} - transformation function : data_in (object) => datas_out (any)
 */
export const extract = (arg_field_config) => {
	// console.log(arg_field_config, context + ':extract:arg_field_config')
	assert( T.isObject(arg_field_config), context + ':flat:bad field object')
	
	const field_name = prop_default('unnamed field', 'name', arg_field_config)
	const field_path = prop_default(undefined, 'path', arg_field_config)
	const field_value = prop_default(undefined, 'value', arg_field_config)
	// console.log(field_name, context + ':extract:field_name')
	// console.log(field_path, context + ':extract:field_path')
	// console.log(field_value, context + ':extract:field_value')
	
	const field_validate = prop_default(undefined, 'validate', arg_field_config)
	let default_value = undefined
	let validate_method = (f) => f
	
	// DEFINE VALIDATION
	if ( T.isObject(field_validate) )
	{
		// DEFAULT VALUE
		if ( ! T.isUndefined(field_validate.default) )
		{
			default_value = field_validate.default
		}
		
		// CHECK TYPE
		if ( T.isString(field_validate.type) && field_validate.type.length > 3 )
		{
			const check_method_name = 'is' + field_validate.type[0].toUpperLocaleString() + field_validate.type.slice(1).toLowerLocaleString()
			if ( T.isFunction(T[check_method_name]) )
			{
				const check_method = T.isFunction(T[check_method_name])
				validate_method = (f) => {
					return (x) => {
						const v = f(x)
						if ( check_method(v) )
						{
							return v
						}
						return default_value
					}
				}
			}
		}
	}
	
	// XFORM = VALUE FROM NUMBER PATH
	if ( T.isNumber(field_path) )
	{
		const value_extractor = {
			name:field_name,
			extract:validate_method( get( cursor_at_index(field_path) ) )
		}
		return value_extractor
	}
	
	// XFORM = VALUE FROM STRING PATH
	if ( T.isString(field_path) )
	{
		const value_extractor = {
			name:field_name,
			extract:validate_method( prop(field_path) )
		}
		return value_extractor
	}
	
	// XFORM = VALUE FROM ARRAY PATH
	if ( T.isArray(field_path) )
	{
		const value_extractor = {
			name:field_name,
			extract:validate_method( deep_prop(field_path) )
		}
		return value_extractor
	}
	
	// XFORM = CONSTANT
	if (field_value)
	{
		const value_extractor = {
			name:field_name,
			extract:() => validate_method( field_value )
		}
		return value_extractor
	}
	
	// RETURN PROPERTY WITH KEY = NAME
	const value_extractor = {
		name:field_name,
		extract:validate_method( prop_default(default_value, field_name) )
	}
	
	return value_extractor
}



/**
 * Function to transform an object with an array attribute to a flat array. 
 * @public
 * @param {string} arg_array_name - array attribute name.
 * @param {array} arg_fields - unique fields to include into each output record.
 * @param {array} arg_flat_fields - fields of included array to pick into each output record.
 * @param {string} arg_results_type - output record type ('array' or 'object').
 * @returns {function} - transformation function : data_in (object) => datas_out (array of object|array)
 */
export const flat = (arg_array_name, arg_fields, arg_flat_fields, arg_results_type) => {
	assert( T.isString(arg_array_name), context + ':flat:bad array name')
	assert( T.isArray(arg_fields), context + ':flat:bad fields array')
	
	return (arg_value) => {
		if ( ! (arg_array_name in arg_value) )
		{
			return []
		}
		
		// INIT OUTPUT RESULTS
		let results = []
		
		// EXTRACT REPEATED VALUES
		let values_to_repeat_extractors = []
		arg_fields.forEach(
			(field) => {
				const field_extractor = extract(field)
				
				assert( T.isObject(field_extractor), context + ':flat:bad field extractor object')
				assert( T.isString(field_extractor.name), context + ':flat:bad field extractor name string')
				assert( T.isFunction(field_extractor.extract), context + ':flat:bad field extractor extract funcytion')
				
				values_to_repeat_extractors.push(field_extractor)
			}
		)
		let values_to_repeat = out(values_to_repeat_extractors, arg_results_type)(arg_value)
		
		// GET VALUES OF COLLECTION TO FLAT EXTRACTORS
		let flat_extractors = []
		arg_flat_fields.forEach(
			(field) => {
				const field_extractor = extract(field)
				
				assert( T.isObject(field_extractor), context + ':flat:bad flat field extractor object')
				assert( T.isString(field_extractor.name), context + ':flat:bad flat field extractor name string')
				assert( T.isFunction(field_extractor.extract), context + ':flat:bad flat field extractor extract funcytion')
				
				flat_extractors.push(field_extractor)
			}
		)
		let flat_extractors_out = out(flat_extractors, arg_results_type)
		
		// LOOP ON VALUES TO FLAT
		const array_to_flat = prop_default([], arg_array_name, arg_value)
		array_to_flat.forEach(
			(array_to_flat_item) => {
				let values_to_flat = flat_extractors_out(array_to_flat_item)
				
				const values = arg_results_type == 'object' ? merge(values_to_repeat, values_to_flat) : [].concat(values_to_repeat, values_to_flat)
				results.push(values)
			}
		)
		
		return results
	}
}



/**
 * Output
 * @public
 * @param {array} arg_extractors - fields extractors objects array with extractor:{ name:'...', extract:(any)=>(any) }).
 * @param {string} arg_results_type - output record type ('array' or 'object').
 * @returns {function} - transformation function : data_in (object|array) => datas_out (array or object)
 */
export const out = (arg_extractors, arg_results_type) => {
	const xform_array = (arg_stream_value) => {
		let result = []
		arg_extractors.forEach(
			(field_xform) => {
				result.push( field_xform.extract(arg_stream_value) )
			}
		)
		return result
	}
	
	const xform_object = (arg_stream_value) => {
		let result = {}
		arg_extractors.forEach(
			(field_xform) => {
				const field_name = field_xform.name
				result[field_name] = field_xform.extract(arg_stream_value)
			}
		)
		return result
	}
	
	
	let output_xformer = arg_stream_value => arg_stream_value
	if (arg_results_type == 'object')
	{
		output_xformer = xform_object
	}
	
	else if (arg_results_type == 'array')
	{
		output_xformer = xform_array
	}

	else if (arg_results_type == 'single' && arg_extractors.length == 1)
	{
		const field_xform = arg_extractors[0]
		output_xformer = (arg_stream_value) => {
			return field_xform.extract(arg_stream_value)
		}			
	}

	return output_xformer
}



/**
 * Function to transform a structured data to an other data regarding a transformation configuration. 
 * @public
 * @param {object} arg_xform - transformation definition.
 * @returns {function} - transformation function : data_in (object|array) => datas_out (array or object)
 */
export const transform = (arg_xform) => {
	assert( T.isObject(arg_xform), context + ':transform:bad xform object')
	
	const result_type = prop_default('array', 'result_type', arg_xform)
	const loop_on_keys = prop_default(undefined, 'loop_on_keys', arg_xform)
	const fields = prop_default([], 'fields', arg_xform)
	const flat_field_name = prop_default(undefined, 'flat_field_name', arg_xform)
	const flat_fields = prop_default(undefined, 'flat_fields', arg_xform)
	
	let extractors = []
	
	// WITH ARRAY TO FLAT
	if ( T.isString(flat_field_name) && T.isArray(flat_fields) )
	{
		return flat(flat_field_name,fields, flat_fields, result_type)
	}
	
	// WITHOUT ARRAY TO FLAT
	else
	{
		fields.forEach(
			(field) => {
				const value_extractor = extract(field)
				extractors.push(value_extractor)
			}
		)
	}
	
	// FORMAT OUTPUT
	const output_xformer = out(extractors, result_type)
	
	const output_extractor = (arg_value) => {
		if ( T.isObject(arg_value) )
		{
			const output_value = output_xformer(arg_value)
			// console.log(context + ':output_extractor:isObject:output_value', output_value)
			return output_value
		}
		
		if ( T.isArray(arg_value) )
		{
			let results = []
			arg_value.forEach(
				(value) => {
					const output_value = output_xformer(value)
					results.push(output_value)
				}
			)
			// console.log(context + ':output_extractor:isArray:results', results)
			return results
		}
		
		return undefined
	}
	
	if (loop_on_keys)
	{
		// console.log(context + ':loop_on_keys enabled')
		
		const loop_extractor = (arg_values) => {
			let results = []
			const keys = Object.keys(arg_values)
			
			// PROBLEM WITH NODEJS 0.10
			// for(let loop_key of keys)
			// {
			for(let loop_index = 0 ; loop_index < keys.length ; loop_index++)
			{
				const loop_key = keys[loop_index]
				// console.log(context + ':loop_on_keys:key', loop_key)
				const loop_value = arg_values[loop_key]
				const loop_extracted = output_extractor(loop_value)
				if (loop_extracted)
				{
					results.push(loop_extracted)
				}
			}
			
			return results
		}
		
		return loop_extractor
	}
	
	return output_extractor
}

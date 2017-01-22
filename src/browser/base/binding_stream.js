// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'
import { format } from 'util'

// COMMON IMPORTS
import uid from '../../common/utils/uid.js'
import { transform } from '../../common/utils/transform'


const context = 'browser/base/binding_stream'



/**
 * @file UI component binding class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class BindingStream
{
	/**
	 * Creates an instance of Binding for stream.
	 *
	 * @param {string} arg_id - binding identifier.
	 * @param {RuntimeBase} arg_runtime - client runtime.
	 * @param {Component} arg_component - component instance.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_id, arg_runtime, arg_component)
	{
		this.is_binding_stream = true

		this._id = arg_id ? arg_id : 'binding_' + uid()
		this._runtime = arg_runtime
		this._component = arg_component

		this._unsubscribe = undefined
		this._unsubscribe_state_update = undefined

		this._stream = undefined
		this._state_path = undefined
		this._starting_value = undefined
		this._source_svc_name = undefined
		this._source_svc_method = undefined
		this._source_xform = undefined
		this._source_timeline = undefined
		this._targets = undefined
		this._target_method = undefined
		this._options = undefined
	}


	
	set_stream(arg_stream)
	{
		this._stream = arg_stream
		return this
	}
	
	set_state_path(arg_state_path)
	{
		this._state_path = arg_state_path
		return this
	}
	
	set_starting_value(arg_starting_value)
	{
		this._starting_value = arg_starting_value
		return this
	}

	set_source_service_name(arg_source_svc_name)
	{
		this._source_svc_name = arg_source_svc_name
		return this
	}

	set_source_service_method(arg_source_svc_method)
	{
		this._source_svc_method = arg_source_svc_method
		return this
	}

	set_source_transformation(arg_transformation)
	{
		this._source_xform = arg_transformation
		return this
	}

	set_source_timeline_name(arg_source_timeline)
	{
		this._source_timeline = arg_source_timeline
		return this
	}

	set_targets_instances_array(arg_targets)
	{
		this._targets = arg_targets
		return this
	}

	set_target_method_name(arg_target_method)
	{
		this._target_method = arg_target_method
		return this
	}

	set_options(arg_options)
	{
		this._options = arg_options
		return this
	}
	

	
	/**
	 * Build binding.
	 * 
	 * @returns {Promise} 
	 */
	build()
	{
		// console.info(context + ':build:loading binding for component ' + this._component.get_name(), this._stream)
		
		this._component.enter_group('build')

		// CHECK ATTRIBUTES
		if ( T.isArray(this._stream) )
		{
			this._stream.forEach(
				(stream, index)=>{
					assert( T.isObject(stream) && stream.is_stream, context + format(':build:component=%s:bad stream object at index=%s', this._component.get_name(), index) )
				}
			)
		} else {
			assert( T.isObject(this._stream) && this._stream.is_stream, context + format(':build:component=%s:bad stream object', this._component.get_name()) )
		}
		assert( T.isArray(this._targets) && this._targets.length > 0, context + format(':build:component=%s,timeline=%s:bad targets',  this._component.get_name(), this._source_timeline, this._source_svc_method) )
		assert( T.isString(this._target_method),  context + format(':build:component=%s,timeline=%s:bad target method=%s',       this._component.get_name(), this._source_timeline, this._target_method) )
		
		const method_cfg = T.isObject(this._options) ? this._options.method  : undefined
		const operands   = T.isObject(method_cfg)    ? method_cfg.operands   : undefined
		const format_cfg = T.isObject(this._options) ? this._options.format  : undefined
		
		const unsubscribes = []
		this._targets.forEach(
			(target, index)=>{
				const stream = T.isArray(this._stream) ? (this._stream.length > index ? this._stream[index] : this._stream[this._stream.length - 1]) : this._stream
				const unbind = this.bind_stream(stream, this._source_xform, target, this._target_method, operands, format_cfg, this._starting_value)
				unsubscribes.push(unbind)
			}
		)

		this._unsubscribe =  ()=>{
			unsubscribes.forEach(
				(unsubscribe)=>{
					unsubscribe()
				}
			)
		}

		if ( T.isArray(this._state_path) && this._state_path.length > 0 )
		{
			const stream = T.isArray(this._stream) ? this._stream[0] : this._stream
			if (! T.isObject(stream) || ! stream.is_stream)
			{
				console.warn(context + ':build:bad state path stream for component %s', this._component.get_name(), this._stream, stream)
				return
			}
			this._unsubscribe_state_update = this.bind_stream(stream, this._source_xform, this._component, 'dispatch_update_state_value_action', [this._state_path])
		}

		this._component.leave_group('build:async')
		return Promise.resolve()
	}
	
	
	
	/**
	 * Bind a stream to a target object action.
	 * 
	 * @param {object}    arg_stream           - stream instance.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object}    arg_bound_object     - target object instance (optional: this as default).
	 * @param {string}    arg_bound_method     - target object method string.
	 * @param {anything}  arg_method_operands  - target object method operands (optional).
	 * @param {object}    arg_format_object    - formatting settings.
	 * @param {any}       arg_starting_value   - starting value.
	 * @param {object}    arg_options          - binding options.
	 * 
	 * @returns {function} - unsubscribe function.
	 */
	bind_stream(arg_stream, arg_values_xform, arg_bound_object, arg_bound_method, arg_method_operands, arg_format_object, arg_starting_value, arg_options)
	{
		// console.info(context + ':bind_stream:loading binding for component ' + this._component.get_name(), this._stream, arg_bound_object, this._source_timeline)
		
		let unbind_cb = undefined

		// SET TARGET OBJECT
		arg_bound_object = arg_bound_object ? arg_bound_object : this._component
		if ( T.isString(arg_bound_object) )
		{
			if ( T.isUndefined(arg_bound_method) )
			{
				arg_bound_method = arg_bound_object
				arg_bound_object = this._component
			} else if (arg_bound_object == 'this')
			{
				arg_bound_object = this._component
			}
			else
			{
				console.error(context + ':bind_stream:bad bound object string:%s', arg_bound_object)
				return undefined
			}
		}

		// TODO: DO NOT USE TYPR TO TEST DOM ELEMENTS
		// TYPR USE toString FUNCTION TO TEST TYPE against [object Object].
		// FOR OBJECT, toString give [object Object]
		// BUT DOM ELEMENTS toString GIVE [object HTMLXXXElement]
		assert( T.isObject(arg_stream) && arg_stream.is_stream, context + ':bind_stream:bad stream object')
		assert( T.isObject(arg_bound_object) || typeof arg_bound_object == 'object', context + ':bind_stream:bad bound object')
		assert( T.isString(arg_bound_method), context + ':bind_stream:bad bound method string')
		
		// CHECK OBJECT METHOD
		if ( ! (arg_bound_method in arg_bound_object) )
		{
			console.error(context + ':bind_stream:bad method [%s] for bound object=', arg_bound_method, arg_bound_object)
			return undefined
		}

		// DEBUG
		// arg_stream.get_transformed_stream().onValue(
		// 	(values) => {
		// 		console.log(context + ':bind_stream:on initial stream:%s:bound method=%s, bound object, values', this._component.get_name(), arg_bound_method, arg_bound_object, values)
		// 	}
		// )

		// SET FORMATTING FUNCTION
		let formatting_xform = undefined
		if ( T.isObject(arg_format_object) && T.isString(arg_format_object.type) )
		{
			formatting_xform = this.get_format_value_function(arg_format_object)
		}

		// SET XFORM FOR SIMPLE SETTINGS
		if ( T.isString(arg_values_xform) )
		{
			const field_name = arg_values_xform
			arg_values_xform = {
				"result_type":"single",
				"fields":[
					{
						"name":field_name,
						"path":field_name
					}
				]
			}
		}

		if ( T.isUndefined(arg_values_xform) || arg_values_xform == null )
		{
			let xform_stream = T.isFunction(formatting_xform) ? arg_stream.get_transformed_stream().map(formatting_xform) : arg_stream.get_transformed_stream()

			if ( ! T.isUndefined(arg_starting_value) )
			{
				xform_stream = xform_stream.startWith(arg_starting_value)
			}

			if (arg_method_operands)
			{
				unbind_cb = xform_stream.toProperty().assign(arg_bound_object, arg_bound_method, ...arg_method_operands)
			}
			else
			{
				unbind_cb = xform_stream.toProperty().assign(arg_bound_object, arg_bound_method)
			}
		}
		
		else if ( T.isFunction(arg_values_xform) )
		{
			let xform_stream = arg_stream.get_transformed_stream().map(arg_values_xform)
			xform_stream = T.isFunction(formatting_xform) ? xform_stream.map(formatting_xform) : xform_stream

			if ( ! T.isUndefined(arg_starting_value) )
			{
				xform_stream = xform_stream.startWith(arg_starting_value)
			}
			
			if (arg_method_operands)
			{
				unbind_cb = xform_stream.toProperty().assign(arg_bound_object, arg_bound_method, ...arg_method_operands)
			}
			else
			{
				unbind_cb = xform_stream.map(arg_values_xform).toProperty().assign(arg_bound_object, arg_bound_method)
			}
		}

		else if ( T.isObject(arg_values_xform) )
		{
			const datas_xform = (arg_stream_record) => {
				if (arg_stream_record.datas)
				{
					return arg_stream_record.datas
				}
				return arg_stream_record
			}

			let xform_stream = arg_stream.get_transformed_stream().map(datas_xform).map( transform(arg_values_xform) )
			
			// DEBUG
			// xform_stream.map(datas_xform).map( transform(arg_values_xform) ).onValue(
			// 	(values) => {
			// 		console.log(context + ':bind_stream:%s:on values_xform stream:bound method=%s, bound object, values', name, arg_bound_method, arg_bound_object, values)
			// 	}
			// )

			xform_stream = T.isFunction(formatting_xform) ? xform_stream.map(formatting_xform) : xform_stream
			
			if ( ! T.isUndefined(arg_starting_value) )
			{
				xform_stream = xform_stream.startWith(arg_starting_value)
			}

			if (arg_options && T.isBoolean(arg_options.dispatch) && arg_options.dispatch && T.isNumber(arg_options.index) && arg_options.index > 0 )
			{
				const at_index_xform = (arg_stream_record) => {
					if ( T.isArray(arg_stream_record) && arg_stream_record.length > arg_options.index )
					{
						return arg_stream_record[arg_options.index]
					}
					return undefined
				}

				xform_stream = xform_stream.map(at_index_xform)
			}

			// DEBUG
			// xform_stream.onValue(
			// 	(values) => {
			// 		console.log(context + ':bind_stream:on transformed stream:%s:bound method=%s, bound object, values', name, arg_bound_method, arg_bound_object, values)
			// 	}
			// )
			if (this._runtime.shoud_log_bindingd_stream())
			{
				const target = arg_bound_object && arg_bound_object.get_name ? arg_bound_object.get_name() : (arg_bound_object && arg_bound_object.attr ? arg_bound_object.attr('id') : (arg_bound_object && arg_bound_object.getAtttribute ? arg_bound_object.getAttribute('id') : 'unknow'))
				xform_stream.onValue(
					(values) => {
						const datas = T.isArray(values) ? 'array of length ' + values.length : (T.isObject(values) ? 'object of keys ' + Object.keys(values).toString() : 'datas')
						this._component.debug('bind_stream:on transformed stream:%s:target=%s,method=%s:values', name, target, arg_bound_method, datas)
					}
				)
			}

			if (arg_method_operands)
			{
				if ( T.isArray(arg_method_operands) )
				{
					unbind_cb = xform_stream.onValue(arg_bound_object, arg_bound_method, ...arg_method_operands)
				} else {
					unbind_cb = xform_stream.onValue(arg_bound_object, arg_bound_method, arg_method_operands)
				}
			}
			else
			{
				unbind_cb = xform_stream.onValue(arg_bound_object, arg_bound_method)
			}
		}
		else
		{
			assert(false, context + ':bind_svc:bad values paths string|array|function')
		}

		return unbind_cb
	}
	
	
	
	/**
	 * Get a formatting function or identity.
	 * Format settings example:
	 * 		{
	 * 			"type":"number",
	 * 			"digits":2
	 * 		}
	 * 
	 * @param {object} arg_format_object - format settings.
	 * 
	 * @returns {Function} - Formatting function or identity.
	 */
	get_format_value_function(arg_format_object)
	{
		if (! T.isObject(arg_format_object) || ! T.isString(arg_format_object.type) )
		{
			return (x) => x
		}

		switch(arg_format_object.type.toLocaleLowerCase()) {
			case 'number': {
				if ( T.isNumber(arg_format_object.digits) )
				{
					return (x) => {
						if (T.isNumber(x))
						{
							return x.toFixed(arg_format_object.digits)
						}
						return undefined
					}
				}
				return (x) => (T.isNumber(x) ? x : undefined)
			}
		}

		return (x) => x
	}
}

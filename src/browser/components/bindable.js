
import T from 'typr'
import assert from 'assert'

import Loggable from '../../common/base/loggable'
import { transform } from '../../common/utils/transform'


const context = 'browser/components/bindable'




/**
 * @file UI component base class for bindings.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Bindable extends Loggable
{
	
	/**
	 * Creates an instance of Bindable.
	 * @extends Loggable
	 * 
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(log_context, window.devapt().runtime().get_logger_manager())
		this.is_bindable = true
		
		if ( ! this.is_runtime )
		{
			this.update_trace_enabled()
		}
	}
	
	
	
	/**
	 * Bind a service stream event on object method.
	 * 
	 * @param {string} arg_svc_name - service name string.
	 * @param {string} arg_svc_method - service method string.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object} arg_bound_object - target object instance (optional: this as default).
	 * @param {string} arg_bound_method - target object method string.
	 * @param {object} arg_options - binding options.
	 * 
	 * @returns {nothing}
	 */
	bind_svc(arg_svc_name, arg_svc_method, arg_values_xform, arg_bound_object, arg_bound_method, arg_options)
	{
		assert( T.isString(arg_svc_name), context + ':bind_svc:bad service name string')
		assert( T.isString(arg_svc_method), context + ':bind_svc:bad service method string')
		
		// console.log(context + ':bind_svc:svc name=%s svc method=%s method=%s target=%o', arg_svc_name, arg_svc_method, arg_bound_method, arg_bound_object)
		
		this.runtime.register_service(arg_svc_name).then(
			(svc) => {
				// console.log(context + ':bind_svc:svc', svc)
				// var svc = this.runtime.service(arg_svc_name)
				assert( (arg_svc_method in svc) && T.isFunction(svc[arg_svc_method]), context + ':bind_svc:bad bound method function')
				
				if (arg_svc_method == 'post')
				{
					svc.subscribe()
				}
				
				const method_cfg = T.isObject(arg_options) ? arg_options.method : undefined
				const operands = T.isObject(method_cfg) ? method_cfg.operands : undefined
				const format = T.isObject(arg_options) ? arg_options.format : undefined

				const stream = svc[arg_svc_method](method_cfg)
				// stream.subscribe( (datas) => {console.log(datas) } )
				
				this.bind_stream(stream, arg_values_xform, arg_bound_object, arg_bound_method, operands, format)
			}
		)
	}
	
	
	
	/**
	 * Bind a service timeline stream event on object method.
	 * 
	 * @param {string} arg_svc_name - service name string.
	 * @param {string} arg_svc_method - service method string.
	 * @param {string} arg_timeline_name - timeline name.
	 * @param {array} arg_bound_objects - target object instance (optional: this as default).
	 * @param {string} arg_bound_method - target object method string.
	 * @param {object} arg_options - binding options.
	 * 
	 * @returns {nothing}
	 */
	bind_timeline(arg_svc_name, arg_svc_method, arg_timeline_name, arg_bound_objects, arg_bound_method, arg_options)
	{
		assert( T.isString(arg_svc_name), context + ':bind_timeline:bad service name string')
		assert( T.isString(arg_svc_method), context + ':bind_timeline:bad service method string')
		
		// console.log(context + ':bind_timeline:svc name=%s svc method=%s timeline=%s method=%s targets=%o', arg_svc_name, arg_svc_method, arg_timeline_name, arg_bound_method, arg_bound_objects)
		
		this.runtime.register_service(arg_svc_name).then(
			(svc) => {
				// console.log(context + ':bind_timeline:svc', svc)
				// var svc = this.runtime.service(arg_svc_name)
				assert( (arg_svc_method in svc) && T.isFunction(svc[arg_svc_method]), context + ':bind_timeline:bad bound method function')
				
				if (arg_svc_method == 'post')
				{
					svc.subscribe()
				}
				
				const method_cfg = T.isObject(arg_options) ? arg_options.method : undefined
				const operands = T.isObject(method_cfg) ? method_cfg.operands : undefined

				assert( arg_timeline_name in svc[arg_svc_method].timelines, context + ':bind_timeline:timeline name not found')
				assert( T.isObject( svc[arg_svc_method].timelines[arg_timeline_name] ), context + ':bind_timeline:bad timeline object')
				const stream = svc[arg_svc_method].timelines[arg_timeline_name].stream
				// stream.subscribe( (datas) => {console.log(context + ':bind_timeline:timeline=%s datas=', arg_timeline_name, datas) } )
				
				arg_bound_objects.forEach(
					(dom_jqo, index) => {
						const arg_values_xform = {
							"result_type":"single",
							"fields":[
								{
									"name":'value at ' + index,
									"path":'value'
								}
							]
						}
						// stream.onValue(
						// 	(value) => {
						// 		const extracted_value = transform(arg_values_xform)(value)
						// 		console.log(context + ':bind_timeline:timeline=%s extracted_value=', arg_timeline_name, extracted_value)
						// 	}
						// )
				
						// console.log(context + ':bind_timeline:timeline=%s index=%i dom_jqo=', arg_timeline_name, index, dom_jqo)

						const datas_xform = (arg_stream_record) => {
							if (arg_stream_record.datas)
							{
								// console.log(context + ':bind_stream:datas', arg_stream_record.datas)
								return arg_stream_record.datas
							}
							return arg_stream_record
						}

						let extracted_stream = stream.map(datas_xform).map( transform(arg_values_xform) )
						if (arg_options && T.isBoolean(arg_options.dispatch) && arg_options.dispatch)
						{
							const at_index_xform = (arg_stream_record) => {
								if ( T.isArray(arg_stream_record) && arg_stream_record.length > index )
								{
									return arg_stream_record[index]
								}
								return undefined
							}

							extracted_stream = stream.map(datas_xform).map( transform(arg_values_xform) ).map(at_index_xform)
						}
						
						// DEBUG
						// extracted_stream.onValue(
						// 	(extracted_value) => {
						// 		console.log(context + ':bind_timeline:timeline=%s extracted stream value=', arg_timeline_name, extracted_value)
						// 	}
						// )

						if (operands)
						{
							extracted_stream.onValue(dom_jqo, arg_bound_method, operands)
						}
						else
						{
							extracted_stream.onValue(dom_jqo, arg_bound_method)
						}
					}
				)
			}
		)
	}
	
	
	
	/**
	 * Bind a DOM event on an object method through a stream.
	 * 
	 * @param {string} arg_dom_selector - DOM selector string.
	 * @param {string} arg_dom_event - DOM event name string.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object} arg_bound_object - target object instance (optional: this as default).
	 * @param {string} arg_bound_method - target object method string.
	 * @param {object} arg_options - binding options.
	 * 
	 * @returns {nothing}
	 */
	bind_dom(arg_dom_selector, arg_dom_event, arg_values_xform, arg_bound_object, arg_bound_method, arg_options)
	{
		assert( T.isString(arg_dom_selector), context + ':bind_svc:bad DOM selector string')
		assert( T.isString(arg_dom_event), context + ':bind_svc:bad DOM event string')
		
		// console.log(context + ':bind_dom:dom_selector=%s dom_event=%s method=%s target=%o', arg_dom_selector, arg_dom_event, arg_bound_method, arg_bound_object)
		
		const method_cfg = T.isObject(arg_options) ? arg_options.method : undefined
		const operands = T.isObject(method_cfg) ? method_cfg.operands : undefined
		const format = T.isObject(arg_options) ? arg_options.format : undefined

		const stream = $(arg_dom_selector).asEventStream(arg_dom_event)
		// const stream = Bacon.fromEvent($(arg_dom_selector), arg_dom_event)
		
		this.bind_stream(stream, arg_values_xform, arg_bound_object, arg_bound_method, operands, format)
	}
	
	
	
	
	/**
	 * Bind a stream to a target object action.
	 * 
	 * @param {function} arg_stream - stream instance.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object} arg_bound_object - target object instance (optional: this as default).
	 * @param {string} arg_bound_method - target object method string.
	 * @param {anything} arg_method_operands - target object method operands (optional).
	 * @param {object} arg_format_object - formatting settings.
	 * 
	 * @returns {nothing}
	 */
	bind_stream(arg_stream, arg_values_xform, arg_bound_object, arg_bound_method, arg_method_operands, arg_format_object)
	{
		// SET TARGET OBJECT
		arg_bound_object = arg_bound_object ? arg_bound_object : this
		if ( T.isString(arg_bound_object) )
		{
			if ( T.isUndefined(arg_bound_method) )
			{
				arg_bound_method = arg_bound_object
				arg_bound_object = this
			} else if (arg_bound_object == 'this')
			{
				arg_bound_object = this
			}
			else
			{
				console.error(context + ':bad bound object string:%s', arg_bound_object)
			}
		}
		
		assert( T.isObject(arg_stream), context + ':bind_stream:bad stream object')
		assert( T.isObject(arg_bound_object), context + ':bind_stream:bad bound object')
		assert( T.isString(arg_bound_method), context + ':bind_stream:bad bound method string')
		
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
			const xform_stream = T.isFunction(formatting_xform) ? arg_stream.map(formatting_xform) : arg_stream

			if (arg_method_operands)
			{
				xform_stream.toProperty().assign(arg_bound_object, arg_bound_method, arg_method_operands)
			}
			else
			{
				xform_stream.toProperty().assign(arg_bound_object, arg_bound_method)
			}
		}
		
		else if ( T.isFunction(arg_values_xform) )
		{
			let xform_stream = arg_stream.map(arg_values_xform)
			xform_stream = T.isFunction(formatting_xform) ? xform_stream.map(formatting_xform) : xform_stream
			
			if (arg_method_operands)
			{
				xform_stream.toProperty().assign(arg_bound_object, arg_bound_method, arg_method_operands)
			}
			else
			{
				xform_stream.arg_stream.map(arg_values_xform).toProperty().assign(arg_bound_object, arg_bound_method)
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

			let xform_stream = arg_stream.map(datas_xform).map( transform(arg_values_xform) )
			xform_stream = T.isFunction(formatting_xform) ? xform_stream.map(formatting_xform) : xform_stream
			
			// DEBUG
			// s.onValue(
			// 	(values) => {
			// 		console.log(context + ':bind_stream:method=%s values=', arg_bound_method, values, arg_bound_object)
			// 		arg_bound_object[arg_bound_method](values)
			// 	}
			// )

			if (arg_method_operands)
			{
				xform_stream.onValue(arg_bound_object, arg_bound_method, arg_method_operands)
			}
			else
			{
				xform_stream.onValue(arg_bound_object, arg_bound_method)
			}
		}
		else
		{
			assert(false, context + ':bind_svc:bad values paths string|array|function')
		}
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

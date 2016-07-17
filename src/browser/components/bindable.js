
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
		
		this.runtime.register_service(arg_svc_name, {})
		
		var svc = this.runtime.service(arg_svc_name)
		assert( (arg_svc_method in svc) && T.isFunction(svc[arg_svc_method]), context + ':bind_svc:bad bound method function')
		
		if (arg_svc_method == 'post')
		{
			svc.subscribe()
		}
		
		const method_cfg = T.isObject(arg_options) ? arg_options.method : undefined
		// const operands = T.isObject(arg_options) ? arg_options.operands : undefined

		const stream = svc[arg_svc_method](method_cfg)
		// stream.subscribe( (datas) => {console.log(datas) } )
		
		this.bind_stream(stream, arg_values_xform, arg_bound_object, arg_bound_method)
	}
	
	
	
	/**
	 * Bind a DOM event on an object method through a stream.
	 * 
	 * @param {string} arg_dom_selector - DOM selector string.
	 * @param {string} arg_dom_event - DOM event name string.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object} arg_bound_object - target object instance (optional: this as default).
	 * @param {string} arg_bound_method - target object method string.
	 * @param {object} arg_options - binding options (unused).
	 * 
	 * @returns {nothing}
	 */
	bind_dom(arg_dom_selector, arg_dom_event, arg_values_xform, arg_bound_object, arg_bound_method/*, arg_options*/)
	{
		assert( T.isString(arg_dom_selector), context + ':bind_svc:bad DOM selector string')
		assert( T.isString(arg_dom_event), context + ':bind_svc:bad DOM event string')
		
		// console.log(context + ':bind_dom:dom_selector=%s dom_event=%s method=%s target=%o', arg_dom_selector, arg_dom_event, arg_bound_method, arg_bound_object)
		
		// const operands = T.isObject(arg_options) ? arg_options.operands : undefined
		const stream = $(arg_dom_selector).asEventStream(arg_dom_event)
		// const stream = Bacon.fromEvent($(arg_dom_selector), arg_dom_event)
		
		this.bind_stream(stream, arg_values_xform, arg_bound_object, arg_bound_method)
	}
	
	
	
	
	/**
	 * Bind a stream to a target object action.
	 * 
	 * @param {function} arg_stream - stream instance.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object} arg_bound_object - target object instance (optional: this as default).
	 * @param {string} arg_bound_method - target object method string.
	 * 
	 * @returns {nothing}
	 */
	bind_stream(arg_stream, arg_values_xform, arg_bound_object, arg_bound_method)
	{
		// console.log(arg_bound_operands, 'arg_bound_operands')
		
		arg_bound_object = arg_bound_object ? arg_bound_object : this
		if ( T.isString(arg_bound_object) && T.isUndefined(arg_bound_method) )
		{
			arg_bound_method = arg_bound_object
			arg_bound_object = this
		}
		
		assert( T.isObject(arg_stream), context + ':bind_stream:bad stream object')
		assert( T.isObject(arg_bound_object), context + ':bind_stream:bad bound object')
		assert( T.isString(arg_bound_method), context + ':bind_stream:bad bound method string')
		
		if ( T.isUndefined(arg_values_xform) || arg_values_xform == null )
		{
			arg_stream.toProperty().assign(arg_bound_object, arg_bound_method)
		}
		else if ( T.isString(arg_values_xform) )
		{
			arg_stream.map(arg_values_xform).toProperty().assign(arg_bound_object, arg_bound_method)
		}
		else if ( T.isFunction(arg_values_xform) )
		{
			arg_stream.map(arg_values_xform).toProperty().assign(arg_bound_object, arg_bound_method)
		}
		else if ( T.isObject(arg_values_xform) )
		{
			const datas_xform = (arg_stream_record) => {
				if (arg_stream_record.datas)
				{
					// console.log(context + ':bind_stream:datas', arg_stream_record.datas)
					return arg_stream_record.datas
				}
				return arg_stream_record
			}
			const s = arg_stream.map(datas_xform).map( transform(arg_values_xform) )
			// s.onValue(
			// 	(values) => {
			// 		console.log(context + ':bind_stream:values', values)
			// 		arg_bound_object[arg_bound_method](values)
			// 	}
			// )
			s.onValue(arg_bound_object, arg_bound_method)
		}
		else
		{
			assert(false, context + ':bind_svc:bad values paths string|array|function')
		}
	}
}

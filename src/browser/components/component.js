
import T from 'typr'
import assert from 'assert'


const context = 'browser/components/component'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Component
{
	
	/**
	 * Creates an instance of Component.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 */
	constructor(arg_runtime, arg_state)
	{
		this.is_component = true
		this.runtime = arg_runtime
		this.state = arg_state
	}
	
	
	
	/**
	 * Bind a service stream.
	 * 
	 * @param {string} arg_svc_name - service name string.
	 * @param {string} arg_svc_method - service method string.
	 * @param {string|array|function} arg_values_paths - values_paths.
	 * 
	 * @returns {nothing}
	 */
	bind_svc(arg_svc_name, arg_svc_method, arg_values_paths, arg_bound_object, arg_bound_method)
	{
		arg_bound_object = arg_bound_object ? arg_bound_object : this
		if ( T.isString(arg_bound_object) && T.isUndefined(arg_bound_method) )
		{
			arg_bound_method = arg_bound_object
			arg_bound_object = this
		}
		assert( T.isString(arg_svc_name), context + ':bind_svc:bad service name string')
		assert( T.isString(arg_svc_method), context + ':bind_svc:bad service method string')
		assert( ! T.isUndefined(arg_values_paths), context + ':bind_svc:bad values paths string|array|function')
		assert( T.isObject(arg_bound_object), context + ':bind_svc:bad bound object')
		assert( T.isString(arg_bound_method), context + ':bind_svc:bad bound method string')
		
		
		this.runtime.register_service(arg_svc_name, {})
		
		var svc = this.runtime.service(arg_svc_name)
		assert( (arg_svc_method in svc) && T.isFunction(svc[arg_svc_method]), context + ':bind_svc:bad bound method function')
		
		if (arg_svc_method == 'post')
		{
			svc.subscribe()
		}
		
		if ( T.isUndefined(arg_values_paths) )
		{
			svc[arg_svc_method]().toProperty().assign(arg_bound_object, arg_bound_method)
		}
		else if ( T.isString(arg_values_paths) )
		{
			svc[arg_svc_method]().map(arg_values_paths).toProperty().assign(arg_bound_object, arg_bound_method)
		}
		// else if ( T.isArray(arg_values_paths) )
		// {
		// 	svc[arg_svc_method]().map(arg_values_paths).toProperty().assign(arg_bound_object, arg_bound_method)
		// }
		else if ( T.isFunction(arg_values_paths) )
		{
			svc[arg_svc_method]().map(arg_values_paths).toProperty().	assign(arg_bound_object, arg_bound_method)
		}
		else
		{
			assert(false, context + ':bind_svc:bad values paths string|array|function')
		}
	}
}

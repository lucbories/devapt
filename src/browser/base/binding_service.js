// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'
import { format } from 'util'

// COMMON IMPORTS
import Stream from '../../common/messaging/stream'

// BROWSER IMPORTS
import BindingStream from './binding_stream'


const context = 'browser/base/binding_service_timeline'



/**
 * @file UI binding class for service stream.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class BindingServiceTimeline extends BindingStream
{
	/**
	 * Creates an instance of Binding.
	 * @extends Bindable
	 *
	 * @param {string} arg_id - binding identifier.
	 * @param {RuntimeBase} arg_runtime - client runtime.
	 * @param {Component} arg_component - component instance.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_id, arg_runtime, arg_component)
	{
		super(arg_id, arg_runtime, arg_component)

		this.is_binding_service = true
	}


	
	/**
	 * Build binding.
	 * 
	 * @returns {Promise} 
	 */
	build()
	{
		this._component.enter_group('build')

		// console.info(context + ':build:loading binding for component ' + this._component.get_name(), this._stream)
		
		assert( T.isString(this._source_svc_name),       context + format(':build:component=%s:bad service name=%s,timeline=%s', this._component.get_name(), this._source_timeline, this._source_svc_name) )
		assert( T.isString(this._source_svc_method),     context + format(':build:component=%s:bad service name=%s,timeline=%s', this._component.get_name(), this._source_timeline, this._source_svc_method) )
		assert( T.isArray(this._targets) && this._targets.length > 0, context + format(':build:component=%s,timeline=%s:bad targets',  this._component.get_name(), this._source_timeline, this._source_svc_method) )
		assert( T.isString(this._target_method),  context + format(':build:component=%s,timeline=%s:bad target method=%s',       this._component.get_name(), this._source_timeline, this._target_method) )
				
		const promise = this.bind_svc()
		
		// if ( T.isArray(this._state_path) && this._state_path.length > 0 )
		// {
		// 	const opds = { method:{ operands:[this._state_path]}}
		// 	this.set_targets_instances_array([this._component])
		// 	this.set_target_method_name('dispatch_update_state_value_action')
		// 	this.set_options(opds)
		// 	this._unsubscribe_state_update = this.bind_svc()
		// }

		this._component.leave_group('build:async')
		return promise
	}
	
	
	
	/**
	 * Bind a service stream event on object method.
	 * 
	 * @returns {Promise}
	 */
	bind_svc()
	{
		this._component.enter_group('bind_svc')

		// console.info(context + ':bind_svc:loading binding for component ' + this._component.get_name(), this._stream)
		
		const promise = this._runtime.register_service(this._source_svc_name).then(
			(svc) => {
				this._component.enter_group('bind_svc - service found')
				
				assert( (this._source_svc_method in svc) && T.isFunction(svc[this._source_svc_method]), context + ':bind_svc - service found:bad bound method function')
				
				if (this._source_svc_method == 'post')
				{
					svc.subscribe() // TODO ?????
				}
				
				const method_cfg = T.isObject(this._options) ? this._options.method  : undefined
				const stream = new Stream( svc[this._source_svc_method](method_cfg) )
				
				this.set_stream(stream)
				super.build()

				this._component.leave_group('bind_svc - service found')
			}
		)

		this._component.leave_group('bind_svc:async')
		return promise
	}
}

// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'
import { format } from 'util'

// COMMON IMPORTS
import { transform } from '../../common/utils/transform'
import Stream from '../../common/messaging/stream'

// BROWSER IMPORTS
import BindingStream from './binding_stream'


const context = 'browser/base/binding_service_timeline'



/**
 * @file UI binding class for service based timeline.
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

		this.is_binding_service_timeline = true
	}

	
	/**
	 * Build binding.
	 * 
	 * @returns {Promise} 
	 */
	build()
	{
		this._component.enter_group('build')

		console.info(context + ':build:loading binding for component ' + this._component.get_name(), this._stream)
		
		assert( T.isString(this._source_timeline),       context + format(':build:component=%s:bad timeline name=%s',            this._component.get_name(), this._source_timeline) )
		assert( T.isString(this._source_svc_name),       context + format(':build:component=%s:bad service name=%s,timeline=%s', this._component.get_name(), this._source_timeline, this._source_svc_name) )
		assert( T.isString(this._source_svc_method),     context + format(':build:component=%s:bad service name=%s,timeline=%s', this._component.get_name(), this._source_timeline, this._source_svc_method) )
		assert( T.isArray(this._targets) && this._targets.length > 0, context + format(':build:component=%s,timeline=%s:bad targets',  this._component.get_name(), this._source_timeline, this._source_svc_method) )
		assert( T.isString(this._target_method),         context + format(':build:component=%s,timeline=%s:bad target method=%s', this._component.get_name(), this._source_timeline, this._target_method) )
		
		let promise = this.bind_timeline()
		promise = promise.then(
			(unsubscribe)=>{
				this._unsubscribe = unsubscribe

				if ( T.isArray(this._state_path) && this._state_path.length > 0 )
				{
					const opds = { method:{ operands:[this._state_path]}}
					this.set_targets_instances_array([this._component])
					this.set_target_method_name('dispatch_update_state_value_action')
					this.set_options(opds)
					return this.bind_timeline().then(
						(unsubscribe)=>{
							this._unsubscribe_state_update = unsubscribe
						}
					)
				}
			}
		)
		
		this._component.leave_group('build:async')
		return promise
	}
	
	
	
	/**
	 * Bind a service timeline stream event on object method.
	 * 
	 * @returns {Promise}
	 */
	bind_timeline()
	{
		// console.info(context + ':bind_timeline:loading binding for component ' + this._component.get_name(), this._source_timeline)
		
		return this._runtime.register_service(this._source_svc_name).then(
			(svc) => {
				// console.log(context + ':bind_timeline:svc', svc)
				assert( (this._source_svc_method in svc) && T.isFunction(svc[this._source_svc_method]), context + ':bind_timeline:bad bound method function')
				
				if (this._source_svc_method == 'post')
				{
					svc.subscribe() // TODO ???????
				}
				
				const method_cfg = T.isObject(this._options) ? this._options.method : undefined
				const operands   = T.isObject(method_cfg) ? method_cfg.operands : undefined
				const format_cfg = T.isObject(this._options) ? this._options.format  : undefined

				assert( this._source_timeline in svc[this._source_svc_method].timelines, context + ':bind_timeline:timeline name [' + this._source_timeline + '] not found')
				assert( T.isObject( svc[this._source_svc_method].timelines[this._source_timeline] ), context + ':bind_timeline:bad timeline object')
				
				const stream = svc[this._source_svc_method].timelines[this._source_timeline].stream
				// stream.subscribe( (datas) => {console.log(context + ':bind_timeline:timeline=%s datas=', arg_timeline_name, datas) } )
				
				const unsubscribes = []
				this._targets.forEach(
					(target, index)=>{
						// const method = this._target_method
						// console.info(context + ':bind_timeline:component=%s timeline=%s target at %s method=%s', this._component.get_name(), this._source_timeline, index, method)
						
						const values_xform = {
							"result_type":"single",
							"fields":[
								{
									"name":'value at ' + index,
									"path":'value'
								}
							]
						}
						
						const datas_xform = (arg_stream_record) => {
							if (arg_stream_record.datas)
							{
								// console.log(context + ':bind_stream:datas', arg_stream_record.datas)
								return arg_stream_record.datas
							}
							return arg_stream_record
						}

						let extracted_stream = stream.map(datas_xform).map( transform(values_xform) )
						if (this._options && T.isBoolean(this._options.dispatch) && this._options.dispatch)
						{
							const at_index_xform = (arg_stream_record) => {
								if ( T.isArray(arg_stream_record) && arg_stream_record.length > index )
								{
									return arg_stream_record[index]
								}
								return undefined
							}

							extracted_stream = extracted_stream.map(at_index_xform)
						}

						// INIT STARTING VALUE
						this._stream = new Stream( extracted_stream.startWith(this._starting_value) )
						
						// DEBUG
						// this._stream.get_source_stream().onValue(
						// 	(extracted_value) => {
						// 		console.log(context + ':bind_timeline:timeline=%s method=%s stream value=', this._source_timeline, method, extracted_value)
						// 	}
						// )

						const unbind = this.bind_stream(this._stream, this._source_xform, target, this._target_method, operands, format_cfg, this._starting_value)
						unsubscribes.push(unbind)

						// if ( T.isArray(this._state_path) && this._state_path.length > 0 )
						// {
						// 	const opds = { method:{ operands:[this._state_path]}}
						// 	this._unsubscribe_state_update = this.bind_stream(this._stream, this._source_xform, [this._component], 'dispatch_update_state_value_action', opds)
						// }
					}
				)

				return ()=>{
					unsubscribes.forEach(
						(unsubscribe)=>{
							unsubscribe()
						}
					)
				}
			}
		)
	}
}

// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'
import { format } from 'util'

// COMMON IMPORTS
// import uid from '../../common/utils/uid.js'
// import { transform } from '../../common/utils/transform'
import Stream from '../../common/messaging/stream'

// BROWSER IMPORTS
import BindingStream from './binding_stream'
import BindingServiceTimeline from './binding_service_timeline'
import BindingService from './binding_service'


const context = 'browser/base/binding_Loader'



/**
 * @file UI component binding loader class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class BindingLoader
{
	/**
	 * Creates an instance of BindingLoader.
	 * 
	 * @returns {nothing}
	 */
	constructor()
	{
	}
	
	

	/**
	 * Load and apply a component binding configuration.
	 * 
	 * @param {string} arg_id - binding identifier.
	 * @param {RuntimeBase} arg_runtime - client runtime.
	 * @param {Component} arg_component - component instance.
	 * @param {Immutable.Map|undefined} arg_binding_cfg - component binding configuration.
	 * 
	 * @returns {BindingStream} 
	 */
	static load(arg_id, arg_runtime, arg_component, arg_binding_cfg)
	{
		// console.info(context + ':load:loading binding for component ' + arg_component.get_name(), arg_binding_cfg)
		
		// CHECK BINDING CONFIGURATION
		if (! T.isObject(arg_binding_cfg) )
		{
			return
		}
		
		// GET CONFIGURATION ATTRIBUTES
		const type = ('type' in arg_binding_cfg) ? arg_binding_cfg['type'] : undefined
		const state_path = ('state_path' in arg_binding_cfg) ? arg_binding_cfg['state_path'] : ['bindings_values', arg_id]
		const xform = ('transform' in arg_binding_cfg) ? arg_binding_cfg['transform'] : undefined
		const options = ('options' in arg_binding_cfg) ? arg_binding_cfg['options'] : undefined
		
		const source_svc_name   = ('service' in arg_binding_cfg) ? arg_binding_cfg['service'] : undefined
		const source_svc_method = ('method' in arg_binding_cfg) ? arg_binding_cfg['method'] : undefined
		const source_timeline   = ('timeline' in arg_binding_cfg) ? arg_binding_cfg['timeline'] : undefined
		const source_stream     = ('source_stream' in arg_binding_cfg) ? arg_binding_cfg['source_stream'] : undefined
		// const source_event      = ('event' in arg_binding_cfg) ? arg_binding_cfg['event'] : undefined
		
		const source_dom_selector = ('dom_selector' in arg_binding_cfg) ? arg_binding_cfg['dom_selector'] : undefined
		const source_dom_selectors = ('dom_selectors' in arg_binding_cfg) ? arg_binding_cfg['dom_selector'] : (source_dom_selector ? [source_dom_selector] : undefined)
		const source_dom_event = ('dom_event' in arg_binding_cfg) ? arg_binding_cfg['dom_event'] : undefined
		
		const target_view = ('target_view' in arg_binding_cfg) ? arg_binding_cfg['target_view'] : undefined
		const target_views = ('target_views' in arg_binding_cfg) ? arg_binding_cfg['target_views'] : (target_view ? [target_view] : undefined)
		
		const target_dom_selector = ('target_dom_selector' in arg_binding_cfg) ? arg_binding_cfg['target_dom_selector'] : undefined
		const target_dom_selectors = ('target_dom_selectors' in arg_binding_cfg) ? arg_binding_cfg['target_dom_selectors'] : (target_dom_selector ? [target_dom_selector] : undefined)
		
		const target_method = ('target_method' in arg_binding_cfg) ? arg_binding_cfg['target_method'] : undefined
		

		// NORMALIZE SOURCES
		let sources = []
		if ( T.isArray(source_dom_selectors) )
		{
			source_dom_selectors.forEach(
				(dom_selector)=>{
					if ( ! T.isString(dom_selector) )
					{
						console.warn(context + ':load:component=%s:bad binding source dom selector type=%s', arg_component.get_name(), typeof dom_selector)
						return
					}
					// console.log(context + ':load:component=%s:binding source dom selector=%s', arg_component.get_name(), dom_selector)

					
					if (type == 'emitter_dom')
					{
						sources.push(dom_selector)
						return
					}

					if (dom_selector == 'this')
					{
						// if (type == 'emitter_dom')
						// {
						// 	sources.push(arg_component)
						// 	return
						// }

						const jqo = $( '#' + arg_component.get_dom_id() )
						sources.push(jqo)
						return
					}

					const jqo = $(dom_selector)
					if (jqo && jqo.length > 0)
					{
						sources.push(jqo)
						return
					}

					console.warn(context + ':load:component=%s:bad binding source dom selector=%s', arg_component.get_name(), dom_selector)
				}
			)
		}
		


		// NORMALIZE TARGETS
		let targets = []
		if ( T.isArray(target_views) )
		{
			target_views.forEach(
				(view_name)=>{
					if ( ! T.isString(view_name) )
					{
						console.warn(context + ':load:component=%s:bad binding target view type=%s', arg_component.get_name(), typeof view_name)
						return
					}
					// console.log(context + ':load:component=%s:binding target view name=%s', arg_component.get_name(), view_name)

					if (view_name == 'this')
					{
						targets.push(arg_component)
						return
					}

					const target_object = arg_runtime._ui.get(view_name)
					if (target_object)
					{
						targets.push(target_object)
						return
					}

					console.warn(context + ':load:component=%s:bad binding target view=%s', arg_component.get_name(), view_name)
				}
			)
		}
		
		if ( T.isArray(target_dom_selectors) )
		{
			target_dom_selectors.forEach(
				(dom_selector)=>{
					if ( ! T.isString(dom_selector) )
					{
						console.warn(context + ':load:component=%s:bad binding target dom selector type=%s', arg_component.get_name(), typeof dom_selector)
						return
					}
					// console.log(context + ':load:component=%s:binding target dom selector=%s', arg_component.get_name(), dom_selector)

					if (dom_selector == 'this')
					{
						const jqo = $( '#' + arg_component.get_dom_id() )
						targets.push(jqo)
						return
					}

					const jqo = $(dom_selector)
					targets.push(jqo)
					if (jqo && jqo.length > 0)
					{
						return
					}

					console.warn(context + ':load:component=%s:bad binding target dom selector=%s', arg_component.get_name(), dom_selector)
				}
			)
		}


		// GET STARTING VALUE
		let starting_value = undefined
		if ( T.isArray(state_path) && state_path.length > 0 )
		{
			starting_value = arg_component.get_state_value(state_path, undefined)
			if (! starting_value)
			{
				starting_value = arg_runtime.get_state_store().get_state().getIn(state_path, undefined)
				if (starting_value && starting_value.toJS)
				{
					starting_value = starting_value.toJS()
				}
			}
		}


		// BIND SOURCES AND TARGETS
		// console.log(context + ':load:component=%s:binding type=%s', arg_component.get_name(), type)
		switch(type)
		{
			case 'timeline': {
				assert( T.isString(source_timeline),       context + format(':load:component=%s:bad timeline name=%s',            arg_component.get_name(), source_timeline) )
				assert( T.isString(source_svc_name),       context + format(':load:component=%s:bad service name=%s,timeline=%s', arg_component.get_name(), source_timeline, source_svc_name) )
				assert( T.isString(source_svc_method),     context + format(':load:component=%s:bad service name=%s,timeline=%s', arg_component.get_name(), source_timeline, source_svc_method) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s,timeline=%s:bad targets',  arg_component.get_name(), source_timeline, source_svc_method) )
				assert( T.isString(target_method),  context + format(':load:component=%s,timeline=%s:bad target method=%s',       arg_component.get_name(), source_timeline, target_method) )
				
				return new BindingServiceTimeline(arg_id, arg_runtime, arg_component)
					.set_state_path(state_path)
					.set_starting_value(starting_value)
					.set_source_service_name(source_svc_name)
					.set_source_service_method(source_svc_method)
					.set_source_timeline_name(source_timeline)
					.set_targets_instances_array(targets)
					.set_target_method_name(target_method)
					.set_options(options)
					.build()
			}

			case 'service': {
				assert( T.isString(source_svc_name),       context + format(':load:component=%s:bad service name=%s',  arg_component.get_name(), source_svc_name) )
				assert( T.isString(source_svc_method),     context + format(':load:component=%s:bad method name=%s',   arg_component.get_name(), source_svc_method) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s:bad targets',   arg_component.get_name()) )
				assert( T.isString(target_method),  context + format(':load:component=%s:bad target method=%s',        arg_component.get_name(), target_method) )

				return new BindingService(arg_id, arg_runtime, arg_component)
					.set_state_path(state_path)
					.set_starting_value(starting_value)
					.set_source_service_name(source_svc_name)
					.set_source_service_method(source_svc_method)
					.set_source_transformation(xform)
					.set_source_timeline_name(source_timeline)
					.set_targets_instances_array(targets)
					.set_target_method_name(target_method)
					.set_options(options)
					.build()
			}

			case 'emitter_jquery': {
				assert( T.isArray(sources),         context + format(':load:component=%s:bad sources array=%s',       arg_component.get_name()) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s:bad targets',  arg_component.get_name()) )
				assert( T.isString(source_dom_event),  context + format(':load:component=%s:bad source event=%s',     arg_component.get_name(), source_dom_event) )
				assert( T.isString(target_method),  context + format(':load:component=%s:bad target method=%s',       arg_component.get_name(), target_method) )
				
				const streams = []
				sources.forEach(
					(jqo)=>{
						const stream = new Stream( jqo.asEventStream(source_dom_event) )
						streams.push(stream)
					}
				)
				
				return new BindingStream(arg_id, arg_runtime, arg_component)
					.set_stream(streams)
					.set_state_path(state_path)
					.set_source_transformation(xform)
					.set_targets_instances_array(targets)
					.set_target_method_name(target_method)
					.set_options(options)
					.build()
			}

			case 'emitter_dom': {
				assert( T.isArray(sources),         context + format(':load:component=%s:bad sources array=%s',       arg_component.get_name()) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s:bad targets',  arg_component.get_name()) )
				assert( T.isString(source_dom_event),  context + format(':load:component=%s:bad source event=%s',     arg_component.get_name(), source_dom_event) )
				assert( T.isString(target_method),  context + format(':load:component=%s:bad target method=%s',       arg_component.get_name(), target_method) )
				
				const nodata = undefined
				const trace_enabled = true
				const streams = []
				sources.forEach(
					(dom_selector)=>{
						const stream = new Stream()
						const handler = (component, dom_event_name, dom_selector, dom_event, dom_event_target, arg_data)=>{
							const data = {
								component_name:component.get_name(),
								event_name:dom_event_name,
								dom_selector:dom_selector,
								target:dom_event_target,
								data:arg_data
							}
							stream.push(data)
						}
						arg_component.on_dom_event(source_dom_event, dom_selector, handler, nodata, trace_enabled)
						streams.push(stream)
					}
				)
				
				return new BindingStream(arg_id, arg_runtime, arg_component)
					.set_stream(streams)
					.set_state_path(state_path)
					.set_source_transformation(xform)
					.set_targets_instances_array(targets)
					.set_target_method_name(target_method)
					.set_options(options)
					.build()
			}

			case 'stream': {
				assert( T.isObject(source_stream) && source_stream.is_stream, context + format(':load:component=%s:bad source stream', arg_component.get_name()) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s:bad targets',  arg_component.get_name()) )
				// assert( T.isString(source_dom_event),  context + format(':load:component=%s:bad source event=%s',     arg_component.get_name(), source_dom_event) )
				assert( T.isString(target_method),  context + format(':load:component=%s:bad target method=%s',       arg_component.get_name(), target_method) )
				
				return new BindingStream(arg_id, arg_runtime, arg_component)
					.set_stream(source_stream)
					.set_state_path(state_path)
					.set_source_transformation(xform)
					.set_targets_instances_array(targets)
					.set_target_method_name(target_method)
					.set_options(options)
					.build()
			}

			// case 'stream': {
			// 	console.log(context + ':load:stream', source_stream)
			// 	assert( T.isObject(source_stream) && source_stream.is_stream, context + format(':load:component=%s:bad source stream', arg_component.get_name()) )
			// 	assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s:bad targets',  arg_component.get_name()) )
			// 	// assert( T.isString(source_event),  context + format(':load:component=%s:bad source event=%s',     arg_component.get_name(), source_dom_event) )
			// 	assert( T.isString(target_method),  context + format(':load:component=%s:bad target method=%s',       arg_component.get_name(), target_method) )
				
			// 	const method_cfg = T.isObject(options)    ? options.method  : undefined
			// 	const operands   = T.isObject(method_cfg) ? method_cfg.operands : undefined
			// 	const format_cfg = T.isObject(options)    ? options.format  : undefined
			// 	const stream     = source_stream.get_transformed_stream()
				
			// 	const unsubscribes = []
			// 	targets.forEach(
			// 		(target)=>{
			// 			const unsubscribe = this.bind_stream(stream, xform, target, target_method, options, format_cfg, undefined)
			// 			unsubscribes.push(unsubscribe)
			// 		}
			// 	)

			// 	this._unsubscribe = ()=>{
			// 		unsubscribes.forEach(
			// 			(unsubscribe)=>{
			// 				unsubscribe()
			// 			}
			// 		)
			// 	}

			// 	return
			// }
		}
	}
}

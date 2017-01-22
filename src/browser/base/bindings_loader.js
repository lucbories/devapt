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
	 * Normalize an array of objects selectors in an array of objects.
	 * @static
	 * 
	 * @param {RuntimeBase} arg_runtime - client runtime.
	 * @param {Component} arg_component - component instance.
	 * @param {array} arg_selectors - selectors strings array.
	 * @param {array|string} arg_dom_types - selectors strings array or single string (default "dom").
	 * 
	 * @returns {array} - objects|strings array.
	 */
	static normalize_objects(arg_runtime, arg_component, arg_selectors, arg_dom_types = 'dom')
	{
		arg_component.enter_group('normalize_objects')

		if ( ! T.isArray(arg_selectors) )
		{
			arg_component.leave_group('normalize_objects:bad selectors array')
			return []
		}

		const objects = []
		arg_selectors.forEach(
			(selector, index)=>{
				if ( ! T.isString(selector) )
				{
					console.warn('normalize_objects:component=%s:bad selector type=%s', arg_component.get_name(), typeof selector)
					return
				}

				// DEBUG
				// console.log(context + ':normalize_objects:component=%s:binding target dom selector=%s', arg_component.get_name(), dom_selector)

				const object_type = T.isString(arg_dom_types) ? arg_dom_types : ( T.isArray(arg_dom_types) && arg_dom_types.length > index ? arg_dom_types[index] : 'dom')

				if (object_type == 'view')
				{
					if (selector == 'this')
					{
						arg_component.debug('normalize_objects:view:this is found')
						objects.push( arg_component)
						return
					}

					arg_component.debug('normalize_objects:view:' + selector)
					const target_object = arg_runtime._ui.get(selector)
					if (target_object)
					{
						objects.push(target_object)
						return
					}

					console.warn(context + ':normalize_objects:component=%s:bad view selector=%s', arg_component.get_name(), selector)
					return
				}

				if (object_type == 'jquery')
				{
					if (selector == 'this')
					{
						arg_component.debug('normalize_objects:jquery:this is found')
						objects.push( $( arg_component.get_dom_id() ) )
						return
					}
					
					arg_component.debug('normalize_objects:jquery:' + selector)
					const jqo = $(selector)
					if (jqo && jqo.length > 0)
					{
						objects.push(jqo)
						return
					}

					console.warn(context + ':normalize_objects:component=%s:bad jquery selector=%s', arg_component.get_name(), selector, jqo)
					return
				}

				if (object_type == 'dom')
				{
					if (selector == 'this')
					{
						arg_component.debug('normalize_objects:dom:this is found')
						objects.push( arg_component.get_dom_element() )
						return
					}

					arg_component.debug('normalize_objects:dom:' + selector)
					const element = document.getElementById(selector)
					if (element)
					{
						objects.push(element)
						return
					}

					const selection = document.querySelector(selector)
					if (selection)
					{
						objects.push(selection)
						return
					}

					console.warn(context + ':normalize_objects:component=%s:bad dom selector=%s', arg_component.get_name(), selector)
					return
				}

				if (object_type == 'delegate')
				{
					objects.push(selector)
					return
				}

				console.warn(context + ':normalize_objects:component=%s:bad selector type=%s for selector=%s', arg_component.get_name(), object_type, selector)
			}
		)
		
		arg_component.leave_group('normalize_objects')
		return objects
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
		const source_dom_event = ('dom_event' in arg_binding_cfg) ? arg_binding_cfg['dom_event'] : undefined
		
		// SOURCES
		const source_type = ('source_type' in arg_binding_cfg) ? arg_binding_cfg['source_type'] : undefined
		const source_types = ('source_types' in arg_binding_cfg) ? arg_binding_cfg['source_types'] : (source_type ? [source_type] : undefined)

		const source_selector = ('source_selector' in arg_binding_cfg) ? arg_binding_cfg['source_selector'] : undefined
		const source_selectors = ('source_selectors' in arg_binding_cfg) ? arg_binding_cfg['source_selectors'] : (source_selector ? [source_selector] : undefined)

		// TARGETS
		const target_type = ('target_type' in arg_binding_cfg) ? arg_binding_cfg['target_type'] : undefined
		const target_types = ('target_types' in arg_binding_cfg) ? arg_binding_cfg['target_types'] : (target_type ? [target_type] : undefined)

		const target_selector = ('target_selector' in arg_binding_cfg) ? arg_binding_cfg['target_selector'] : undefined
		const target_selectors = ('target_selectors' in arg_binding_cfg) ? arg_binding_cfg['target_selectors'] : (target_selector ? [target_selector] : undefined)

		// METHOD
		const target_method = ('target_method' in arg_binding_cfg) ? arg_binding_cfg['target_method'] : undefined
		
		// NORMALIZE SOURCES
		// console.log(context + ':load:component=%s:binding type=%s:source_selectors&source_types=', arg_component.get_name(), type, source_selectors, source_types)
		const sources = source_selectors ? this.normalize_objects(arg_runtime, arg_component, source_selectors, source_types) : undefined

		// NORMALIZE TARGETS
		// console.log(context + ':load:component=%s:binding type=%s:target_selectors&target_types=', arg_component.get_name(), type, target_selectors, target_types)
		const targets = target_selectors ? this.normalize_objects(arg_runtime, arg_component, target_selectors, target_types) : undefined

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
		console.log(context + ':load:component=%s:binding type=%s', arg_component.get_name(), type)
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
				
				console.log(context + ':load:component=%s:binding type=%s:event=%s:sources=', arg_component.get_name(), type, source_dom_event, sources)
				
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
				
				const data = options && options.method && options.method.operands ? options.method.operands : undefined
				const trace_enabled = true
				const streams = []
				sources.forEach(
					(arg_dom_selector)=>{
						const stream = new Stream()
						const handler = (component, dom_event_name, arg_selector, dom_event, dom_event_target, arg_data)=>{
							const data = {
								is_event_handler:true,
								component_name:component.get_name(),
								event_name:dom_event_name,
								dom_selector:arg_selector,
								target:dom_event_target,
								data:arg_data
							}
							
							console.log(context + ':load:component=%s:binding type=%s:event=%s:on handler:data=', arg_component.get_name(), type, source_dom_event, data)

							stream.push(data)
						}

						// console.log(context + ':load:component=%s:binding type=%s:event=%s:selector.id=%s:selector=', arg_component.get_name(), type, source_dom_event, dom_id, arg_dom_selector)
						
						arg_component.on_dom_event(source_dom_event, arg_dom_selector, handler, data, trace_enabled)
						streams.push(stream)
					}
				)
				
				// console.log(context + ':load:component=%s:binding type=%s:event=%s:sources=', arg_component.get_name(), type, source_dom_event, sources)
				
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

			default:{
				console.warn(context + ':load:component=%s:binding type=%s:type not found', arg_component.get_name(), type)
			}
		}
	}
}

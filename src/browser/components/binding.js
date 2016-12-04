// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import { format } from 'util'

// COMMON IMPORTS
import uid from '../../common/utils/uid.js'
import { transform } from '../../common/utils/transform'


const context = 'browser/components/binding'



/**
 * @file UI component binding class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Binding
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
		this.is_binding = true

		this._id = arg_id ? arg_id : 'binding_' + uid()
		this._runtime = arg_runtime
		this._component = arg_component
		this._unsubscribe = undefined
		this._unsubscribe_state_update = undefined
	}
	
	

	/**
	 * Load and apply a component binding configuration.
	 * 
	 * @param {Immutable.Map|undefined} arg_binding_cfg - component binding configuration.
	 * 
	 * @returns {nothing} 
	 */
	load(arg_binding_cfg)
	{
		console.info(context + ':load:loading binding for component ' + this._component.get_name())
		
		// CHECK BINDING CONFIGURATION
		if (! T.isObject(arg_binding_cfg) )
		{
			return
		}
		
		// GET CONFIGURATION ATTRIBUTES
		const type = ('type' in arg_binding_cfg) ? arg_binding_cfg['type'] : undefined
		const state_path = ('state_path' in arg_binding_cfg) ? arg_binding_cfg['state_path'] : ['bindings_values', this._id]
		const xform = ('transform' in arg_binding_cfg) ? arg_binding_cfg['transform'] : undefined
		const options = ('options' in arg_binding_cfg) ? arg_binding_cfg['options'] : undefined
		
		const source_svc_name = ('service' in arg_binding_cfg) ? arg_binding_cfg['service'] : undefined
		const source_svc_method = ('method' in arg_binding_cfg) ? arg_binding_cfg['method'] : undefined
		const source_timeline = ('timeline' in arg_binding_cfg) ? arg_binding_cfg['timeline'] : undefined
		
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
						console.warn(context + ':load:component=%s:bad binding source dom selector type=%s', this._component.get_name(), typeof dom_selector)
						return
					}
					console.log(context + ':load:component=%s:binding source dom selector=%s', this._component.get_name(), dom_selector)

					if (dom_selector == 'this')
					{
						const jqo = $( '#' + this._component.get_dom_id() )
						sources.push(jqo)
						return
					}

					const jqo = $(dom_selector)
					sources.push(jqo)
					if (jqo && jqo.length > 0)
					{
						return
					}

					console.warn(context + ':load:component=%s:bad binding source dom selector=%s', this._component.get_name(), dom_selector)
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
						console.warn(context + ':load:component=%s:bad binding target view type=%s', this._component.get_name(), typeof view_name)
						return
					}
					console.log(context + ':load:component=%s:binding target view name=%s', this._component.get_name(), view_name)

					if (view_name == 'this')
					{
						targets.push(this._component)
						return
					}

					const target_object = this._runtime._ui.get(view_name)
					if (target_object)
					{
						targets.push(target_object)
						return
					}

					console.warn(context + ':load:component=%s:bad binding target view=%s', this._component.get_name(), view_name)
				}
			)
		}
		
		if ( T.isArray(target_dom_selectors) )
		{
			target_dom_selectors.forEach(
				(dom_selector)=>{
					if ( ! T.isString(dom_selector) )
					{
						console.warn(context + ':load:component=%s:bad binding target dom selector type=%s', this._component.get_name(), typeof dom_selector)
						return
					}
					console.log(context + ':load:component=%s:binding target dom selector=%s', this._component.get_name(), dom_selector)

					if (dom_selector == 'this')
					{
						const jqo = $( '#' + this._component.get_dom_id() )
						targets.push(jqo)
						return
					}

					const jqo = $(dom_selector)
					targets.push(jqo)
					if (jqo && jqo.length > 0)
					{
						return
					}

					console.warn(context + ':load:component=%s:bad binding target dom selector=%s', this._component.get_name(), dom_selector)
				}
			)
		}


		// GET STARTING VALUE
		let starting_value = undefined
		if ( T.isArray(state_path) && state_path.length > 0 )
		{
			starting_value = this._component.get_state_value(state_path, undefined)
		}


		// BIND SOURCES AND TARGETS
		console.log(context + ':load:component=%s:binding type=%s', this._component.get_name(), type)
		switch(type)
		{
			case 'timeline': {
				assert( T.isString(source_timeline),       context + format(':load:component=%s:bad timeline name=%s',            this._component.get_name(), source_timeline) )
				assert( T.isString(source_svc_name),       context + format(':load:component=%s:bad service name=%s,timeline=%s', this._component.get_name(), source_timeline, source_svc_name) )
				assert( T.isString(source_svc_method),     context + format(':load:component=%s:bad service name=%s,timeline=%s', this._component.get_name(), source_timeline, source_svc_method) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s,timeline=%s:bad targets',  this._component.get_name(), source_timeline, source_svc_method) )
				assert( T.isString(target_method),  context + format(':load:component=%s,timeline=%s:bad target method=%s',       this._component.get_name(), source_timeline, target_method) )
				
				this._unsubscribe = this.bind_timeline(starting_value, source_svc_name, source_svc_method, source_timeline, targets, target_method, options)
				
				if ( T.isArray(state_path) && state_path.length > 0 )
				{
					const opds = { method:{ operands:[state_path]}}
					this._unsubscribe_state_update = this.bind_timeline(starting_value, source_svc_name, source_svc_method, source_timeline, [this._component], 'dispatch_update_state_value_action', opds)
				}

				return 
			}

			case 'service': {
				assert( T.isString(source_svc_name),       context + format(':load:component=%s:bad service name=%s',  this._component.get_name(), source_svc_name) )
				assert( T.isString(source_svc_method),     context + format(':load:component=%s:bad method name=%s',   this._component.get_name(), source_svc_method) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s:bad targets',   this._component.get_name()) )
				assert( T.isString(target_method),  context + format(':load:component=%s:bad target method=%s',        this._component.get_name(), target_method) )

				this._unsubscribe = this.bind_svc(starting_value, source_svc_name, source_svc_method, xform, targets, target_method, options)
				
				if ( T.isArray(state_path) && state_path.length > 0 )
				{
					const opds = { method:{ operands:[state_path]}}
					this._unsubscribe_state_update = this.bind_svc(starting_value, source_svc_name, source_svc_method, xform, [this._component], 'dispatch_update_state_value_action', opds)
				}
				
				return 
			}

			case 'emitter_jquery': {
				assert( T.isArray(sources),         context + format(':load:component=%s:bad sources array=%s',       this._component.get_name()) )
				assert( T.isArray(targets) && targets.length > 0, context + format(':load:component=%s:bad targets',  this._component.get_name()) )
				assert( T.isString(source_dom_event),  context + format(':load:component=%s:bad source event=%s',     this._component.get_name(), source_dom_event) )
				assert( T.isString(target_method),  context + format(':load:component=%s:bad target method=%s',       this._component.get_name(), target_method) )
				
				this.bind_emitter_jquery(sources, source_dom_event, xform, targets, target_method, options)
						
				if ( T.isArray(state_path) && state_path.length > 0 )
				{
					const opds = { method:{ operands:[state_path]}}
					this.bind_emitter_jquery(sources, source_dom_event, xform, [this._component], 'dispatch_update_state_value_action', opds)
				}

				return 
			}
		}
	}
	
	
	
	/**
	 * Bind a service stream event on object method.
	 * 
	 * @param {any} arg_starting_value - starting value.
	 * @param {string} arg_svc_name - service name string.
	 * @param {string} arg_svc_method - service method string.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {array} arg_bound_objects - target object instances array.
	 * @param {string} arg_bound_method - target object method string.
	 * @param {object} arg_options - binding options.
	 * 
	 * @returns {nothing}
	 */
	bind_svc(arg_starting_value, arg_svc_name, arg_svc_method, arg_values_xform, arg_bound_objects, arg_bound_method, arg_options)
	{
		assert( T.isString(arg_svc_name), context + ':bind_svc:bad service name string')
		assert( T.isString(arg_svc_method), context + ':bind_svc:bad service method string')
		
		console.log(context + ':bind_svc:svc name=%s svc method=%s method=%s target=%o', arg_svc_name, arg_svc_method, arg_bound_method, arg_bound_objects)
		
		const unsubscribes = []
		this._runtime.register_service(arg_svc_name).then(
			(svc) => {
				// console.log(context + ':bind_svc:svc', svc)
				assert( (arg_svc_method in svc) && T.isFunction(svc[arg_svc_method]), context + ':bind_svc:bad bound method function')
				
				if (arg_svc_method == 'post')
				{
					svc.subscribe()
				}
				
				const method_cfg = T.isObject(arg_options) ? arg_options.method  : undefined
				const operands   = T.isObject(method_cfg)  ? method_cfg.operands : undefined
				const format     = T.isObject(arg_options) ? arg_options.format  : undefined
				console.log(context + ':bind_svc:svc name=%s svc_method=%s method=%s method_cfg=%o', arg_svc_name, arg_svc_method, arg_bound_method, method_cfg)

				const stream = svc[arg_svc_method](method_cfg)
				// stream.subscribe( (datas) => {console.log(datas) } )

				arg_bound_objects.forEach(
					(target)=>{
						const unbind = this.bind_stream(stream, arg_values_xform, target, arg_bound_method, operands, format)
						unsubscribes.push(unbind)
					}
				)

				// INIT STARTING VALUE
				stream.startWith(arg_starting_value)
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
	
	
	
	/**
	 * Bind a service timeline stream event on object method.
	 * 
	 * @param {any} arg_starting_value - starting value.
	 * @param {string} arg_svc_name      - service name string.
	 * @param {string} arg_svc_method    - service method string.
	 * @param {string} arg_timeline_name - timeline name.
	 * @param {array}  arg_bound_objects - target object instance (optional: this as default).
	 * @param {string} arg_bound_method  - target object method string.
	 * @param {object} arg_options       - binding options.
	 * 
	 * @returns {nothing}
	 */
	bind_timeline(arg_starting_value, arg_svc_name, arg_svc_method, arg_timeline_name, arg_bound_objects, arg_bound_method, arg_options)
	{
		assert( T.isString(arg_svc_name), context + ':bind_timeline:bad service name string')
		assert( T.isString(arg_svc_method), context + ':bind_timeline:bad service method string')
		
		// console.log(context + ':bind_timeline:svc name=%s svc method=%s timeline=%s method=%s targets=%o', arg_svc_name, arg_svc_method, arg_timeline_name, arg_bound_method, arg_bound_objects)
		
		this._runtime.register_service(arg_svc_name).then(
			(svc) => {
				// console.log(context + ':bind_timeline:svc', svc)
				assert( (arg_svc_method in svc) && T.isFunction(svc[arg_svc_method]), context + ':bind_timeline:bad bound method function')
				
				if (arg_svc_method == 'post')
				{
					svc.subscribe()
				}
				
				const method_cfg = T.isObject(arg_options) ? arg_options.method : undefined
				const operands = T.isObject(method_cfg) ? method_cfg.operands : undefined

				assert( arg_timeline_name in svc[arg_svc_method].timelines, context + ':bind_timeline:timeline name [' + arg_timeline_name + '] not found')
				assert( T.isObject( svc[arg_svc_method].timelines[arg_timeline_name] ), context + ':bind_timeline:bad timeline object')
				const stream = svc[arg_svc_method].timelines[arg_timeline_name].stream
				// stream.subscribe( (datas) => {console.log(context + ':bind_timeline:timeline=%s datas=', arg_timeline_name, datas) } )
				
				arg_bound_objects.forEach(
					(target, index) => {
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
							extracted_stream.onValue(target, arg_bound_method, ...operands)
						}
						else
						{
							extracted_stream.onValue(target, arg_bound_method)
						}

						// INIT STARTING VALUE
						extracted_stream.startWith(arg_starting_value)
					}
				)
			}
		)
	}
	
	
	
	/**
	 * Bind a JQuery event on an object method through a stream.
	 * 
	 * @param {array} arg_sources - event emitter objects.
	 * @param {string} arg_dom_event - event name string.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {array} arg_bound_objects - target object array.
	 * @param {string} arg_bound_method - target object method string.
	 * @param {object} arg_options - binding options.
	 * 
	 * @returns {function} - unbind function
	 */
	bind_emitter_jquery(arg_sources, arg_dom_event, arg_values_xform, arg_bound_objects, arg_bound_method, arg_options)
	{
		assert( T.isArray(arg_sources), context + ':bind_emitter_jquery:bad emitters array')
		assert( T.isString(arg_dom_event), context + ':bind_emitter_jquery:bad event string')
		
		// console.log(context + ':bind_emitter_jquery:dom_selector=%s dom_event=%s method=%s target=%o', arg_dom_selector, arg_dom_event, arg_bound_method, arg_bound_object)
		
		const method_cfg = T.isObject(arg_options) ? arg_options.method : undefined
		const operands = T.isObject(method_cfg) ? method_cfg.operands : undefined
		const format = T.isObject(arg_options) ? arg_options.format : undefined

		const unsubscribes = []
		arg_sources.forEach(
			(emitter)=>{
				const stream = emitter.asEventStream(arg_dom_event)
				// const stream = Bacon.fromEvent($(arg_dom_selector), arg_dom_event)
				
				arg_bound_objects.forEach(
					(target)=>{
						const unsubscribe = this.bind_stream(stream, arg_values_xform, target, arg_bound_method, operands, format)
						unsubscribes.push(unsubscribe)
					}
				)
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
	
	
	
	
	/**
	 * Bind a stream to a target object action.
	 * 
	 * @param {function}  arg_stream          - stream instance.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object}    arg_bound_object    - target object instance (optional: this as default).
	 * @param {string}    arg_bound_method    - target object method string.
	 * @param {anything}  arg_method_operands - target object method operands (optional).
	 * @param {object}    arg_format_object   - formatting settings.
	 * 
	 * @returns {function} - unbind function
	 */
	bind_stream(arg_stream, arg_values_xform, arg_bound_object, arg_bound_method, arg_method_operands, arg_format_object)
	{
		let unbind_cb = undefined

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
				unbind_cb = xform_stream.toProperty().assign(arg_bound_object, arg_bound_method, ...arg_method_operands)
			}
			else
			{
				unbind_cb = xform_stream.toProperty().assign(arg_bound_object, arg_bound_method)
			}
		}
		
		else if ( T.isFunction(arg_values_xform) )
		{
			let xform_stream = arg_stream.map(arg_values_xform)
			xform_stream = T.isFunction(formatting_xform) ? xform_stream.map(formatting_xform) : xform_stream
			
			if (arg_method_operands)
			{
				unbind_cb = xform_stream.toProperty().assign(arg_bound_object, arg_bound_method, ...arg_method_operands)
			}
			else
			{
				unbind_cb = xform_stream.arg_stream.map(arg_values_xform).toProperty().assign(arg_bound_object, arg_bound_method)
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
				unbind_cb = xform_stream.onValue(arg_bound_object, arg_bound_method, ...arg_method_operands)
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

// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import VNode from 'virtual-dom/vnode/vnode'
import VText from 'virtual-dom/vnode/vtext'

// COMMON IMPORTS
import uid from '../utils/uid'
import RenderingResult from './rendering_result'


let context = 'common/rendering/rendering_factory'



/**
 * @file Rendering factory.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */


const from_string = (arg_item, arg_rendering_context=undefined)=>{
	if (arg_rendering_context && arg_rendering_context.topology_defined_application && arg_rendering_context.topology_defined_application.find_resource)
	{
		arg_rendering_context.trace_fn(context + ':from_string:search item [' + arg_item + '] in defined application [' + arg_rendering_context.topology_defined_application.get_name() + ']')

		const r = arg_rendering_context.topology_defined_application.find_resource(arg_item)
		if (r)
		{
			const res_settings = r.get_settings_js()
			res_settings.settings = res_settings.settings ? res_settings.settings : {}
			if ( ! res_settings.settings.id)
			{
				res_settings.settings.id = arg_item
			}
			arg_rendering_context.trace_fn(res_settings, 'res_settings')

			return from_object(res_settings, arg_rendering_context)
		}

		arg_rendering_context.trace_fn(context + ':from_string:item [' + arg_item + '] NOT FOUND in defined application')
	}
	

	const result = new RenderingResult()
	result.add_vtree('tag_' + uid(), new VText(arg_item) )
	return result
}



const from_object = (arg_item, arg_rendering_context=undefined)=>{

	const type     = T.isString(arg_item.type)     ? arg_item.type.toLocaleLowerCase() : (T.isString(arg_item.class_name) ? arg_item.class_name.toLocaleLowerCase() : undefined)
	const settings = T.isObject(arg_item.settings) ? arg_item.settings : {}
	const state    = T.isObject(arg_item.state)    ? arg_item.state : undefined
	const children = T.isObject(arg_item.children) ? arg_item.children : {}

	// DEBUG
	// debugger
	arg_rendering_context.trace_fn(arg_item, context + ':from_object:arg_item')
	arg_rendering_context.trace_fn(type, context     + ':from_object:type')
	arg_rendering_context.trace_fn(settings, context + ':from_object:settings')
	arg_rendering_context.trace_fn(state, context    + ':from_object:state')
	arg_rendering_context.trace_fn(children, context + ':from_object:children')
	
	settings.children = children

	if (arg_rendering_context && arg_rendering_context.topology_defined_application && arg_rendering_context.topology_defined_application.find_rendering_function)
	{
		arg_rendering_context.trace_fn(context + ':from_object:search rendering function into application plugins for ' + type)

		const f = arg_rendering_context.topology_defined_application.find_rendering_function(type)
		if (f)
		{
			arg_rendering_context.trace_fn(context + ':from_object:search rendering function into application plugins: FOUND')

			return f(settings, state, arg_rendering_context)
		}
	}

	arg_rendering_context.trace_fn(context + ':from_object:rendering function NOT FOUND')

	const result = new RenderingResult()
	result.add_vtree('tag_' + uid(), new VText( arg_item.toString() ) )
	return result
}



/**
 * Create a RenderingResult with an item: string, function, view instance as object...
 * 
 * @param {any} arg_item - item configuration.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {object} arg_children - private view children settings
 * 
 * @returns {RenderingResult}
 */
export default (arg_item, arg_rendering_context=undefined, arg_children={})=>{
	arg_rendering_context.trace_fn = T.isFunction(arg_rendering_context.trace_fn) ? arg_rendering_context.trace_fn : ()=>{}
	
	arg_rendering_context.trace_fn('-------- rendering_factory:ENTER --------')
	arg_rendering_context.trace_fn(arg_children, 'children')
	arg_rendering_context.trace_fn(T.isString(arg_item) ? arg_item : 'not a string', 'item')

	// ITEM IS A STRING: a text or a view name
	if( T.isString(arg_item) )
	{
		if (arg_item in arg_children)
		{
			// console.log('rendering_factory:item [' + arg_item + '] found into children')
			const res_settings = arg_children[arg_item]
			res_settings.settings = res_settings.settings ? res_settings.settings : {}
			if ( ! res_settings.settings.id)
			{
				res_settings.settings.id = arg_item
			}
			
			return from_object(res_settings, arg_rendering_context)
		}
		return from_string(arg_item, arg_rendering_context)
	}

	// ITEM IS AN OBJECT: a view config
	if( T.isObject(arg_item) )
	{
		return from_object(arg_item, arg_rendering_context)
	}

	// console.log(arg_item, context + ':create:unknow item')
	console.error(context + ':unknow item with typeof:' + typeof arg_item)
	
	const result = new RenderingResult()
	result.add_vtree('tag_' + uid(), new VText( context + ':unknow item with typeof:' + typeof arg_item ) )
	return result
}
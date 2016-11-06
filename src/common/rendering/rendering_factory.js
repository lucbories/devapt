// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import VNode from 'virtual-dom/vnode/vnode'
import VText from 'virtual-dom/vnode/vtext'

// COMMON IMPORTS
import DefaultRendering from './index'


let context = 'common/rendering/rendering_factory'



/**
 * @file Rendering factory.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */


const from_string = (arg_item, arg_rendering_context=undefined)=>{
	return new VText(arg_item) // TODO
}


const from_object = (arg_item, arg_rendering_context=undefined)=>{

	const type = T.isString(arg_item.type) ? arg_item.type.toLocaleLowerCase() : undefined
	const settings = T.isObject(arg_item.settings) ? arg_item.settings : undefined
	const state    = T.isObject(arg_item.state)    ? arg_item.state : undefined

	if (arg_rendering_context && arg_rendering_context.topology_defined_application && arg_rendering_context.topology_defined_application.find_rendering_function)
	{
		const f = arg_rendering_context.topology_defined_application.find_rendering_function(type)
		return f(settings, state, arg_rendering_context).get_final_vtree()
	}

	switch(type) {
		case 'button':
			return DefaultRendering.button(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'label':
			return DefaultRendering.label(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'anchor':
			return DefaultRendering.anchor(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'image':
			return DefaultRendering.image(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'input':
		case 'input-field':
				return DefaultRendering.input_field(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'list':
			return DefaultRendering.list(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'table':
			return DefaultRendering.table(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'Script':
			return DefaultRendering.script(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'menubar':
			return DefaultRendering.menubar(settings, state, arg_rendering_context).get_final_vtree()
		
		// case 'Page':
		// case 'Tabs':
		// case 'Tree':
		// case 'TableTree':
		
		case 'hbox':
			return DefaultRendering.hbox(settings, state, arg_rendering_context).get_final_vtree()
		
		case 'vbox':
			return DefaultRendering.vbox(settings, state, arg_rendering_context).get_final_vtree()
	}

	return new VText( arg_item.toString() ) // TODO
}


/**
 * Create a RenderingResult with an item: string, function, view instance as object...
 * 
 * @param {any} arg_item - item configuration.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * 
 * @returns {RenderingResult}
 */
export default (arg_item, arg_rendering_context=undefined)=>{
	// ITEM IS A STRING: a text or a view name
	if( T.isString(arg_item) )
	{
		return from_string(arg_item, arg_rendering_context)
	}

	// ITEM IS AN OBJECT: a view config
	if( T.isObject(arg_item) )
	{
		return from_object(arg_item, arg_rendering_context)
	}

	console.error(context + ':create:unknow item', arg_item)
	return undefined
}
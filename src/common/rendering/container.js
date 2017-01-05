// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/container'



// DEFAULT STATE
const default_state = {
	items:undefined    // array (rows)
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}




/**
 * container rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., resolver:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined

	// GET SETTINGS ATTRIBUTES

	// GET STATE ATTRIBUTES
	const items_value   = T.isArray(state.items)   ? state.items : undefined

	// BUILD CELL
	const cell_fn = (cell) => T.isFunction(rendering_factory) ? rendering_factory(cell, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : cell.toString()

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = items_value ? items_value.map(cell_fn) : undefined
	const tag_props = { id:tag_id, style:settings.style, className:settings.class }
	const tag = h('div', tag_props, tag_children )
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}

// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import RenderingResult from './rendering_result'
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/list'



// DEFAULT STATE
const default_state = {
	label:undefined,
	items:undefined    // array (rows)
}

// DEFAULT SETTINGS
const default_settings = {
	type:'ul',
	class:undefined,
	style:undefined,
	id:undefined
}

const types = ['ul', 'ol']



/**
 * List rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	
	// GET SETTINGS ATTRIBUTES
	const type_value = (T.isString(settings.type) && types.indexOf(settings.type) > -1) ? settings.type : 'ul'

	// GET STATE ATTRIBUTES
	const label_value   = T.isString(state.label)  ? state.label : undefined
	const items_value   = T.isArray(state.items)   ? state.items : undefined

	// BUILD THEAD
	const cell_fn = (cell) => T.isFunction(rendering_context.rendering_factory) ? rendering_context.rendering_factory(cell, rendering_context) : cell.toString()
	const li_fn = (content)=>h('li', undefined, cell_fn(content) )

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = items_value ? items_value.map(li_fn) : undefined
	const tag_props = { id:tag_id, style:settings.style, class:settings.class }
	const tag = h(type_value, tag_props, label_value ? [label_value].concat(tag_children) : tag_children )
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}

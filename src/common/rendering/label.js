// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import RenderingResult from './rendering_result'
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/label'



// DEFAULT STATE
const default_state = {
	label:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * Label rendering with given state, produce a rendering result.
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
		
	// GET STATE ATTRIBUTES
	const label_value = T.isString(state.label) ? state.label : undefined

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = label_value
	const tag_props = { id:tag_id, style:settings.style, class:settings.class }
	const tag = h('span', tag_props, tag_children)
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}

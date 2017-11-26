// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/image'



// DEFAULT STATE
const default_state = {
	// label:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	src: undefined,
	alt: undefined,
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * Image rendering with given state, produce a rendering result.
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

	// GET SETTINGS ATTRIBUTES
	const src_value = (T.isString(settings.source) && settings.source.length > 0) ? settings.source : undefined
	const alt_value = (T.isString(settings.alt)    && settings.alt.length    > 0) ? settings.alt : undefined
		
	// GET STATE ATTRIBUTES
	// const label_value = T.isString(state.label) ? state.label : undefined

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = undefined
	const tag_props = { id:tag_id, src:src_value, alt:alt_value, style:settings.style, class:settings.class }
	const tag = h('img', tag_props, tag_children)
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}

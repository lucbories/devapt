// NPM IMPORTS
// import assert from 'assert'
// import _ from 'lodash'
// import h from 'virtual-dom/h'

// COMMON IMPORTS
// import T from '../utils/types'
import rendering_normalize from './rendering_normalize'
import table from './table'


let context = 'common/rendering/hbox'



// DEFAULT STATE
const default_state = {
	label:undefined,
	items:undefined,    // array (rows) of array (cells)
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * HBox rendering with given state, produce a rendering result.
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
		
	// GET STATE ATTRIBUTES
	state.columns = undefined
	state.footers = undefined

	return table(settings, state, rendering_context, rendering_result)
}

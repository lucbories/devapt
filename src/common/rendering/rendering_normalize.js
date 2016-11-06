// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import uid from '../utils/uid'
import RenderingResult from './rendering_result'


let context = 'common/rendering/rendering_normalize'



/**
 * Normalize settings and state, helper function.
 * 
 * @param {object} arg_default_settings - rendering default settings.
 * @param {object} arg_default_state - component default state.
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * @param {string} arg_log_context - trace context.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_default_settings, arg_default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, arg_log_context)=>{
	// NORMALIZE ARGUMENTS
	const result = T.isObject(arg_rendering_result) && arg_rendering_result.is_rendering_result ? arg_rendering_result : new RenderingResult()
	const settings = _.merge({}, arg_default_settings, arg_settings)
	const state    = _.merge({}, arg_default_state, arg_state)
	
	const rendering_context = {
		trace_fn:arg_rendering_context.trace_fn,
		credentials:arg_rendering_context.credentials,
		rendering_factory: T.isFunction(arg_rendering_context.rendering_factory) ? arg_rendering_context.rendering_factory : (v)=>v,
		topology_defined_application:arg_rendering_context.topology_defined_application
	}

	// SET ID
	if (! T.isString(settings.id) )
	{
		settings.id = 'tag_' + uid()
	}

	// DEBUG
	if (arg_rendering_context && arg_rendering_context.trace_fn)
	{
		arg_rendering_context.trace_fn(settings, arg_log_context + ':settings')
		arg_rendering_context.trace_fn(state, arg_log_context + ':state')
	}

	return {
		settings:settings,
		state:state,
		rendering_context:rendering_context,
		rendering_result:result
	}
}

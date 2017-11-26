// NPM IMPORTS
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import T from '../utils/types'
import rendering_normalize from './rendering_normalize'
import container from './container'
import RenderingBuilder from './rendering_builder'

const context = 'common/rendering/dock'



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
 * Dock rendering with given state, produce a rendering result.
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
	
	// GET BLOCK GRID RENDERING FUNCTION
	const resolver = RenderingBuilder.get_rendering_function_resolver()
	const block_grid = resolver ? resolver.find_rendering_function('block_grid') : undefined
	const dock_content = block_grid ? block_grid : container

	// GET STATE ATTRIBUTES

	const tag_dock_id = settings.id

	/*
	.float-center {
		display: block;
		margin-right: auto;
		margin-left: auto;
	}
	.float-left {
		float: left !important;
	}
	.float-right {
		float: right !important;
	}
	*/
	// BUILD DOCK HEADER
	// const tag_header_resize = h('button', { style:'float:right;color:#8a8a8a;cursor:pointer;' } , [ h('span', undefined, [h('span', undefined, 'R')] ) ])
	const tag_content_close = h('button', { style:'float:right;color:#8a8a8a;cursor:pointer;' } , [ h('span', undefined, [h('span', undefined, 'X')] ) ])
	const tag_header_id = tag_dock_id + '_header'
	const tag_header_children = [/*tag_header_settings, tag_header_resize, */tag_content_close]
	const tag_header_props = { id:tag_header_id, className:'devapt-dock-header' }
	const tag_header = h('div', tag_header_props, tag_header_children )
	
	// BUILD DOCK CONTENT
	settings.id = tag_dock_id + '_content'
	settings.class = T.isString(settings.class) ? settings.class : ''
	settings.class += ' devapt-dock-content' 
	dock_content(settings, state, rendering_context, rendering_result)
	const tag_content = rendering_result.get_vtree(settings.id)
	rendering_result.remove_vtree(settings.id)

	// BUILD DOCK MAIN
	const tag_dock_children = [tag_header, tag_content]
	const tag_dock_props = { id:tag_dock_id, className:'devapt-dock' }
	const tag_dock = h('div', tag_dock_props, tag_dock_children )

	rendering_result.add_vtree(tag_dock_id, tag_dock)

	return rendering_result
}

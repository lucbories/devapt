// NPM IMPORTS
import T from 'typr'
import assert from 'assert'


let context = 'common/rendering/rendering_item'



/**
 * @file RenderingItem stateless base rendering class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class RenderingItem
{
	/**
	 * Create RenderingItem instance to render a Html part.
	 * 
	 * API:
	 * 		->constructor(arg_settings:object):nothing - create a rendering item instance.
	 * 		->render(arg_state:object):RenderingResult - rendering process with given state, produce a rendering result.
	 * 
	 * @param {object} arg_settings - rendering item settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':constructor:bad settings object')

		this.is_rendering_item = true
	}



	/**
	 * Rendering process with given state, produce a rendering result.
	 * @abstract
	 * 
	 * @param {object} arg_state - component state.
	 * @param {object} arg_context - rendering context: { topology_defined_application:..., credentials:..., renderer:... }.
	 * @param {RenderingResult} arg_rendering_result - rendering result to update.
	 * 
	 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
	 */
	render(arg_state={}, arg_context, arg_rendering_result)
	{
		assert(false, context + ':render:should be overwritten')
		
		arg_rendering_result.add_script( this.get_name(), this._get_init_script(arg_state) )
		
		return arg_rendering_result
	}



	/**
	 * Get init script.
	 * @private
	 * 
	 * @returns {string}
	 */
	_get_init_script(arg_name, arg_init_state)
	{
		assert( T.isString(arg_name), context + ':_get_init_script:bad name string')
		assert( T.isObject(arg_init_state), context + ':_get_init_script:bad initial state object')
		
		const view_state_str = JSON.stringify(arg_init_state)
		
		return `
		{
			var current_state = window.devapt().ui().store.get_state()
			var state_path = []
			var view_state = ${view_state_str}
			// console.log(view_state, 'view_state')
			var component_state = window.devapt().ui().find_state(current_state, "${arg_name}", state_path)
			if (! component_state)
			{
				var action = { type:"ADD_JSON_RESOURCE", resource:"${arg_name}", json:view_state }
				 window.devapt().ui().store.dispatch(action)
			}
			window.devapt().ui("${arg_name}")
		}`
	}
}


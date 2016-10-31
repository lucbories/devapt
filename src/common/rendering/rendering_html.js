// NPM IMPORTS
import T from 'typr'
import assert from 'assert'


let context = 'common/rendering/rendering_html'



/**
 * @file RenderingHtml stateless rendering class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class RenderingHtml extends RenderingItem
{
	/**
	 * Create RenderingHtml instance to render a Html part.
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
	 * @param {string} arg_key - key string to retrieve the value.
	 * @param {any} arg_default - returned default value if the key is not found (optional) (default:undefined).
	 * 
	 * @returns {RenderingResult} - Rendering result: VNode or Html text, headers.
	 */
	render(arg_state={})
	{
		assert(false, context + ':render:should be overwritten')
		const result = new RenderingResult()
		return result
	}
}


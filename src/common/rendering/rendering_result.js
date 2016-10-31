// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import virtualize from 'vdom-virtualize'
import VNode from 'virtual-dom/vnode/vnode'
import VText from 'virtual-dom/vnode/vtext'
import html_to_vdom from 'html-to-vdom'


let context = 'common/rendering/rendering_result'

const convertHTML = html_to_vdom(
	{
		VNode: VNode,
		VText: VText
	}
)



/**
 * @file RenderingResult class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class RenderingResult
{
	/**
	 * Create RenderingResult instance.
	 * 
	 * API:
	 * 		->constructor():nothing - create an empty rendering result instance.
	 * 		->set_html(arg_html):nothing - take Html text and convert it to a virtual tree.
	 * 		->set_vtree(arg_vtree):nothing - set virtual tree.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_)
	{
		assert( T.isObject(arg_settings), context + ':constructor:bad settings object')

		this.is_rendering_result = true

		this.vtrees = {}

		this.head_scripts_urls = []
		this.head_scripts_tags = []
		this.body_scripts_urls = []
		this.body_scripts_tags = []
		this.head_styles_urls = []
		this.head_styles_tags = []
	}



	/**
	 * Set Html text.
	 * 
	 * @param {string} arg_html - Html string.
	 * 
	 * @returns {nothing}.
	 */
	set_html(arg_html)
	{
		assert( T.isString(arg_html), context + ':set_html:bad html string')
		this.vtree = convertHTML(arg_html)
	}



	/**
	 * Set a VTree instance.
	 * 
	 * @param {string} arg_tag_id - tag id string.
	 * @param {VNode} arg_vtree - virtual-dom virtual tree.
	 * 
	 * @returns {nothing}.
	 */
	set_vtree(arg_tag_id, arg_vtree)
	{
		assert( T.isString(arg_tag_id) && arg_tag_id.length > 0, context + ':set_vtree:bad tag id string')
		assert( T.isObject(arg_vtree), context + ':set_vtree:bad vtree object')
		this.vtrees[arg_tag_id] = arg_vtree
	}



	/**
	 * Set header scripts urls.
	 * 
	 * @param {array} arg_urls - scripts urls strings array.
	 * 
	 * @returns {nothing}.
	 */
	set_head_scripts_urls(arg_urls)
	{
		assert( T.isArrayg(arg_urls), context + ':set_head_scripts_urls:bad head scripts urls array')
		this.head_scripts_urls = arg_urls
	}



	/**
	 * Set header scripts tags.
	 * 
	 * @param {array} arg_tags - scripts tags strings array.
	 * 
	 * @returns {nothing}.
	 */
	set_head_scripts_tags(arg_tags)
	{
		assert( T.isArrayg(arg_tags), context + ':set_head_scripts_tags:bad head scripts tags array')
		this.head_scripts_tags = arg_tags
	}



	/**
	 * Set body scripts urls.
	 * 
	 * @param {array} arg_urls - scripts urls strings array.
	 * 
	 * @returns {nothing}.
	 */
	set_body_scripts_urls(arg_urls)
	{
		assert( T.isArrayg(arg_urls), context + ':set_body_scripts_urls:bad body scripts urls array')
		this.body_scripts_urls = arg_urls
	}



	/**
	 * Set body scripts tags.
	 * 
	 * @param {array} arg_tags - scripts tags strings array.
	 * 
	 * @returns {nothing}.
	 */
	set_body_scripts_tags(arg_tags)
	{
		assert( T.isArrayg(arg_tags), context + ':set_body_scripts_tags:bad body scripts tags array')
		this.body_scripts_tags = arg_tags
	}



	/**
	 * Set header styles urls.
	 * 
	 * @param {array} arg_urls - styles urls strings array.
	 * 
	 * @returns {nothing}.
	 */
	set_head_styles_urls(arg_urls)
	{
		assert( T.isArrayg(arg_urls), context + ':set_head_styles_urls:bad head styles urls array')
		this.head_styles_urls = arg_urls
	}



	/**
	 * Set header styles tags.
	 * 
	 * @param {array} arg_tags - styles tags strings array.
	 * 
	 * @returns {nothing}.
	 */
	set_head_styles_tags(arg_tags)
	{
		assert( T.isArrayg(arg_tags), context + ':set_head_styles_tags:bad head styles tags array')
		this.head_styles_tags = arg_tags
	}
}


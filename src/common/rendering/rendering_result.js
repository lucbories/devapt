// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import virtualize from 'vdom-virtualize'
import VNode from 'virtual-dom/vnode/vnode'
import VText from 'virtual-dom/vnode/vtext'
import html_to_vdom from 'html-to-vdom'
import vdom_as_json from 'vdom-as-json'
import create_element from 'virtual-dom/create-element'
const vdom_to_json = vdom_as_json.toJson

// COMMON IMPORTS
import {is_browser, is_server} from '../utils/is_browser'


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
	 * 
	 * 		->add_html(arg_tag_id, arg_html):nothing - take Html text and convert it to a virtual tree.
	 * 		->add_vtree(arg_tag_id, arg_vtree):nothing - add a virtual tree.
	 * 
	 * 		->set_headers(arg_headers)
	 * 
	 * 		->set_head_scripts_urls(arg_urls)
	 * 		->set_head_scripts_tags(arg_tags)
	 * 
	 * 		->set_body_scripts_urls(arg_urls)
	 * 		->set_body_scripts_tags(arg_tags)
	 * 
	 * 		->set_head_styles_urls(arg_tags)
	 * 		->set_head_styles_tags(arg_tags)
	 * 		
	 * 		->add_result(arg_result)
	 * 		->get_html(arg_id)
	 * 
     * @returns {nothing}
	 */
	constructor()
	{
		this.is_rendering_result = true

		this.vtrees = {}

		this.headers = []
		this.head_scripts_urls = []
		this.head_scripts_tags = []
		this.body_scripts_urls = []
		this.body_scripts_tags = []
		this.head_styles_urls = []
		this.head_styles_tags = []
	}



	/**
	 * Add a RenderingResult instance.
	 * 
	 * @param {RenderingResult} arg_result - rendering result to add to this result.
	 * 
	 * @returns {nothing}
	 */
	add_result(arg_result)
	{
		this.vtrees = Object.assign(this.vtrees, arg_result.vtrees)

		this.head_scripts_urls = Array.concat(this.head_scripts_urls, arg_result.head_scripts_urls)
		this.head_scripts_tags = Array.concat(this.head_scripts_tags, arg_result.head_scripts_tags)
		this.body_scripts_urls = Array.concat(this.body_scripts_urls, arg_result.body_scripts_urls)
		this.body_scripts_tags = Array.concat(this.body_scripts_tags, arg_result.body_scripts_tags)
		this.head_styles_urls  = Array.concat(this.head_styles_urls,  arg_result.head_styles_urls)
		this.head_styles_tags  = Array.concat(this.head_styles_tags,  arg_result.head_styles_tags)
	}



	/**
	 * Get final VTree.
	 * 
	 * @param {string|undefined} arg_final_id - final tree id (optional).
	 * 
	 * @returns {VNode}
	 */
	get_final_vtree(arg_final_id)
	{
		if (this.vtrees.length == 0)
		{
			return new VText('')
		}

		if (this.vtrees.length == 1)
		{
			const trees = _.toArray(this.vtrees)
			return trees[0]
		}

		const settings = T.isString(arg_final_id) ? { id:arg_final_id } : undefined
		return new VNode('DIV', settings, _.toArray(this.vtrees), 'id', undefined)
	}



	/**
	 * Add Html tag.
	 * 
	 * @param {string} arg_tag_id - tag id string.
	 * @param {string} arg_html - Html string.
	 * 
	 * @returns {nothing}.
	 */
	add_html(arg_tag_id, arg_html)
	{
		assert( T.isString(arg_tag_id) && arg_tag_id.length > 0, context + ':set_vtree:bad tag id string')
		assert( T.isString(arg_html), context + ':set_html:bad html string')
		this.vtrees[arg_tag_id] = vdom_to_json( convertHTML(arg_html) )
	}



	/**
	 * Add a VTree instance.
	 * 
	 * @param {string} arg_tag_id - tag id string.
	 * @param {VNode} arg_vtree - virtual-dom virtual tree.
	 * 
	 * @returns {nothing}.
	 */
	add_vtree(arg_tag_id, arg_vtree)
	{
		assert( T.isString(arg_tag_id) && arg_tag_id.length > 0, context + ':add_vtree:bad tag id string')
		assert( T.isObject(arg_vtree), context + ':add_vtree:bad vtree object')
		this.vtrees[arg_tag_id] = arg_vtree
	}



	/**
	 * Get VTreeas Json.
	 * 
	 * @param {string} arg_tag_id - tag id string.
	 * @param {VNode} arg_vtree - virtual-dom virtual tree.
	 * 
	 * @returns {nothing}.
	 */
	get_vtree_json(arg_tag_id)
	{
		const vtree = this.get_vtree(arg_id)
		if (! vtree)
		{
			return vdom_to_json( arg_vtree )
		}
		return undefined
	}



	/**
	 * Get existing VTree instance.
	 * 
	 * @param {string} arg_id - element id.
	 * 
	 * @returns {VTree}
	 */
	get_vtree(arg_id)
	{
		return this.vtrees[arg_id]
	}



	/**
	 * Get Html code for an existing vtree.
	 * 
	 * @param {string} arg_id - element id.
	 * 
	 * @returns {string}
	 */
	get_html(arg_id)
	{
		const vtree = this.get_vtree(arg_id)
		if (! vtree)
		{
			return undefined
		}

		try
		{
			const e = create_element(vtree)
			if (e)
			{
				return is_browser() ? e.innerHTML : e.toString()
			}
		}
		catch(e)
		{
			console.error(context + ':', e)
		}
		return undefined
	}



	/**
	 * Set headers.
	 * 
	 * @param {array} set_headers - headers strings array.
	 * 
	 * @returns {nothing}.
	 */
	set_headers(arg_headers)
	{
		assert( T.isArray(arg_headers), context + ':set_headers:bad headers array')
		this.headers = arg_headers
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
		assert( T.isArray(arg_urls), context + ':set_head_scripts_urls:bad head scripts urls array')
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
		assert( T.isArray(arg_tags), context + ':set_head_scripts_tags:bad head scripts tags array')
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
		assert( T.isArray(arg_urls), context + ':set_body_scripts_urls:bad body scripts urls array')
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
		assert( T.isArray(arg_tags), context + ':set_body_scripts_tags:bad body scripts tags array')
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
		assert( T.isArray(arg_urls), context + ':set_head_styles_urls:bad head styles urls array')
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
		assert( T.isArray(arg_tags), context + ':set_head_styles_tags:bad head styles tags array')
		this.head_styles_tags = arg_tags
	}
}


// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import VNode from 'virtual-dom/vnode/vnode'
import VText from 'virtual-dom/vnode/vtext'
import html_to_vdom from 'html-to-vdom'
import vdom_as_json from 'vdom-as-json'
import create_element from 'virtual-dom/create-element'
const vdom_to_json = vdom_as_json.toJson
const vdom_from_json = vdom_as_json.fromJson

// COMMON IMPORTS
import {is_browser/*, is_server*/} from '../utils/is_browser'
import uid from '../utils/uid'


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
	 * 		->add_result(arg_result, arg_merge_vnodes=true):nothing - merge RenderingResult instances.
	 * 
	 * 		->add_html(arg_tag_id, arg_html):nothing - take Html text and convert it to a virtual tree.
	 * 		->add_vtree(arg_tag_id, arg_vtree):nothing - add a virtual tree.
	 * 		->remove_vtree(arg_tag_id):nothing - remove a virtual tree.
	 * 
	 * 		->get_vtree_json(arg_tag_id):VTree - get an existing VTree as Json.
	 * 		->get_vtree(arg_id):VTree - get an existing VTree instance.
	 * 		->get_html(arg_id)
	 * 		
	 * 		->get_final_vtree(arg_final_id, arg_parent_result):VNode - get final VTree.
	 * 		->get_final_html(arg_final_id, arg_parent_result):string - get Html code for an existing vtree.
	 * 
	 * 		->set_headers(arg_headers)
	 * 
	 * 		->add_head_scripts_urls(arg_urls)
	 * 		->add_head_scripts_tags(arg_tags)
	 * 
	 * 		->add_body_scripts_urls(arg_urls)
	 * 		->add_body_scripts_tags(arg_tags)
	 * 
	 * 		->add_head_styles_urls(arg_tags)
	 * 		->add_head_styles_tags(arg_tags)
	 * 
     * @returns {nothing}
	 */
	constructor()
	{
		this.is_rendering_result = true

		this.uid = 'RR_' + uid()
		this.vtrees = {}

		this.headers = []

		this.head_scripts_urls = []
		this.head_scripts_tags = []
		this.body_scripts_urls = []
		this.body_scripts_tags = []

		this.head_styles_urls = []
		this.head_styles_tags = []
		this.body_styles_urls = []
		this.body_styles_tags = []

		this.head_links_urls = []
	}



	/**
	 * Merge RenderingResult instances.
	 * 
	 * @param {RenderingResult} arg_result - rendering result to add to this result.
	 * @param {boolean} arg_merge_vnodes - flag to merge or not vnodes (default:true) (optional)
	 * 
	 * @returns {nothing}
	 */
	add_result(arg_result, arg_merge_vnodes=true)
	{
		// console.log(context + ':add_result [' + this.uid + ']:merge=' + (arg_merge_vnodes ? 'y' : 'n'), this.body_scripts_urls.length, arg_result.body_scripts_urls.length)

		if (arg_merge_vnodes)
		{
			this.vtrees = Object.assign(this.vtrees, arg_result.vtrees)
		}
		
		const asset_compare = _.isEqual

		this.head_scripts_urls = _.uniqWith( _.concat(this.head_scripts_urls, arg_result.head_scripts_urls), asset_compare )
		this.head_scripts_tags = _.uniqWith( _.concat(this.head_scripts_tags, arg_result.head_scripts_tags), asset_compare )
		this.body_scripts_urls = _.uniqWith( _.concat(this.body_scripts_urls, arg_result.body_scripts_urls), asset_compare )
		this.body_scripts_tags = _.uniqWith( _.concat(this.body_scripts_tags, arg_result.body_scripts_tags), asset_compare )

		this.head_styles_urls  = _.uniqWith( _.concat(this.head_styles_urls,  arg_result.head_styles_urls),  asset_compare )
		this.head_styles_tags  = _.uniqWith( _.concat(this.head_styles_tags,  arg_result.head_styles_tags),  asset_compare )
		this.body_styles_urls  = _.uniqWith( _.concat(this.body_styles_urls,  arg_result.body_styles_urls),  asset_compare )
		this.body_styles_tags  = _.uniqWith( _.concat(this.body_styles_tags,  arg_result.body_styles_tags),  asset_compare )

		this.head_links_urls   = _.uniqWith( _.concat(this.head_links_urls,   arg_result.head_links_urls),   asset_compare )
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
		assert( T.isString(arg_tag_id) && arg_tag_id.length > 0, context + ':add_html:bad tag id string')
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
	 * Remove a VTree instance.
	 * 
	 * @param {string} arg_tag_id - tag id string.
	 * 
	 * @returns {nothing}.
	 */
	remove_vtree(arg_tag_id)
	{
		assert( T.isString(arg_tag_id) && arg_tag_id.length > 0, context + ':add_vtree:bad tag id string')
		delete this.vtrees[arg_tag_id]
	}



	/**
	 * Convert all VNode to json objects.
	 * 
	 * @returns {RenderingResult}
	 */
	convert_to_json()
	{
		let i = 0
		const keys = Object.keys(this.vtrees)
		const l = keys.length
		for( ; i < l ; i++)
		{
			const key = keys[i]
			this.vtrees[key] = vdom_to_json( this.vtrees[key] ) 
		}
		return this
	}



	/**
	 * Convert all VNode to json objects.
	 * 
	 * @returns {RenderingResult}
	 */
	convert_from_json()
	{
		let i = 0
		const keys = Object.keys(this.vtrees)
		const l = keys.length
		for( ; i < l ; i++)
		{
			const key = keys[i]
			this.vtrees[key] = vdom_from_json( this.vtrees[key] ) 
		}
		return this
	}



	/**
	 * Get an existing VTree as Json.
	 * 
	 * @param {string} arg_tag_id - tag id string.
	 * @param {VNode} arg_vtree - virtual-dom virtual tree.
	 * 
	 * @returns {nothing}.
	 */
	get_vtree_json(arg_tag_id)
	{
		const vtree = this.get_vtree(arg_tag_id)
		if (vtree)
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
	 * Get final VTree.
	 * 
	 * @param {string|undefined} arg_final_id - final tree id (optional).
	 * @param {RenderingResult} arg_parent_result - parent result to merge assets into (optional).
	 * 
	 * @returns {VNode}
	 */
	get_final_vtree(arg_final_id, arg_parent_result)
	{
		// MERGE THIS ASSETS INTO PARENT RESULT ASSETS
		if ( T.isObject(arg_parent_result) && arg_parent_result.is_rendering_result)
		{
			arg_parent_result.add_result(this, false)
		}

		// NO VNODE
		const size = _.size(this.vtrees)
		if (size == 0)
		{
			return new VText('')
		}

		// ONLY ONE VNODE
		if (size == 1)
		{
			const trees = _.toArray(this.vtrees)
			return trees[0]
		}

		// MANY VNODES
		const settings = T.isString(arg_final_id) ? { id:arg_final_id } : undefined
		return new VNode('DIV', settings, _.toArray(this.vtrees), 'id', undefined)
	}



	/**
	 * Get Html code for an existing vtree.
	 * 
	 * @param {string|undefined} arg_final_id - final tree id (optional).
	 * @param {RenderingResult} arg_parent_result - parent result to merge assets into (optional).
	 * 
	 * @returns {string}
	 */
	get_final_html(arg_final_id, arg_parent_result)
	{
		const vtree = this.get_final_vtree(arg_final_id, arg_parent_result)
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
	 * Add header scripts urls.
	 * 
	 * @param {array} arg_urls - scripts urls strings array.
	 * 
	 * @returns {nothing}.
	 */
	add_head_scripts_urls(arg_urls=[])
	{
		assert( T.isArray(arg_urls), context + ':add_head_scripts_urls:bad head scripts urls array')
		this.head_scripts_urls = _.concat(this.head_scripts_urls, arg_urls)
	}



	/**
	 * Add header scripts tags.
	 * 
	 * @param {array} arg_tags - scripts tags strings array.
	 * 
	 * @returns {nothing}.
	 */
	add_head_scripts_tags(arg_tag=[])
	{
		assert( T.isArray(arg_tags), context + ':add_head_scripts_tags:bad head scripts tags array')
		this.head_scripts_tags = _.concat(this.head_scripts_tag, arg_tags)
	}



	/**
	 * Add body scripts urls.
	 * 
	 * @param {array} arg_urls - scripts urls strings array.
	 * 
	 * @returns {nothing}.
	 */
	add_body_scripts_urls(arg_urls=[])
	{
		assert( T.isArray(arg_urls), context + ':add_body_scripts_urls:bad body scripts urls array')
		this.body_scripts_urls = _.concat(this.body_scripts_urls, arg_urls)
	}



	/**
	 * Add body scripts tags.
	 * 
	 * @param {array} arg_tags - scripts tags strings array.
	 * 
	 * @returns {nothing}.
	 */
	add_body_scripts_tags(arg_tags=[])
	{
		assert( T.isArray(arg_tags), context + ':add_body_scripts_tags:bad body scripts tags array')
		this.body_scripts_tags = _.concat(this.body_scripts_tags, arg_tags)
	}



	/**
	 * Add header styles urls.
	 * 
	 * @param {array} arg_urls - styles urls strings array.
	 * 
	 * @returns {nothing}.
	 */
	add_head_styles_urls(arg_urls=[])
	{
		assert( T.isArray(arg_urls), context + ':add_head_styles_urls:bad head styles urls array')
		this.head_styles_urls = _.concat(this.head_styles_urls, arg_urls)
	}



	/**
	 * Add header styles tags.
	 * 
	 * @param {array} arg_tags - styles tags strings array.
	 * 
	 * @returns {nothing}.
	 */
	add_head_styles_tags(arg_tags=[])
	{
		assert( T.isArray(arg_tags), context + ':add_head_styles_tags:bad head styles tags array')
		this.head_styles_tags = _.concat(this.head_styles_tags, arg_tags)
	}
}


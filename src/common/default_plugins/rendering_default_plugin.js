// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import RenderingPlugin from '../plugins/rendering_plugin'
import * as DefaultRendering from '../rendering/index'


const context = 'common/default_plugins/rendering_default_plugin'



/**
 * Plugin class for default rendering_plugin.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DefaultPlugin extends RenderingPlugin
{
	constructor(arg_runtime, arg_manager)
	{
		super(arg_runtime, arg_manager, 'default', '1.0.0')
	}
	
	
	has(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':has:bad class string')
		
		switch(arg_class_name)
		{
			// SPECIAL CASE, NOT RENDERING FUNCTIONS
			case 'rendering_normalize':
			case 'RenderingResult':
			case 'rendering_factory':
			
			// RENDERING FUNCTIONS
			case 'container':
			case 'button':
			case 'label':
			case 'anchor':
			case 'image':
			case 'inputfield':
			case 'input':
			case 'input-field':
			case 'list':
			case 'table':
			case 'recordstable':
			case 'script':
			case 'menubar':
			case 'page':
			case 'page_content':
			case 'tabs':
			case 'tree':
			case 'tabletree':
			case 'hbox':
			case 'vbox':
				return true
		}
		
		return false
	}
	

	
	/**
	 * Find a rendering function.
	 * @static
	 * 
	 * @param {string} arg_type - rendering item type.
	 * 
	 * @returns {Function} - rendering function.
	 */
	static find_rendering_function(arg_type)
	{
		if ( ! T.isString(arg_type) )
		{
			return undefined
		}
		
		switch(arg_type.toLocaleLowerCase())
		{
			// SPECIAL CASE, NOT RENDERING FUNCTIONS
			case 'rendering_normalize':
				return DefaultRendering.rendering_normalize

			case 'RenderingResult':
				return DefaultRendering.RenderingResult

			case 'rendering_factory':
				return DefaultRendering.rendering_factory
			
			// RENDERING FUNCTIONS
			case 'container':
				return DefaultRendering.container

			case 'button':
				return DefaultRendering.button
			
			case 'label':
				return DefaultRendering.label
			
			case 'anchor':
				return DefaultRendering.anchor
			
			case 'image':
				return DefaultRendering.image
			
			case 'inputfield':
			case 'input':
			case 'input-field':
				return DefaultRendering.input_field

			case 'list':
				return DefaultRendering.list
			
			case 'table':
			case 'recordstable':
				return DefaultRendering.table
			
			case 'script':
				return DefaultRendering.script
			
			case 'menubar':
				return DefaultRendering.menubar
			
			case 'page':
				return DefaultRendering.page
			
			case 'page_content':
				return DefaultRendering.page_content
			
			case 'tabs':
				return DefaultRendering.tabs
			
			case 'tree':
				return DefaultRendering.tree

			case 'tabletree':
				return DefaultRendering.tabletree

			case 'hbox':
				return DefaultRendering.hbox
			
			case 'vbox':
				return DefaultRendering.vbox
		}

		return undefined
	}
}

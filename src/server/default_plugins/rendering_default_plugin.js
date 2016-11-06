// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import RenderingPlugin from '../plugins/rendering_plugin'
import * as DefaultComponents from '../rendering/default/index'
import * as DefaultRendering from '../../common/rendering/index'


const context = 'server/default_plugins/rendering_default_plugin'



/**
 * Plugin class for default rendering_plugin.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DefaultPlugin extends RenderingPlugin
{
	constructor(arg_manager)
	{
		super(arg_manager, 'default', '1.0.0')
	}
	
	
	// create(arg_class_name, arg_name, arg_settings, arg_state)
	// {
	// 	assert( T.isString(arg_class_name), context + ':create:bad class string')
		
	// 	const component_class = DefaultPlugin.get_class(arg_class_name)
	// 	if (component_class)
	// 	{
	// 		return new component_class(arg_name, arg_settings, arg_state)
	// 	}
		
	// 	assert(false, context + ':create:bad class name')
	// 	return undefined
	// }
	
    
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
     */
	// get_feature_class(arg_class_name)
	// {
	// 	assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
	// 	return DefaultPlugin.get_class(arg_class_name)
	// }
	
	
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
	 */
/*	static get_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		switch(arg_class_name)
		{
			case 'Button': return DefaultComponents.Button
			case 'InputField': return DefaultComponents.InputField
			case 'Tree':   return DefaultComponents.Tree
			case 'TableTree':   return DefaultComponents.TableTree
			case 'HBox':   return DefaultComponents.HBox
			case 'VBox':   return DefaultComponents.VBox
			case 'List':   return DefaultComponents.List
			case 'Table':  return DefaultComponents.Table
			case 'Page':   return DefaultComponents.Page
			case 'Script': return DefaultComponents.Script
			case 'Menubar': return DefaultComponents.Menubar
			
			case 'Container':  return DefaultComponents.Container
			case 'Tabs':  return DefaultComponents.Tabs
		}
		
		assert(false, context + ':bad class name')
		return undefined
	}
	
	
	has(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':has:bad class string')
		
		switch(arg_class_name)
		{
			case 'Button':
			case 'InputField':
			case 'List':
			case 'Table':
			case 'Script':
			case 'Menubar':
			
			case 'Container':
			case 'Page':
			case 'Tabs':
			case 'Tree':
			case 'TableTree':
			case 'HBox':
			case 'VBox':
				return true
		}
		
		return false
	}*/
	

	
	/**
	 * Find a rendering function.
	 * 
	 * @param {string} arg_type - rendering item type.
	 * 
	 * @returns {Function} - rendering function.
	 */
	find_rendering_function(arg_type)
	{
		if ( ! T.isString(arg_type) )
		{
			return undefined
		}
		
		switch(arg_type.toLocaleLowerCase())
		{
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
				return DefaultRendering.table
			
			case 'script':
				return DefaultRendering.script
			
			case 'menubar':
				return DefaultRendering.menubar
			
			// case 'page':
			// case 'tabs':
			// case 'tree':
			// case 'tabletree':

			case 'hbox':
				return DefaultRendering.hbox
			
			case 'vbox':	
				return DefaultRendering.vbox
		}

		return undefined
	}
}

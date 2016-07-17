
import T from 'typr'
import assert from 'assert'

import RenderingPlugin from '../../common/plugins/rendering_plugin'

import * as DefaultComponents from '../../common/rendering/default/index'

const context = 'plugins/default/rendering_default_plugin'



export default class DefaultPlugin extends RenderingPlugin
{
	constructor(arg_manager)
	{
		super(arg_manager, 'default', '1.0.0')
	}
	
	
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':create:bad class string')
		
		const component_class = DefaultPlugin.get_class(arg_class_name)
		if (component_class)
		{
			return new component_class(arg_name, arg_settings, arg_state)
		}
		/*
		switch(arg_class_name)
		{
			case 'Button': return new DefaultComponents.Button(arg_name, arg_settings, arg_state)
			case 'Tree':   return new DefaultComponents.Tree(arg_name, arg_settings, arg_state)
			case 'HBox':   return new DefaultComponents.HBox(arg_name, arg_settings, arg_state)
			case 'VBox':   return new DefaultComponents.VBox(arg_name, arg_settings, arg_state)
			case 'List':   return new DefaultComponents.List(arg_name, arg_settings, arg_state)
			case 'Table':  return new DefaultComponents.Table(arg_name, arg_settings, arg_state)
			case 'Page':   return new DefaultComponents.Page(arg_name, arg_settings, arg_state)
			case 'Script': return new DefaultComponents.Script(arg_name, arg_settings, arg_state)
			case 'Menubar': return new DefaultComponents.Menubar(arg_name, arg_settings, arg_state)
		}*/
		
		assert(false, context + ':create:bad class name')
		return undefined
	}
	
    
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		return DefaultPlugin.get_class(arg_class_name)
	}
	
	
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
	 */
	static get_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		switch(arg_class_name)
		{
			case 'Button': return DefaultComponents.Button
			case 'InputField': return DefaultComponents.InputField
			case 'Tree':   return DefaultComponents.Tree
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
			case 'HBox':
			case 'VBox':
				return true
		}
		
		return false
	}
}

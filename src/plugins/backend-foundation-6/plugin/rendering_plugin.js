
import T from 'typr'
import assert from 'assert'

import RenderingPlugin from '../../../common/rendering/base/rendering_plugin'

// import Button from './button'
import Tree from './tree'
// import HBox from './hbox'
// import VBox from './vbox'
// import List from './list'
import Table from './table'
// import Page from './page'
// import Script from './script'
import Menubar from './menubar'


const context = 'common/rendering/foundation6/rendering_plugin'



export default class Foundation6Plugin extends RenderingPlugin
{
	constructor()
	{
		super('Foundation-6', '1.0.0')
        // console.log('Foundation6Plugin')
	}
	
	
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':bad class string')
		
		switch(arg_class_name)
		{
			// case 'Button': return new Button(arg_name, arg_settings, arg_state)
			case 'Tree':   return new Tree(arg_name, arg_settings, arg_state)
			// case 'HBox':   return new HBox(arg_name, arg_settings, arg_state)
			// case 'VBox':   return new VBox(arg_name, arg_settings, arg_state)
			// case 'List':   return new List(arg_name, arg_settings, arg_state)
			case 'Table':  return new Table(arg_name, arg_settings, arg_state)
			// case 'Page':   return new Page(arg_name, arg_settings, arg_state)
			// case 'Script': return new Script(arg_name, arg_settings, arg_state)
			case 'Menubar': return new Menubar(arg_name, arg_settings, arg_state)
		}
		
		assert(false, context + ':bad class name')
		return undefined
	}
	
	
	has(arg_class_name)
	{
		switch(arg_class_name)
		{
			// case 'Button':
			case 'Tree':
			// case 'HBox':
			// case 'VBox':
			// case 'List':
			case 'Table':
			// case 'Page':
			// case 'Script':
			case 'Menubar':
				return true
		}
		
		return false
	}
}

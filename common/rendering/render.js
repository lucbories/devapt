
import T from 'typr'
import assert from 'assert'

import RenderStack from './base/render_stack'
import RenderingManager from './base/rendering_manager'


const context = 'common/rendering/render'



export default class Render
{
	constructor()
	{
		this.stack = new RenderStack()
		this.rendering_manager = new RenderingManager()
	}
	
	
	up()
	{
		this.stack.leave()
		return this
	}
	
	
	push(arg_component)
	{
		this.stack.enter(arg_component)
		return this
	}
	
	
	current()
	{
		return this.stack.current()
	}
	
	
	page(arg_name, arg_settings)
	{
		let component = this.rendering_manager.create('Page', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Page component object')
		
		this.push(component)
		
		return this
	}
	
	
	button(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Button', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Button component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	tree(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Tree', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Tree component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	hbox(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('HBox', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad HBox component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	vbox(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('VBox', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad VBox component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	list(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('List', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad List component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	table(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Table', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Table component object')
		
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	script(arg_name, arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create('Script', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Script component object')
		
		this.current().add_child(component)
		this.push(component)
		// this.up()
		
		return this
	}
	
	
	render()
	{
		if (! this.current())
		{
			return null
		}
		
		console.log('render ' + (this.current().get_type()) )
		return this.current().render()
	}
}

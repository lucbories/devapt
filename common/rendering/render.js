
import T from 'typr'
import assert from 'assert'

import RenderStack from '../base/render_stack'
import Tree from '../default/tree'
import HBox from '../default/hbox'
import Table from '../default/table'
import Page from '../default/page'



export default class Render
{
	constructor()
	{
		this.stack = new RenderStack()
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
	
	
	page(arg_settings)
	{
		let component = new Page(arg_settings)
		this.push(component)
		
		return this
	}
	
	
	tree(arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = new Tree(arg_settings)
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	hbox(arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = new HBox(arg_settings)
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	table(arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = new Table(arg_settings)
		this.current().add_child(component)
		this.push(component)
		
		return this
	}
	
	
	render()
	{
		if (! this.current())
		{
			return null
		}
		
		console.log('render ' + (this.current().get_type()) )
		return this.current()).render()
	}
}

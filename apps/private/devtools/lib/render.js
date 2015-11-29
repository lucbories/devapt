
import T from 'typr'
import assert from 'assert'

import Tree from '../lib/tree'
import HBox from '../lib/hbox'
import Table from '../lib/table'
import Page from '../lib/page'



export default class Render
{
	constructor()
	{
		this.current_component = null
		this.stack = []
	}
	
	
	pop()
	{
		console.log(this.stack.length, 'before shift')
		this.stack.pop()
		console.log(this.stack.length, 'after shift')
		return this.stack.length > 0 ? this.stack[this.stack.length -1] : null
	}
	
	
	push(arg_component)
	{
		console.log('before push ' + (this.current_component ? this.current_component.$type : 'empty') )
		this.stack.push(arg_component)
		this.current_component = arg_component
		console.log('after push ' + (this.current_component.$type) )
	}
	
	
	up()
	{
		console.log('before up ' + (this.current_component ? this.current_component.$type : 'empty') )
		this.current_component = this.pop()
		console.log('after up ' + (this.current_component.$type) )
		return this
	}
	
	
	current()
	{
		return this.current_component
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
		this.current_component.add_child(component)
		this.push(component)
		
		return this
	}
	
	
	hbox(arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = new HBox(arg_settings)
		this.current_component.add_child(component)
		this.push(component)
		
		return this
	}
	
	
	table(arg_settings, arg_state)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = new Table(arg_settings)
		this.current_component.add_child(component)
		this.push(component)
		
		return this
	}
	
	
	render()
	{
		if (! this.current_component)
		{
			return null
		}
		
		console.log('render ' + (this.current_component.$type) )
		return this.current_component.render()
	}
}

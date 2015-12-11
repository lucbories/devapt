
import T from 'typr'
import assert from 'assert'


const context = 'common/rendering/base/render_stack'


export default class RenderStack
{
	constructor()
	{
		this.has_trace = true
		this.stack = []
		this.components = {}
	}
	
	
	trace(...args)
	{
		if (this.has_trace)
		{
			console.log(args)
		}
	}
	
	
	register(arg_component)
	{
		assert( T.isObject(arg_component) && arg_component.is_component, context + ':bad component object')
		
		const name = arg_component.get_name()
		this.components[name] = arg_component
	}
	
	
	pop()
	{
		let current_component = this.current()
		
		this.trace('before pop (' + this.stack.length + ') ' + (current_component ? current_component.get_type() : 'empty') )
		this.stack.pop()
		this.trace('after pop (' + this.stack.length + ') ' + (current_component ? current_component.get_type() : 'empty') )
		
		return this.stack.length > 0 ? this.stack[this.stack.length -1] : null
	}
	
	
	push(arg_component)
	{
		let current_component = this.current()
		
		this.trace('before push (' + this.stack.length + ') ' + (current_component ? current_component.get_type() : 'empty') )
		this.stack.push(arg_component)
		this.trace('after push ' + (this.current().get_type()) )
		
		return this
	}
	
	
	enter(arg_value)
	{
		let current_component = this.current()
		
		this.trace('before enter (' + this.stack.length + ') ' + (current_component ? current_component.get_type() : 'empty') )
		
		// GET TARGET COMPONENT
		let target_component = (T.isObject(arg_value) && arg_value.is_component) ? arg_value : null
		if ( T.isString(arg_value) )
		{
			target_component = (arg_value in this.components) ? this.components[arg_value] : null
		}
		assert( T.isObject(target_component) && target_component.is_component, context + ':bad component object')
		
		// REGISTER TARGET COMPONENT IF NEEDED
		if ( ! (arg_value in this.components) )
		{
			this.components[target_component.get_name()] = target_component
		}
		
		// PUSH ON STACK
		this.push(target_component)
		
		this.trace('after enter ' + (this.current().get_type()) )
		
		return this
	}
	
	leave()
	{
		this.pop()
		return this
	}
	
	
	current()
	{
		return this.stack.length > 0 ? this.stack[this.stack.length -1] : null
	}
}

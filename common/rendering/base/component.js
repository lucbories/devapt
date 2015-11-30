
import T from 'typr'
import assert from 'assert'

import Instance from './instance'


const context = 'common/rendering/base/component'



export default class Component extends Instance
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super('components', 'Component', arg_name, {}, arg_context ? arg_context : context)
		
		this.dom_node = null
		this.dom_is_rendered_on_node = false
		
		this.$settings = {}
		if ( T.isFunction(this.get_default_settings) )
		{
			this.$settings = this.get_default_settings()
		}
		
		if ( T.isFunction(this.get_initial_state) )
		{
			this.state = this.get_initial_state()
		}
		
		this.update_settings(arg_settings)
	}
	
	
	add_child(arg_child)
	{
		if ( ! T.isArray(this.$settings.children) )
		{
			this.$settings.children = []
		}
		
		this.$settings.children.push(arg_child)
	}
	
	
	// READONLY INITIAL SETTINGS
	set_settings(arg_settings)
	{
		this.$settings = arg_settings
		
		if ( T.isObject(this.$settings) && T.isObject(this.$settings.state) )
		{
			this.update_state(this.$settings.state)
		}
	}
	
	update_settings(arg_settings)
	{
		assert( T.isObject(this.$settings), context + ':update_settings:bad settings object')
		assert( T.isObject(arg_settings), context + ':update_settings:bad new settings object')
		
		this.$settings = Object.assign(this.$settings, arg_settings)
		
		if ( T.isObject(this.$settings) && T.isObject(this.$settings.state) )
		{
			this.update_state(this.$settings.state)
		}
	}
	
	get_settings()
	{
		return this.$settings
	}
	
	// get_default_settings()
	// {
	// 	return this.$settings
	// }
	
	
	// MUTABLE STATE
	
	// REPLACE CURRENT STATE WITH NEW STATE AND UPDATE UI
	set_state(arg_new_state)
	{
		assert( T.isObject(arg_new_state), context + ':set_state:bad new state object')
		
		this.state = arg_new_state
	}
	
	// MERGE CURRENT STATE WITH NEW STATE AND UPDATE UI
	update_state(arg_new_state)
	{
		assert( T.isObject(this.state), context + ':update_state:bad state object')
		assert( T.isObject(arg_new_state), context + ':update_state:bad new state object')
		
		this.state = Object.assign(this.state, arg_new_state)
	}
	
	get_state()
	{
		return this.state
	}
	
	// get_initial_state()
	// {
	// 	return {}
	// }
	
	
	// RENDERING
	
	render()
	{
	}
	
	get_dom_node()
	{
		return this.dom_node
	}
	
	is_rendered_on_dom()
	{
		return !!this.dom_node && this.dom_is_rendered_on_node
	}
	
	get_headers()
	{
		return T.isArray(this.$settings.page_headers) ? this.$settings.page_headers : []
	}
	
	get_styles()
	{
		return T.isArray(this.$settings.page_styles) ? this.$settings.page_styles : []
	}
	
	get_scripts()
	{
		return T.isArray(this.$settings.page_scripts) ? this.$settings.page_scripts : []
	}
	
	get_scripts_urls()
	{
		return T.isArray(this.$settings.page_scripts_urls) ? this.$settings.page_scripts_urls : []
	}
}

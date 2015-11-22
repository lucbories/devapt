
import T from 'typr'
import assert from 'assert'


const context = 'apps/devtools/lib/component'


export default class Component
{
	constructor(arg_settings)
	{
		this.dom_node = null
		this.dom_is_rendered_on_node = false
		
		this.settings = {}
		if ( T.isFunction(this.get_default_settings) )
		{
			this.settings = this.get_default_settings()
		}
		
		if ( T.isFunction(this.get_initial_state) )
		{
			this.state = this.get_initial_state()
		}
		
		this.update_settings(arg_settings)
	}
	
	
	// READONLY INITIAL SETTINGS
	set_settings(arg_settings)
	{
		this.settings = arg_settings
		
		if ( T.isObject(this.settings) && T.isObject(this.settings.state) )
		{
			this.update_state(this.settings.state)
		}
	}
	
	update_settings(arg_settings)
	{
		assert( T.isObject(this.settings), context + ':update_settings:bad settings object')
		assert( T.isObject(arg_settings), context + ':update_settings:bad new settings object')
		
		this.settings = Object.assign(this.settings, arg_settings)
		
		if ( T.isObject(this.settings) && T.isObject(this.settings.state) )
		{
			this.update_state(this.settings.state)
		}
	}
	
	get_settings()
	{
		return this.settings
	}
	
	// get_default_settings()
	// {
	// 	return this.settings
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
		return T.isArray(this.settings.page_headers) ? this.settings.page_headers : []
	}
	
	get_styles()
	{
		return T.isArray(this.settings.page_styles) ? this.settings.page_styles : []
	}
	
	get_scripts()
	{
		return T.isArray(this.settings.page_scripts) ? this.settings.page_scripts : []
	}
	
	get_scripts_urls()
	{
		return T.isArray(this.settings.page_scripts_urls) ? this.settings.page_scripts_urls : []
	}
}

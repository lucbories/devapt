// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import runtime from '../../base/runtime'


const context = 'common/rendering/base/factory'



const get_component = (arg_name,) => {
	assert( T.isString(arg_name), context + ':get_component:bad name string')
	
	const mgr = runtime.get_plugins_factory().get_rendering_manager()
	return mgr.get_instance(arg_name)
}



const get_or_create_component = (arg_name, arg_renderer=undefined) => {
	assert( T.isString(arg_name), context + ':get_or_create_component:bad name string')
	
	const mgr = runtime.get_plugins_factory().get_rendering_manager()
	
	if (mgr.has_instance(arg_name))
	{
		// console.log(context + ':get_or_create_component:existing instance name=%s', arg_name)
		return mgr.get_instance(arg_name)
	}
	
	assert( T.isObject(arg_renderer) && arg_renderer.is_render, context + ':get_or_create_component:bad render object')
	
	const defined_resource = arg_renderer.application.find_resource(arg_name)
	if (defined_resource)
	{
		const settings = defined_resource.export_settings()
		const class_name = settings.class_name
		const state = settings.state ? settings.state : {}
		
		settings.renderer = arg_renderer

		return mgr.create(class_name, arg_name, settings, state)
	}
	
	console.error(context + ':get_or_create_component:unknow instance/settings name=%s', arg_name)
	return undefined
}



const has_component = (arg_name, arg_defined_application) => {
	assert( T.isString(arg_name), context + ':has_component:bad name string')
	
	const mgr = runtime.get_plugins_factory().get_rendering_manager()
	return mgr.has_instance(arg_name)
}


const add_component = (arg_component) => {
	assert( T.isObject(arg_component) && arg_component.is_component, context + ':add_component:bad component object')
	
	const mgr = runtime.get_plugins_factory().get_rendering_manager()
	mgr.add_instance(arg_component)
}


const create_component = (arg_settings) => {
	assert( T.isObject(arg_settings), context + 'create_component:bad settings object')
	assert( T.isString(arg_settings.name), context + 'create_component:bad settings name string')
	assert( T.isString(arg_settings.type), context + 'create_component:bad settings type string')
	
	const mgr = runtime.get_plugins_factory().get_rendering_manager()
	const name = arg_settings. name
	const class_name = arg_settings.type
	const settings = arg_settings
	
	return mgr.create(class_name, name, settings, {})
}


export {get_component, get_or_create_component, has_component, create_component, add_component}
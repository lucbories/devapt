
import T from 'typr'
import assert from 'assert'

import runtime from '../../base/runtime'
import {store} from '../../store'


const context = 'common/rendering/base/factory'



const get_component = (arg_name) => {
	assert( T.isString(arg_name), context + ':get_component:bad name string')
	
	const mgr = runtime.plugins_factory.rendering_manager
	return mgr.get_instance(arg_name)
}


const get_or_create_component = (arg_name) => {
	assert( T.isString(arg_name), context + ':get_or_create_component:bad name string')
	
	const mgr = runtime.plugins_factory.rendering_manager
	
	if (mgr.has_instance(arg_name))
	{
		// console.log(context + ':get_or_create_component:existing instance name=%s', arg_name)
		return mgr.get_instance(arg_name)
	}
	
	if ( store.has_resource(arg_name) )
	{
		// console.log(context + ':get_or_create_component:existing settings name=%s', arg_name)
		
		const settings = store.get_resource(arg_name)
		const class_name = settings.class_name
		const state = settings.state ? settings.state : {}
		
		// console.log(context + ':get_or_create_component:class_name=%s name=%s', class_name, arg_name, settings)
		
		return mgr.create(class_name, arg_name, settings, state)
	}
	
	console.error(context + ':get_or_create_component:unknow instance/settings name=%s', arg_name)
	return undefined
}


const has_component = (arg_name) => {
	assert( T.isString(arg_name), context + ':has_component:bad name string')
	
	const mgr = runtime.plugins_factory.rendering_manager
	return mgr.has_instance(arg_name)
}


const add_component = (arg_component) => {
	assert( T.isObject(arg_component) && arg_component.is_component, context + ':add_component:bad component object')
	
	const mgr = runtime.plugins_factory.rendering_manager
	mgr.add_instance(arg_component)
}


const create_component = (arg_settings) => {
	assert( T.isObject(arg_settings), context + 'create_component:bad settings object')
	assert( T.isString(arg_settings.name), context + 'create_component:bad settings name string')
	assert( T.isString(arg_settings.type), context + 'create_component:bad settings type string')
	
	const mgr = runtime.plugins_factory.rendering_manager
	const name = arg_settings. name
	const class_name = arg_settings.type
	const settings = arg_settings
	
	return mgr.create(class_name, name, settings, {})
}


export {get_component, get_or_create_component, has_component, create_component, add_component}
// import dispatch from 'redux'

import { create_action_creator } from '../create_action_creator'



export const STORE_CONFIG_SET_ALL      = 'STORE_CONFIG_SET_ALL'
export const STORE_CONFIG_GET_VALUE    = 'STORE_CONFIG_GET_VALUE'
export const STORE_CONFIG_UPDATE_VALUE = 'STORE_CONFIG_UPDATE_VALUE'
export const STORE_CONFIG_CREATE_VALUE = 'STORE_CONFIG_CREATE_VALUE'
export const STORE_CONFIG_REMOVE_VALUE = 'STORE_CONFIG_REMOVE_VALUE'


export const create_store_config_set_all      = create_action_creator(STORE_CONFIG_SET_ALL, 'config')
export const create_store_config_get_value    = create_action_creator(STORE_CONFIG_GET_VALUE, 'path')
export const create_store_config_update_value = create_action_creator(STORE_CONFIG_UPDATE_VALUE, 'path', 'value')
export const create_store_config_create_value = create_action_creator(STORE_CONFIG_CREATE_VALUE, 'path', 'value')
export const create_store_config_remove_value = create_action_creator(STORE_CONFIG_REMOVE_VALUE, 'path')


export const dispatch_store_config_set_all      = (arg_store, arg_config) => { return arg_store.dispatch( create_store_config_set_all(arg_config) ) }
export const dispatch_store_config_get_value    = (arg_store, arg_path)   => { return arg_store.dispatch( create_store_config_get_value(arg_path) ) }
export const dispatch_store_config_update_value = (arg_store, arg_path, arg_value) => { return arg_store.dispatch( create_store_config_update_value(arg_path, arg_value) ) }
export const dispatch_store_config_create_value = (arg_store, arg_path, arg_value) => { return arg_store.dispatch( create_store_config_create_value(arg_path, arg_value) ) }
export const dispatch_store_config_remove_value = (arg_store, arg_path) => { return arg_store.dispatch( create_store_config_remove_value(arg_path) ) }


/*
export const dispatch_store_config_get_value    = function(arg_path)
{
	console.log(arg_path, 'arg_path')
	let action = create_store_config_get_value(arg_path)
	console.log(action, 'action')
	
	console.log(dispatch, 'dispatch')
	return dispatch(action)
}
*/
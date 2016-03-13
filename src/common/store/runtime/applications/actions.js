import dispatch from 'redux'

import { create_action_creator } from '../../create_action_creator'



export const STORE_RUNTIME_APPS_CREATE  = 'STORE_RUNTIME_APPLICATIONS_CREATE'
export const STORE_RUNTIME_APPS_UPDATE  = 'STORE_RUNTIME_APPLICATIONS_UPDATE'
export const STORE_RUNTIME_APPS_DELETE  = 'STORE_RUNTIME_APPLICATIONS_DELETE'
export const STORE_RUNTIME_APPS_ENABLE  = 'STORE_RUNTIME_APPS_ENABLE'
export const STORE_RUNTIME_APPS_DISABLE = 'STORE_RUNTIME_APPS_DISABLE'


export const create_store_runtime_apps_create  = create_action_creator(STORE_RUNTIME_APPS_CREATE, 'name', 'config')
export const create_store_runtime_apps_update  = create_action_creator(STORE_RUNTIME_APPS_UPDATE, 'name', 'config')
export const create_store_runtime_apps_delete  = create_action_creator(STORE_RUNTIME_APPS_DELETE, 'name')
export const create_store_runtime_apps_enable  = create_action_creator(STORE_RUNTIME_APPS_ENABLE, 'name')
export const create_store_runtime_apps_disable = create_action_creator(STORE_RUNTIME_APPS_DISABLE, 'name')

export const dispatch_store_runtime_apps_create  = (arg_store, arg_name, arg_value) => { return arg_store.dispatch( create_store_runtime_apps_create(arg_name, arg_value) ) }
export const dispatch_store_runtime_apps_update  = (arg_store, arg_name, arg_value) => { return arg_store.dispatch( create_store_runtime_apps_update(arg_name, arg_value) ) }
export const dispatch_store_runtime_apps_delete  = (arg_store, arg_name)            => { return arg_store.dispatch( create_store_runtime_apps_delete(arg_name) ) }
export const dispatch_store_runtime_apps_enable  = (arg_store, arg_name)            => { return arg_store.dispatch( create_store_runtime_apps_enable(arg_name) ) }
export const dispatch_store_runtime_apps_disable = (arg_store, arg_name)            => { return arg_store.dispatch( create_store_runtime_apps_disable(arg_name) ) }

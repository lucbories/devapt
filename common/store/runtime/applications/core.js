
import * as core_server from './core_server'
import * as core_client from './core_client'



let is_server = true
let is_client = ! is_server

export const INITIAL_STATE = {};


export function app_create(state, arg_name, arg_config)
{
  return is_server ? core_server.app_create(state, arg_name, arg_config) : core_client.app_create(state, arg_name, arg_config)
}


export function app_update(state, arg_name, arg_config)
{
  return is_server ? core_server.app_update(state, arg_name, arg_config) : core_client.app_update(state, arg_name, arg_config)
}


export function app_delete(state, arg_name)
{
  return is_server ? core_server.app_delete(state, arg_name) : core_client.app_delete(state, arg_name)
}


export function app_enable(state, arg_name)
{
  return is_server ? core_server.app_enable(state, arg_name) : core_client.app_enable(state, arg_name)
}


export function app_disable(state, arg_name)
{
  return is_server ? core_server.app_disable(state, arg_name) : core_client.app_disable(state, arg_name)
}

import {List, Map, fromJS} from 'immutable'
import T from 'typr'

import logs from '../../../utils/logs'
import { store, config, runtime } from '../../../store/index'

import app_check_safe from './app_check'



let context = 'common/store/runtime/application/core_server'

let error_msg_bad_config    = 'bad config - config.apps.* should be a valid plain object'
let error_msg_app_not_found = 'application not found in store.config'
let error_msg_app_exists    = 'application already exists in store.runtime'


export function app_create(state, arg_name, arg_config = {})
{
  // CHECK GIVEN CONFIGURATION
  // let checked_config = app_check_safe(arg_config)
  // if (! checked_config)
  // {
  //   logs.error(context, error_msg_bad_config)
  //   console.log(arg_config, 'arg_config')
  //   return false;
  // }
  
  // CHECK IF APPLICATION EXISTS IN STORE.CONFIG
  if ( ! config.has_application(arg_name) )
  {
    logs.error(context, error_msg_app_not_found)
    console.log(arg_name, 'arg_name')
    console.log(config.get_applications(), 'config.get_applications()')
    return false
  }
  
  // CHECK IF APPLICATION ALREADY EXISTS IN STORE.RUNTIME
  if ( runtime.has_application(arg_name) )
  {
    logs.error(context, error_msg_app_exists)
    return false
  }
  
  // CREATE RUNTIME APPLICATION
  let merged_config = Object.assign({}, config.get_application(arg_name), arg_config)
  let checked_config = app_check_safe(merged_config) ? merged_config : null
  if (! checked_config)
  {
    return state
  }
  const immutable_config = fromJS(checked_config)
  const new_state = runtime().setIn(['runtime', 'applications', arg_name], immutable_config)
  
  // CREATE 
  
  return new_state
}


export function app_update(state, arg_name, arg_config)
{
  
}


export function app_delete(state, arg_name)
{
  
}


export function app_enable(state, arg_name)
{
  
}


export function app_disable(state, arg_name)
{
  
}

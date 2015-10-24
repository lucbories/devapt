import {List, Map, fromJS} from 'immutable'
import T from 'typr'

import load_runtime from '../../loaders/load_runtime'



let default_config = load_runtime({})
export const INITIAL_STATE = fromJS(default_config);


function get_path_array(arg_path)
{
  if ( T.isString(arg_path) )
  {
    arg_path = arg_path.split('.');
  }
  
  if ( T.isArray(arg_path) )
  {
    return arg_path.length > 0 ? arg_path : null;
  }
  
  return null;
}


export function set_all(state, arg_config)
{
  let checked_config = load_runtime({}, arg_config)
  if (checked_config.error)
  {
    return false;
  }
  
  const immutable_config = fromJS(checked_config);
  return state.set('runtime', immutable_config);
}


export function get_value(state, arg_path)
{
  const path = get_path_array(arg_path);
  return state.getIn(path);
}


export function update_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.updateIn(path, arg_value);
}


export function create_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.setIn(path, arg_value);
}


export function remove_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.deleteIn(path, arg_value);
}

import {List, Map, fromJS} from 'immutable'

import load_runtime from '../../loaders/load_runtime'



let default_config = load_runtime({})
export const INITIAL_STATE = fromJS(default_config);


function get_path_array(arg_path)
{
  if ( (typeof arg_path) === 'string' )
  {
    arg_path = arg_path.split('.');
  }
  
  if ( (typeof arg_path).toLocaleLowerCase() === 'object array' )
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
  return state.getIn(state.runtime, path);
}


export function update_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.updateIn(state.runtime, path, arg_value);
}


export function create_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.setIn(state.runtime, path, arg_value);
}


export function remove_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.deleteIn(state.runtime, path, arg_value);
}

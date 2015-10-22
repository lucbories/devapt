import {List, Map, fromJS} from 'immutable'
import load_config from '../../loaders/load_config'


let default_config = load_config({})
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
  const config = fromJS(arg_config);
  return state.set('config', config);
}


export function update_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.updateIn(state.config, path, arg_value);
}


export function create_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.setIn(state.config, path, arg_value);
}


export function remove_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.deleteIn(state.config, path, arg_value);
}

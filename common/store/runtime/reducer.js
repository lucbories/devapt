import { STORE_RUNTIME_SET_ALL, STORE_RUNTIME_GET_VALUE, STORE_RUNTIME_UPDATE_VALUE, STORE_RUNTIME_CREATE_VALUE, STORE_RUNTIME_REMOVE_VALUE } from './actions'
import { INITIAL_STATE, set_all, get_value, update_value, create_value, remove_value } from './core'


export function runtime_reducer(state = INITIAL_STATE, action)
{
  switch (action.type)
  {
    case STORE_RUNTIME_SET_ALL:
      return set_all(action.config);
    
    case STORE_RUNTIME_GET_VALUE:
      return get_value(action.path, action.value);
    
    case STORE_RUNTIME_UPDATE_VALUE:
      return update_value(action.path, action.value);
    
    case STORE_RUNTIME_CREATE_VALUE:
      return create_value(action.path, action.value);
    
    case STORE_RUNTIME_REMOVE_VALUE:
      return remove_value(action.path);
    
    default:
      return state;
  }
}

// import { create_store_config_set_all, create_store_config_update_value, create_store_config_create_value, create_store_config_remove_value } from './actions'
import { STORE_CONFIG_SET_ALL, STORE_CONFIG_UPDATE_VALUE, STORE_CONFIG_CREATE_VALUE, STORE_CONFIG_REMOVE_VALUE } from './actions'
import { INITIAL_STATE, set_all, update_value, create_value, remove_value } from '.core'


export function config_reducer(state = INITIAL_STATE, action)
{
  switch (action.type)
  {
    case STORE_CONFIG_SET_ALL:
      return set_all(action.config);
    
    case STORE_CONFIG_UPDATE_VALUE:
      return update_value(action.path, action.value);
    
    case STORE_CONFIG_CREATE_VALUE:
      return create_value(action.path, action.value);
    
    case STORE_CONFIG_REMOVE_VALUE:
      return remove_value(action.path);
    
    default:
      return state;
  }
}

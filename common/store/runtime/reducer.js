import { STORE_RUNTIME_SET_ALL, STORE_RUNTIME_GET_VALUE, STORE_RUNTIME_UPDATE_VALUE, STORE_RUNTIME_CREATE_VALUE, STORE_RUNTIME_REMOVE_VALUE } from './actions'
import { INITIAL_STATE, set_all, get_value, update_value, create_value, remove_value } from './core'
import * as app_actions from './applications/actions'
import * as app_core from './applications/core'



export function runtime_reducer(state = INITIAL_STATE, action)
{
  switch (action.type)
  {
    // RUNTIME ACTIONS
    case STORE_RUNTIME_SET_ALL:
      return set_all(state, action.config);
    
    case STORE_RUNTIME_GET_VALUE:
      return get_value(state, action.path);
    
    case STORE_RUNTIME_UPDATE_VALUE:
      return update_value(state, action.path, action.value);
    
    case STORE_RUNTIME_CREATE_VALUE:
      return create_value(state, action.path, action.value);
    
    case STORE_RUNTIME_REMOVE_VALUE:
      return remove_value(state, action.path);
    
    // RUNTIME APPLICATIONS ACTIONS
    case app_actions.STORE_RUNTIME_APPS_CREATE:
      return app_core.app_create(state, action.name, action.config);
    
    case app_actions.STORE_RUNTIME_APPS_UPDATE:
      return app_core.app_update(state, action.name, action.config);
    
    case app_actions.STORE_RUNTIME_APPS_DELETE:
      return app_core.app_delete(state, action.name);
    
    case app_actions.STORE_RUNTIME_APPS_ENABLE:
      return app_core.app_enable(state, action.name);
    
    case app_actions.STORE_RUNTIME_APPS_DISABLE:
      return app_core.app_disable(state, action.name);
    
    // DEFAULT
    default:
      return state;
  }
}

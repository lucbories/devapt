import { combineReducers } from 'redux';
import undoable from 'redux-undo'

import { config_reducer } from './config/reducer';
import { runtime_reducer } from './runtime/reducer';



const store_reducers = combineReducers(
  {
    config_reducer:  undoable(config_reducer,  { limit: 5 }),
    runtime_reducer: undoable(runtime_reducer, { limit: 5 })
  }
);

export default store_reducers;
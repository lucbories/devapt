import { combineReducers } from 'redux';

import { config_reducer } from './config/reducer';
import { runtime_reducer } from './runtime/reducer';



const store_reducers = combineReducers(
  {
    config_reducer,
    runtime_reducer
  }
);

export default store_reducers;
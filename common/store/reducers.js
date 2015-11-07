import { combineReducers } from 'redux';
import undoable from 'redux-undo'

import config_reducer from './config/reducer';
import runtime_reducer from './runtime/reducer';



// const store_reducers = combineReducers(config_reducer/*, runtime_reducer*/)
// console.log(config_reducer, 'config_reducer')
// console.log(runtime_reducer, 'runtime_reducer')

const store_reducers = combineReducers(
  {
    'config_reducer':  undoable(config_reducer,  { limit: 5 }),
    'runtime_reducer': runtime_reducer
  }
)
// console.log(store_reducers, 'store_reducers')

export default store_reducers
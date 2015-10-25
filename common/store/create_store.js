import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'

import store_reducers from './reducers'



let logger_settings = {
  logger:console,
  level:'log',
  transformer: (state) => {
    return {
      present:'hidden',
      config_past:state.config_reducer.past.length,
      config_future:state.config_reducer.future.length,
      runtime_past:state.runtime_reducer.past.length,
      runtime_future:state.runtime_reducer.future.length
    }
  }
}
let logger = createLogger(logger_settings)
const createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore)


export default function create_store(arg_initial_state)
{
  const store = createStoreWithMiddleware(store_reducers, arg_initial_state)
  
  
  // HOT MODULE REPLACEMENT OPT-IN
  if (module.hot)
  {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers',
      () => {
        const nextReducer = require('./reducers')
        store.replaceReducer(nextReducer)
      }
    )
  }

  return store
}

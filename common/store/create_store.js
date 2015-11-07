import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'

import store_reducers from './reducers'
// console.log(createStore.getState(), 'createStore')

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



// function createStoreWithMiddleware()
// {
  // return compose( applyMiddleware(thunk, promise, logger) )(createStore)
// }


// console.log(store_reducers, 'store_reducers')
// export default function create_store(arg_initial_state)
// {
//   return createStore(store_reducers, arg_initial_state)
// }

// let s=  createStore(store_reducers, {})
// let s=applyMiddleware(thunk, promise, logger)(createStore)
// Object.keys(s).forEach(
// 	(key) => {
// 		console.log(key, 's.key')
// 	}
// )

export default function create_store(arg_initial_state)
{
  // const store_fn = createStoreWithMiddleware(store_reducers, arg_initial_state)
  // console.log(store_fn.getState(), 'state')
  // return store_fn
  return createStore(store_reducers, arg_initial_state)
}


/* export default function create_store(arg_initial_state)
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
}*/

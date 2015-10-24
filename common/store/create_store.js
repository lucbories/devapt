import { createStore } from 'redux'

import store_reducers from './reducers'



export default function create_store()
{
  const store = createStore(store_reducers);
  
  
  // HOT MODULE REPLACEMENT OPT-IN
  if (module.hot)
  {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers',
      () => {
        const nextReducer = require('./reducers');
        store.replaceReducer(nextReducer);
      }
    );
  }

  return store
}

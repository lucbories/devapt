import { createStore } from 'redux'
import store_reducers from './reducers'


export default function makeStore()
{
  return createStore(store_reducers);
}
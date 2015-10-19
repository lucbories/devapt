import { createStore } from 'redux'
import store_reducers from './reducers'


export default function create_store()
{
  return createStore(store_reducers);
}
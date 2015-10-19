import {createStore} from 'redux';
import * from './reducers/*';

export default function makeStore() {
  return createStore(reducer);
}
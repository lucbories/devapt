import T from 'typr'

// import * as diff from '../utils/obj_diff';

import create_store from './create_store';



export const store = create_store();
// console.log(store, 'store')
// Object.keys(store).forEach(
// 	(key) => {
// 		console.log(key, 'key')
// 	}
// )
// store.getState()

export const config  = function() { return store.getState().config_reducer.present.get('config').toMap() }
export const runtime = function() { return store.getState().runtime_reducer.get('runtime').toMap() }
// console.log(config().keySeq().toArray(), 'config')
// console.log(runtime().keySeq().toArray(), 'runtime')


// INIT COLLECTIONS TYPES
store.collections         = ['servers', 'applications', 'modules', 'plugins', 'security', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
store.config_collections  = ['servers', 'applications', 'modules', 'plugins', 'security', 'services']
store.runtime_collections = ['servers', 'applications', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
store.has_collection      = function(arg_name) { return store.collections.indexOf(arg_name) > -1 }

export default { store, config, runtime }
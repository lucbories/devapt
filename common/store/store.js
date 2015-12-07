
import T from 'typr'

import create_store from './create_store';



export const store = create_store();
export const config  = function() { return store.getState().config_reducer.present.get('config').toMap() }
export const runtime = function() { return store.getState().runtime_reducer.get('runtime').toMap() }


// INIT COLLECTIONS TYPES
store.collections         = ['nodes', 'servers', 'applications', 'modules', 'plugins', 'resources', 'security', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
store.config_collections  = ['nodes', 'servers', 'applications', 'modules', 'plugins', 'security', 'services']
store.runtime_collections = ['nodes', 'servers', 'applications', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
store.has_collection      = function(arg_name) { return store.collections.indexOf(arg_name) > -1 }

export default { store, config, runtime }
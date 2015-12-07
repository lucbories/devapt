
import * as st from './store'
import * as decorated_config from './store_config'
import * as decorated_runtime from './store_runtime'



export const store = st.store
export const config = st.config
export const runtime = st.runtime

// console.log(store, 'store')
// console.log(config, 'config')
// console.log(runtime, 'runtime')

export default { store, config, runtime }

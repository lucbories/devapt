
import assert from 'assert'
import T from 'typr'

import logs from '../../../utils/logs'
import default_runtime from './default_runtime'


let context = 'common/store/runtime/loaders/load_runtime'
let error_msg_bad_config = context + ':bad config'



/**
 * Load the 'runtime' key of the final state
 * Pure function: (Plain Object) => (new Plain Object)
 */
function load_runtime(arg_state, arg_initial_config)
{
	logs.info(context, 'loading runtime');
	
	
	// CHECK RUNTIME
	try{
		// GET CONFIG JSON
		let config = arg_initial_config || default_runtime.runtime
		
		// CHECK CONFIG PARTS
		assert(T.isObject(config), 'runtime config should be a plain object')
		arg_state.runtime = config;
	}
	catch(e)
	{
		arg_state.runtime = { error: e }
	}
	
	return arg_state
}

export default load_runtime

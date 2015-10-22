
import assert from 'assert'
import T from 'typr'

import logs from '../utils/logs'


let context = 'common/loaders/load_runtime'
let error_msg_bad_config = context + ':bad config'



/**
 * Load the 'runtime' key of the final state
 * Pure function: (Plain Object) => (new Plain Object)
 */
function load_runtime(arg_state)
{
	logs.info(context, 'loading runtime');
	
	
	// CHECK RUNTIME
	try{
		
	}
	catch(e)
	{
		arg_state.config = { error: e }
	}
	
	return arg_state
}

export default load_runtime

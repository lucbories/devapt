
import T from 'typr'
import assert from 'assert'

import Executable from '../base/executable'


let context = 'common/executables/runtime_sexecutable'



/**
 * Runtime Stages base class
*/
export default class RuntimeExecutable extends Executable
{
	constructor(arg_context)
	{
		super(arg_context ? arg_context : context)
	}
	
	
	prepare(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':prepare:bad settings object')
		assert(T.isObject(arg_settings.runtime), context + ':bad runtime object')
		this.runtime = arg_settings.runtime
	}
	
	
	execute()
	{
		this.enter_group('execute')
		
		this.info('not yet implemented')
		
		this.leave_group('execute')
	}
}

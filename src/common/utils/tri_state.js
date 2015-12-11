
import T from 'typr'
import assert from 'assert'


const VALUES_OK = ['ok', 'true', '1', 1, 'enabled', 'valid', 'good']
const VALUES_KO = ['ko', 'false', '0', 0, null, 'disabled', 'unvalid', 'notvalid', 'bad']

const STATE_OK = 'OK'
const STATE_KO = 'KO'
const STATE_UNKNOW = 'UNKNOW'

const context = 'common/utils/tri_state'


export default class TriState
{
	constructor(arg_state)
	{
		if (arg_state !== undefined)
		{
			this.set_state(arg_state)
		}
	}
	
	
	set_state(arg_state)
	{
		assert( T.isString(arg_state) || T.isNumber(arg_state), context + ':bad state type' )
		arg_state = T.isString(arg_state) ? arg_state.toLocaleLowerCase() : arg_state
		
		if (arg_state in VALUES_OK)
		{
			this.state = STATE_OK
		}
		
		if (arg_state in VALUES_KO)
		{
			this.state = STATE_KO
		}
		
		this.state = STATE_UNKNOW
	}
	
	
	get_state()
	{
		return this.state
	}
	
	
	ok()
	{
		return this.state === STATE_OK
	}
	
	
	ko()
	{
		return this.state === STATE_KO
	}
	
	
	unknow()
	{
		return this.state === STATE_UNKNOW
	}
}
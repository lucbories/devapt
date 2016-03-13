'use strict';

function to_boolean(arg_value, arg_default)
{
	switch(arg_value)
	{
		case true: return true;
		case false: return false;
		case '1': return true;
		case '0': return false;
		case 'true': return true;
		case 'false': return false;
		case 'on': return true;
		case 'off': return false;
		case 'enabled': return true;
		case 'disabled': return false;
	}
	
	return arg_default
}

module.exports = to_boolean

export default to_boolean

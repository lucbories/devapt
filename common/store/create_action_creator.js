export function create_action_creator(type, ...argNames)
{
  return function(...args)
  {
    let action = { type };
	
    argNames.forEach(
		(arg, index) => {
      		action[argNames[index]] = args[index];
    	}
	);
	
    return action;
  }
}
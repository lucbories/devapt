

// let context = 'server/nodes/node_feature'



/**
 * @file Node feature: append a feature to a Node instance.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class NodeFeature
{
	/**
	 * Create a Nodefeature instance.
	 * @abstract
	 * 
	 * @param {Node} arg_node - node instance.
	 * @param {string} arg_name - feature name.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_node, arg_name)
	{
		this.is_node_feature = true
		
		this.node = arg_node
		this.name = arg_name
		this.is_ready = false
	}



	/**
	 * Get feature name.
	 * 
	 * @returns {string} - feature name
	 */
	get_name()
	{
		return this.name
	}

	
	
	/**
	 * Load Node settings.
	 * @abstract
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		this.node.enter_group(':NodeFeature.load()')
		
		
		this.node.leave_group(':NodeFeature.load()')
	}
	
	
	
	/**
	 * Starts node feature.
	 * @abstract
	 * 
	 * @returns {nothing}
	 */
	start()
	{
		this.node.enter_group(':NodeFeature.start')

		
		this.node.leave_group(':NodeFeature.start')
	}
	
	
	
	/**
	 * Stops node feature.
	 * @abstract
	 * 
	 * @returns {nothing}
	 */
	stop()
	{
		this.node.enter_group(':NodeFeature.stop')
		
		
		this.node.leave_group(':NodeFeature.stop')
	}
}

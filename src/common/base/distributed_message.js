// NPM IMPORTS
import T from 'typr'
import assert from 'assert'


let context = 'common/base/distributed_message'



/**
 * @file DistributedMessage class for distributed communication.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class DistributedMessage
{
    /**
     * Create a DistributedMessage instance.
	 * 
	 * @param {string} arg_sender_name - sender name.
	 * @param {string} arg_target_name - recipient name.
	 * @param {object} arg_payload - message payload plain object.
	 * 
     * @returns {nothing}
     */
	constructor(arg_sender_name, arg_target_name, arg_payload)
	{
		assert( T.isString(arg_sender_name) , context + ':bad sender string')
		assert( T.isString(arg_target_name) , context + ':bad target string')
		assert( T.isObject(arg_payload), context + ':bad payload object')

		this.is_distributed_message = true

		this.sender = arg_sender_name
		this.target = arg_target_name
		this.payload = arg_payload
	}
    
    

	/**
	 * Get message sender.
	 * 
	 * @returns {string} - sender name.
	 */
	get_sender()
	{
		return this.sender
	}
    
    

	/**
	 * Get message sender.
	 * 
	 * @returns {string} - target name.
	 */
	get_target()
	{
		return this.target
	}
    
    

	/**
	 * Get message sender.
	 * 
	 * @returns {object} - payload object
	 */
	get_payload()
	{
		return this.payload
	}
	
	
	
	/**
	 * Check message format.
	 * 
	 * @returns {boolean} - true:good format, false:bad format.
	 */
	check_msg_format()
	{
		// console.log(context + ':check_msg_format:this', this)

		if ( T.isString(this.sender) && this.sender.length > 0 && T.isString(this.target) && this.target.length > 0 && T.isObject(this.payload) )
		{
			return true
		}
		return false
	}
}
// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import JsonProvider from './json_provider'
import { SOURCE_MASTER } from './json_provider_sources'


const context = 'common/json_provider/file_json_provider'



/**
 * Json providier class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class MasterJsonProvider extends JsonProvider
{
    /**
     * Create a MasterJsonProvider instance.
	 * 
	 * @param {object} arg_settings - provider settings.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_settings)
    {
		super(arg_settings)
	}
    
    
    
    /**
     * Provide JSON datas inside a promise.
	 * 
     * @param {function} resolve - a promise should be resolved.
     * @param {function} reject - a promise should be rejected.
	 * 
     * @returns {nothing}
     */
	provide_json_self(resolve/*, reject*/)
	{
		assert( this.source == SOURCE_MASTER, context + ':provide_json_self:bad source')
		assert( T.isString(this.$settings.relative_path), context + ':provide_json_self:bad settings.relative_path string')
		
		const node = this.$settings.node
		assert( T.isObject(node) && node.is_node, context + ':provide_json_self:bad node object')

		const master_name = node.master_name
		assert( T.isString(master_name), context + ':provide_json_self:bad master name string')

		const delay = T.isNumber(this.$settings.delay) ? this.$settings.delay : 0

		// WAIT FOR BUS GATEWAY IS STARTED AND CONNECTED TO THE LOCAL BUS
		const do_cb = () => {
			node.on_registering_callback = resolve
			node.register_to_master()
			console.log(context + ':provide_json_self:SOURCE_MASTER end')
		}
		setTimeout(do_cb, delay)
	}
}

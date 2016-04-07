
import T from 'typr'
import assert from 'assert'



const context = 'common/datas/providers/record_provider'



/**
 * Record provider base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RecordProvider
{
    /**
     * Create a record provider instance
     */
	constructor(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		this.$settings = T.isFunction(arg_settings.toJS) ? arg_settings.toJS() : arg_settings
	}
    
    
    /**
     * Build a query to fetch datas.
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} datas record promise
     */
	build_query(arg_query)
	{
		// logs.debug(context, 'build_query:not implemented')

		return arg_query
	}
    
    
    /**
     * Provide all datas records
     * @abstract
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} datas record promise
     */
	find_all_records(/*arg_query*/)
	{
		// logs.debug(context, 'find_all_records:not implemented')
		return Promise.resolve(null)
	}
    
    
    /**
     * Find a record by its id.
     * @abstract
     * @param {string|number} arg_id - record id
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} - promise of found record or null
     */
	find_records_by_id(arg_id, arg_query)
	{
		// logs.debug(context, 'find_records_by_id:not implemented')
		assert( T.isString(arg_id) || T.isNumber(arg_id), context + ':find_records_by_id:bad id string or number')

		// TO IMPLEMENT IN SUBCLASSES

		return Promise.resolve(null)
	}
    
    
    /**
     * Find a record with a set of values.
     * @abstract
     * @param {object} arg_values_map - values map
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} - promise of found record or null
     */
	find_records_by_values(arg_values_map/*, arg_query*/)
	{
		// logs.debug(context, 'find_records_by_values:not implemented')
		assert( T.isObject(arg_values_map), context + ':find_records_by_id:bad values object')

		// TO IMPLEMENT IN SUBCLASSES

		return Promise.resolve(null)
	}
}

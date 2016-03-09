
import T from 'typr'
import assert from 'assert'

import RecordProvider from './record_provider'

import logs from '../../utils/logs'
// import runtime from '../../base/runtime'



const context = 'common/datas/providers/sequelize_record_provider'



/**
 * Sequelize record provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SequelizeRecordProvider extends RecordProvider
{
    /**
     * Create a record provider instance
     */
	constructor(arg_settings)
	{
		super(arg_settings)

		assert( T.isObject(arg_settings.model), context + ':bad settings.model object')
		this.sequelize_model = arg_settings.model

		this.fields_list = undefined
		if ( T.isArray(arg_settings.fields_list) )
		{
			this.fields_list = arg_settings.fields_list
		}
	}
    
    
    /**
     * Build a query to fetch datas.
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} datas record promise
     */
	build_query(arg_query)
	{
		logs.debug(context, 'build_query:enter')

		let query = {}

		// SET FIELDS LIST
		if ( T.isObject(arg_query) && T.isArray(arg_query.fields_list) )
		{
			query.attributes = arg_query.fields_list
		}
		else if (this.fields_list)
		{
			query.attributes = this.fields_list
		}

		logs.debug(context, 'build_query:leave')
		return query
	}
    
    
    /**
     * Provide all datas records
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} datas record promise
     */
	find_all_records(arg_query)
	{
		logs.debug(context, 'find_all_records:enter')

		const query = this.build_query(arg_query)
		const records_promise = this.sequelize_model.findAll(query)

		logs.debug(context, 'find_all_records:leave')
		return records_promise
	}
    
    
    /**
     * Find a record by its id.
     * @param {string|number} arg_id - record id
     * @returns {Promise} - promise of found record or null
     */
	find_records_by_id(arg_id)
	{
		logs.debug(context, 'find_record_by_id:enter')
		assert( T.isString(arg_id) || T.isNumber(arg_id), context + ':find_record_by_id:bad id string or number')

		const records_promise = this.sequelize_model.findById()

		logs.debug(context, 'find_record_by_id:leave')
		return records_promise
	}
    
    
    /**
     * Find a record with a set of values.
     * @param {object} arg_values_map - values map
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} - promise of found records or null value
     */
	find_records_by_values(arg_values_map, arg_query)
	{
		logs.debug(context, 'find_record_by_values:enter')
		assert( T.isObject(arg_values_map), context + ':find_record_by_values:bad values object')

		// UPDATE QUERY WITH VALUES
		arg_query = T.isObject(arg_query) ? arg_query : {}
		arg_query.where = T.isObject(arg_query.where) ? arg_query.where : {}
		Object.keys(arg_values_map).forEach(
			(value) => {
				arg_query.where[value] = arg_values_map[value]
			}
		)
		const query = this.build_query(arg_query)
		const records_promise = this.sequelize_model.findAll(query)

		logs.debug(context, 'find_record_by_values:leave')
		return records_promise
	}
}

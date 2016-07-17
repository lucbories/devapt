
import T from 'typr'
import assert from 'assert'
import lowdb from 'lowdb'

import RecordProvider from './record_provider'

import runtime from '../../base/runtime'



const context = 'common/datas/providers/jsonfile_record_provider'



/**
 * Json File record provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class JsonFileRecordProvider extends RecordProvider
{
    /**
     * Create a record provider instance
     */
	constructor(arg_settings)
	{
		super(arg_settings)

		// GET FILE NAME
		assert( T.isString(arg_settings.filename), context + ':bad settings.filename object')
		this.filename = arg_settings.filename

		// GET MODEL NAME
		assert( T.isString(arg_settings.modelname), context + ':bad settings.modelname object')
		this.modelname = arg_settings.modelname

		// GET PRIMARY KEY NAME
		assert( T.isString(arg_settings.pkname), context + ':bad settings.pkname object')
		this.pkname = arg_settings.pkname

		// LOAD FILE DB
		this.file_db = null
		this.is_ready = false
		if ( T.isString(this.filename) )
		{
			const json_full_path = runtime.get_absolute_resources_path(this.filename)
			assert( T.isString(json_full_path), context + ':constructor:bad file path string')

			// OPEN DATABASE
			const db_settings = {
				autosave:true,
				async:true
			}
			this.file_db = lowdb(json_full_path, db_settings)

			this.is_ready = T.isFunction(this.file_db)
		}
	}
    
    
    /**
     * Build a query to fetch datas.
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} datas record promise
     */
	build_query(arg_query)
	{
		// logs.debug(context, 'build_query:enter')
		assert(this.is_ready, context + ':build_query:db not ready')


		// logs.debug(context, 'build_query:leave')
		return arg_query
	}


    /**
     * Provide all datas records
     * @param {object|undefined} arg_query - optional query context
     * @returns {Promise} datas record promise
     */
	find_all_records(arg_query)
	{
		// logs.debug(context, 'find_all_records:enter')
		assert(this.is_ready, context + ':find_all_records:db not ready')

		const query = this.build_query(arg_query)

			// EXECUTE QUERY
		try{
			const records = this.file_db(this.modelname).find(query)
			if (records)
			{
				// logs.debug(context, 'find_all_records:leave')
				return Promise.resolve(records)
			}
		}
		catch(e)
		{
			//  console.log('authenticate user error', e)
		}

		// logs.debug(context, 'find_all_records:leave not found')
		return Promise.resolve(null)
	}
    
    
    /**
     * Find a record by its id.
     * @param {string|number} arg_id - record id
     * @returns {Promise} - promise of found record or null
     */
	find_records_by_id(arg_id)
	{
		// logs.debug(context, 'find_record_by_id:enter')
		assert(this.is_ready, context + ':find_records_by_id:db not ready')
		assert( T.isString(arg_id) || T.isNumber(arg_id), context + ':find_record_by_id:bad id string or number')

		let query = {}
		query[this.pkname] = arg_id
		const records_promise = this.find_record_by_values(query)

		// logs.debug(context, 'find_record_by_id:leave')
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
		// logs.debug(context, 'find_records_by_values:enter')
		assert(this.is_ready, context + ':build_query:db not ready')
		assert( T.isObject(arg_values_map), context + ':find_record_by_values:bad values object')

		// UPDATE QUERY WITH VALUES
		arg_query = T.isObject(arg_query) ? arg_query : {}
		Object.keys(arg_values_map).forEach(
			(value) => {
				arg_query[value] = arg_values_map[value]
			}
		)
		const query = this.build_query(arg_query)

		// EXECUTE QUERY
		try{
			const records = this.file_db(this.modelname).find(query)
			if (records)
			{
				// logs.debug(context, 'find_record_by_values:leave')
				// console.debug(context, 'find_record_by_values:leave')
				return Promise.resolve(records)
			}
			
			console.error( this.file_db(this.modelname) )
		}
		catch(e)
		{
			//  console.log('authenticate user error', e)
		}

		// logs.debug(context, 'find_record_by_values:leave not found')
		// console.debug(context, 'find_record_by_values:leave not found', arg_values_map)
		return Promise.resolve(null)
	}
}

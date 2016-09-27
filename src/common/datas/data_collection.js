// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Loggable from '../base/loggable'


let context = 'common/data/data_collection'



/**
 * @file DataCollection class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DataCollection extends Loggable
{
	/**
	 * DataCollection class is responsible to manage one model records from one adapter:
	 *  all records operations, cached records, model logic (field value validation, triggers).
	 * DataCollection instances are managed by a DataStore instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_cache_manager,arg_data_adapter,arg_model_schema)
	 * 		
	 * 		->get_name():string - get tenant to use inside this datastore.
	 * 		->get_cache_manager():CacheManager - get cache manager instance.
	 * 		->get_adapter():DataAdapter - get data adapter instance.
	 * 		->get_model():DataModel - get collection model instance.
	 * 
	 *		->validate_record(arg_record_id, arg_record_datas):Promise(boolean) - test if given datas are valid for collection model.
	 * 		->create_record(arg_record_id, arg_record_datas):Promise(DataRecord) - create a new data record.
	 * 		->delete_record(arg_record_id):Promise(boolean) - delete an existing data record.
	 * 		->update_record(arg_record_id, arg_record_datas):Promise(DataRecord) - update an existing data record.
	 * 		->has_record(arg_record_id):Promise(boolean) - test if a data record exists with an id.
	 * 		
	 * 		->find_one_record(arg_record_id):Promise(DataRecord) - find an existing data record with an id.
	 * 		->find_records(arg_query):Promise(DataRecordArray) - find existing data records with a query.
	 * 		->find_all_records():Promise(DataRecordArray) - find all xisting data records.
	 * 
	 * 	PRIVATE:
	 * 		->_emit(arg_event, arg_datas=undefined):nothing
	 * 		->_trigger(arg_event, arg_datas):nothing
	 * 		->_has_cached_record_by_id(arg_id):Promise(boolean)
	 * 		->_get_cached_record_by_id(arg_id):Promise(DataRecord)
	 * 		->_add_cached_record_by_id(arg_record):Promise(boolean)
	 * 		->_remove_cached_record_by_id(arg_id):Promise(boolean)
	 * 
	 * 
	 * 	USAGE ON BROWSER:
	 * 		// ds is a DataStore instance
	 * 		var cars = ds.get_collection('cars')
	 * 		var car_12 = cars.find_one_record('12')
	 * 
	 * 
	 * @param {CacheManager} arg_cache_manager - cache manager instance.
	 * @param {DataAdapter} arg_data_adapter - collection data adapter.
	 * @param {array} arg_model_schema - topology model schema.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_cache_manager, arg_data_adapter, arg_model_schema)
	{
		assert( T.isObject(arg_cache_manager) && arg_cache_manager.is_cache_manager, context + ':constructor:bad cache manager object')
		assert( T.isObject(arg_data_adapter) && arg_data_adapter.is_data_adapter, context + ':constructor:bad data adapter object')
		assert( T.isObject(arg_model_schema) && arg_model_schema.is_topology_model, context + ':constructor:bad model schema object')
		
		const model_plural_name = arg_model_schema.get_plural_name()
		assert( T.isString(model_plural_name) && model_plural_name.length > 0, context + ':constructor:bad collection name string')

		super(context)

		this.is_data_collection = true

		this._cache_manager = arg_cache_manager
		this._adapter = arg_data_adapter
		this._schema = arg_model_schema
		this._cache_prefix = model_plural_name
		this._name = model_plural_name
	}



	/**
	 * Emit on event.
	 * @private
	 * 
	 * @param {string} arg_event - event name.
	 * @param {any} arg_datas - event datas (optional, default:undefined).
	 * 
	 * @returns {nothing}
	 */
	_emit(arg_event, arg_datas=undefined) // TODO
	{
		this.debug(context + ':emit:' + arg_event)

		if ( this._model.has_rules_agenda() )
		{
			this._model.push_on_rule_agenda(arg_event, arg_datas)
		}
	}



	/**
	 * Call event triggers.
	 * @private
	 * 
	 * @param {string} arg_event - event name.
	 * @param {any} arg_datas - event datas (optional, default:undefined).
	 * 
	 * @returns {nothing}
	 */
	_trigger(arg_event, arg_datas=undefined) // TODO
	{
		this.debug(context + ':trigger:' + arg_event)

		this._model.trigger(arg_event, arg_datas)
		this._emit(arg_event, arg_datas)

		// TODO: UPDATE METRICS
	}



	/**
	 * Test if a record is cached.
	 * @private
	 * 
	 * @param {string} arg_id - record id.
	 * 
	 * @returns {Promise} - Promise of boolean value: found (true) or not found (false).
	 */
	_has_cached_record_by_id(arg_id)
	{
		const key = this._cache_prefix + ':' + arg_id
		return this._cache_manager.has(key)
	}



	/**
	 * Test if a record array is cached.
	 * @private
	 * 
	 * @param {DataQuery} arg_query - data query.
	 * 
	 * @returns {Promise} - Promise of boolean value: found (true) or not found (false).
	 */
	_has_cached_record_by_query(arg_query)
	{
		const key = this._cache_prefix + ':query:' + arg_query.hash()
		return this._cache_manager.has(key)
	}



	/**
	 * Get a cached record.
	 * @private
	 * 
	 * @param {string} arg_id - record id.
	 * 
	 * @returns {Promise} - Promise of a DataRecord instance.
	 */
	_get_cached_record_by_id(arg_id)
	{
		const key = this._cache_prefix + ':' + arg_id
		return this._cache_manager.get(key, undefined)
	}



	/**
	 * Get a cached record array.
	 * @private
	 * 
	 * @param {DataQuery} arg_query - data query.
	 * 
	 * @returns {Promise} - Promise of a DataRecordArray instance.
	 */
	_get_cached_record_by_query(arg_query)
	{
		const key = this._cache_prefix + ':query:' + arg_query.hash()
		return this._cache_manager.get(key, undefined)
	}



	/**
	 * Add a record to cache.
	 * @private
	 * 
	 * @param {DataRecord} arg_record - record
	 * 
	 * @returns {Promise} - Promise of boolean value: success (true) or failure (false).
	 */
	_set_cached_record_by_id(arg_record)
	{
		assert( T.isObject(arg_record) && arg_record.is_data_record, context + ':_set_cached_record_by_id:bad data record object')
		
		const key = this._cache_prefix + ':' + arg_record.get_id()
		return this._cache_manager.set(key, arg_record, this._model.get_ttl())
	}



	/**
	 * Add a record array to cache.
	 * @private
	 * 
	 * @param {DataQuery} arg_query - data query.
	 * @param {DataRecordArray} arg_record_array - record array.
	 * 
	 * @returns {Promise} - Promise of boolean value: success (true) or failure (false).
	 */
	_set_cached_record_by_query(arg_query, arg_record_array)
	{
		assert( T.isObject(arg_query) && arg_query.is_data_query, context + ':_set_cached_record_by_query:bad data query object')
		assert( T.isObject(arg_record_array) && arg_record_array.is_data_record_array, context + ':_set_cached_record_by_query:bad data record object')
		
		const promises = []

		// CACHE RECORD ARRAY
		const key = this._cache_prefix + ':query:' + arg_query.hash()
		promises.push( this._cache_manager.set(key, arg_record_array, this._model.get_ttl()) )

		// CACHE ALL ARRAY RECORDS
		arg_record_array._records.forEach(
			(record)=>{
				promises.push( this._set_cached_record_by_id(record) )
			}
		)

		return Promise.all(promises)
	}



	/**
	 * Remove a cached record.
	 * @private
	 * 
	 * @param {string} arg_id - record id.
	 * 
	 * @returns {Promise} - Promise of boolean value: success (true) or failure (false).
	 */
	_remove_cached_record_by_id(arg_id)
	{
		const key = this._cache_prefix + ':' + arg_id
		
		return this._cache_manager.remove(key)
	}



	/**
	 * Get collection name.
	 * 
	 * @returns {string}
	 */
	get_name()
	{
		return this._name
	}



	/**
	 * Get cache manager.
	 * 
	 * @returns {DataAdapter}
	 */
	get_cache_manager()
	{
		assert( T.isObject(this._cache_manager) && this._cache_manager.is_cache_manager, context + ':get_cache_manager:bad cache manager object')
		
		return this._cache_manager
	}



	/**
	 * Get data adapter.
	 * 
	 * @returns {DataAdapter}
	 */
	get_adapter()
	{
		assert( T.isObject(this._adapter) && this._adapter.is_data_adapter, context + ':get_adapter:bad data adapter object')
		
		return this._adapter
	}



	/**
	 * Get data model.
	 * 
	 * @returns {DataModel}
	 */
	get_model()
	{
		assert( T.isObject(this._model) && this._model.is_data_model, context + ':get_model:bad data model object')
		
		return this._model
	}



	/**
	 * Validate data record values.
	 * 1-Call 'before_validate' triggers.
	 * 2-Check all fields values.
	 * 3-Call 'after_validate_ok' triggers on success.
	 *   Call 'after_validate_ko' triggers on failure.
	 * 4-Return success (true) or failure (false)
	 * 
	 * @param {string} arg_record_id - data record id.
	 * @param {object} arg_record_datas - data record datas.
	 * 
	 * @returns {Promise} - Promise of a boolean.
	 */
	validate_record(arg_record_id, arg_record_datas) // TODO
	{
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':validate_record:bad record id string')
		assert( T.isObject(arg_record_datas), context + ':validate_record:bad record datas object')
		
		this.trigger('before_validate', {id:arg_record_id, values:arg_record_datas})
		const result = this._model.validate(arg_record_id, arg_record_datas)
		this.trigger(result ? 'after_validate_ok' : 'after_validate_ko', {id:arg_record_id, values:arg_record_datas})

		return Promise.resolve(result)
	}



	/**
	 * Create a data collection record.
	 * 1-Call 'before_create' triggers.
	 * 2-Check existing record id within cached records.
	 * 3-Validate record datas: reject on failure
	 * 4-Create a DataRecord instance with adapter.new_record.
	 * 5-Add record to cache.
	 * 6-Call record.save()
	 * 7-Call 'after_create' triggers.
	 * 
	 * @param {string} arg_record_id - data record id.
	 * @param {object} arg_record_datas - data record datas.
	 * 
	 * @returns {Promise} - Promise of a DataRecord object.
	 */
	create_record(arg_record_id, arg_record_datas)
	{
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':create_record:bad record id string')
		assert( T.isObject(arg_record_datas), context + ':create_record:bad record datas object')
		
		this.trigger('before_create', { has_error:false, error_msg:undefined, id:arg_record_id, values:arg_record_datas})
		
		const is_cached = this._has_from_cache_by_id(arg_record_id)
		if (is_cached)
		{
			this.trigger('after_create', { has_error:true, error_msg:'already_exists', id:arg_record_id, values:arg_record_datas })
			return Promise.reject('already_exists')
		}

		const is_valid = this.validate_record(arg_record_id, arg_record_datas)
		if ( ! is_valid)
		{
			this.trigger('after_create', { has_error:true, error_msg:'not_valid', id:arg_record_id, values:arg_record_datas })
			return Promise.reject('not_valid')
		}

		const record = this._adapter.new_record(this._model.get_name(), arg_record_id, arg_record_datas)

		return this._add_cached_record_by_id(record)
		.then(record.save)
		.then(
			()=>{
				this.trigger('after_create', { has_error:false, error_msg:undefined, record:record})
				return record
			}
		).catch(
			(e)=>{
				this.trigger('after_create', { has_error:true, error_msg:e, id:arg_record_id, values:arg_record_datas})
				return undefined
			}
		)
	}



	/**
	 * Delete a data collection record.
	 * 1-Call 'before_delete' triggers.
	 * 2-Remove cached record.
	 * 3-Call record.delete()
	 * 4-Call 'after_delete' triggers.
	 * 
	 * @param {string|array} arg_record_id - data record id or an array of data record id strings.
	 * 
	 * @returns {Promise} - Promise of boolean success.
	 */
	delete_record(arg_record_id)
	{
		assert( ( T.isString(arg_record_id) || T.isArray(arg_record_id) ) && arg_record_id.length > 0, context + ':delete_record:bad record id string')
		
		this.trigger('before_delete', { has_error:false, error_msg:undefined, id:arg_record_id})
		
		return this._remove_cached_record_by_id(arg_record_id)
		.then(
			()=>{
				return this._adapter.find_record(this._model.get_name(), arg_record_id).then( (record)=> { return record.remove() } )
			}
		).then(
			()=>{
				this.trigger('after_delete', { has_error:false, error_msg:undefined, id:arg_record_id})
				return true
			}
		).catch(
			(e)=>{
				this.trigger('after_delete', { has_error:true, error_msg:e, id:arg_record_id})
				return false
			}
		)
	}



	/**
	 * Update a data collection record.
	 * 1-Call 'before_update' triggers.
	 * 2-Update cached record.
	 * 3-Call record.update()
	 * 4-Call 'after_update' triggers.
	 * 
	 * @param {string} arg_record_id - data record id.
	 * @param {object} arg_record_datas - data record datas.
	 * 
	 * @returns {Promise} - Promise of boolean success.
	 */
	update_record(arg_record_id, arg_record_datas)
	{
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':update_record:bad record id string')
		assert( T.isObject(arg_record_datas), context + ':update_record:bad record datas object')
		
		this.trigger('before_update', { has_error:false, error_msg:undefined, id:arg_record_id, values:arg_record_datas})
		
		return this._adapter.find_record(this._model.get_name(), arg_record_id)
		.then(
			(record)=>{
				return this._set_cached_record_by_id(arg_record_id, record).then( ()=>{ return record} )
			}
		)
		.then(
			(record)=>{
				return record.update_record(arg_record_datas)
			}
		)
		.then(
			()=>{
				this.trigger('after_update', { has_error:false, error_msg:undefined, id:arg_record_id, values:arg_record_datas})
				return true
			}
		)
		.catch(
			(e)=>{
				this.trigger('after_update', { has_error:true, error_msg:e, id:arg_record_id, values:arg_record_datas})
				return false
			}
		)
	}



	/**
	 * Update a data collection record.
	 * 1-Search record into cache
	 * 2-Search record into adapter
	 * 
	 * @param {string} arg_record_id - data record id.
	 * 
	 * @returns {Promise} - Promise of boolean found:true, not found:false.
	 */
	has_record(arg_record_id)
	{
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':has_record:bad record id string')
		
		return this._has_cached_record_by_id(arg_record_id)
		.then(
			(found)=>{
				if (found)
				{
					return true
				}
				return this._adapter.has_record(this._model.get_name(), arg_record_id)
			}
		).catch(
			(e)=>{
				this.trigger('has_record', { has_error:true, error_msg:e, id:arg_record_id} )
				return false
			}
		)
	}



	/**
	 * Find an existing data record with an id.
	 * 1-Search record into cache
	 * 2-Search record into adapter
	 * 3-Save record into cache
	 * 
	 * @param {string} arg_record_id - data record id.
	 * 
	 * @returns {Promise} - Promise of DataRecord.
	 */
	find_one_record(arg_record_id)
	{
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':find_one_record:bad record id string')
		
		return this._get_cached_record_by_id(arg_record_id)
		.then(
			(record)=>{
				if ( T.isObject(record) && record.is_data_record )
				{
					this.trigger('find_one_record', { has_error:false, error_msg:undefined, id:arg_record_id, from:'cache'})
					return record
				}
				return this._adapter.find_one_record(this._model.get_name(), arg_record_id).then(
					(record)=>{
						if ( T.isObject(record) && record.is_data_record )
						{
							return this._set_cached_record_by_id(arg_record_id, record).then(
								()=>{
									this.trigger('find_one_record', { has_error:false, error_msg:undefined, id:arg_record_id, from:'adapter'})
									return record
								}
							)
						}

						this.trigger('find_one_record', { has_error:false, error_msg:undefined, id:arg_record_id, from:'notfound'})
						return undefined
					}
				)
			}
		).catch(
			(e)=>{
				this.trigger('find_one_record', { has_error:true, error_msg:e, id:arg_record_id} )
				return undefined
			}
		)
	}



	/**
	 * Find existing data records with a query.
	 * 1-Search records into cache
	 * 2-Search records into adapter
	 * 3-Save records into cache
	 * 
	 * @param {DataQuery} arg_query - data query.
	 * 
	 * @returns {Promise} - Promise of DataRecordArray.
	 */
	find_records(arg_query)
	{
		assert( T.isObject(arg_query) && arg_query.is_data_query, context + ':find_records:bad query object')
		
		return this._get_cached_record_by_query(arg_query)
		.then(
			(record_array)=>{
				if ( T.isObject(record_array) && record_array.is_data_record_array )
				{
					this.trigger('find_records', { has_error:false, error_msg:undefined, query:arg_query, from:'cache'})
					return record_array
				}
				return this._adapter.find_records(this._model.get_name(), arg_query).then(
					(record_array)=>{
						if ( T.isObject(record_array) && record_array.is_data_record_array )
						{
							return this._set_cached_record_by_query(arg_query, record_array).then(
								()=>{
									this.trigger('find_records', { has_error:false, error_msg:undefined, query:arg_query, from:'adapter'})
									return record_array
								}
							)
						}

						this.trigger('find_records', { has_error:false, error_msg:undefined, query:arg_query, from:'notfound'})
						return undefined
					}
				)
			}
		).catch(
			(e)=>{
				this.trigger('find_one_record', { has_error:true, error_msg:e, query:arg_query} )
				return undefined
			}
		)
	}



	/**
	 * Find all existing data records from adapter.
	 * 
	 * @returns {Promise} - Promise of DataRecordArray.
	 */
	find_all_records() // TODO use a query and cache: calling find_records(query) with query.select_all()
	{
		return this._adapter.find_all_records(this._model.get_name())
		.then(
			(record_array)=>{
				this.trigger('find_all_records', { has_error:false, error_msg:undefined, from:'adapter'})
				return record_array
			}
		)
		.catch(
			(e)=>{
				this.trigger('find_all_records', { has_error:true, error_msg:e } )
				return undefined
			}
		)
	}
}

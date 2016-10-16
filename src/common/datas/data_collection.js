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
	 *		->validate_record(arg_record):Promise(boolean) - test if given datas are valid for collection model.
	 *		->new_record(arg_record_datas, arg_record_id) - create a new record instance.
	 * 		->create_record(arg_record):Promise(DataRecord) - create an existing unsaved data record.
	 * 		->delete_record(arg_record):Promise(boolean) - delete an existing data record.
	 * 		->update_record(arg_record):Promise(DataRecord) - update an existing data record.
	 * 		->reload_record(arg_record):Promise(DataRecord) - reload an existing data record.
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
	 * 		->_set_cached_record_by_id(arg_record):Promise(boolean)
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

		// if ( this._schema.has_rules_agenda() )
		// {
		// 	this._schema.push_on_rule_agenda(arg_event, arg_datas)
		// }
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

		// this._schema._trigger(arg_event, arg_datas)
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
		return this._cache_manager.set(key, arg_record, this._schema.get_ttl())
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
		promises.push( this._cache_manager.set(key, arg_record_array, this._schema.get_ttl()) )

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
		assert( T.isObject(this._schema) && this._schema.is_topology_model, context + ':get_model:bad data model object')
		
		return this._schema
	}



	/**
	 * Get data model.
	 * 
	 * @returns {DataModel}
	 */
	get_schema()
	{
		assert( T.isObject(this._schema) && this._schema.is_topology_model, context + ':get_model:bad data model object')
		
		return this._schema
	}



	/**
	 * Validate data record values.
	 * 1-Call 'before_validate' triggers.
	 * 2-Check all fields values.
	 * 3-Call 'after_validate_ok' triggers on success.
	 *   Call 'after_validate_ko' triggers on failure.
	 * 4-Return success (true) or failure (false)
	 * 
	 * @param {DataRecord} arg_record - data record instance.
	 * 
	 * @returns {Promise} - Promise of a boolean.
	 */
	validate_record(arg_record) // TODO
	{
		assert( T.isObject(arg_record) && arg_record.is_data_record, context + ':validate_record:bad data record object')
		
		this._trigger('before_validate', { record:arg_record })
		const result = this._schema.validate(arg_record.get_attributes_object())
		this._trigger(result.is_valid ? 'after_validate_ok' : 'after_validate_ko', { record:arg_record })

		return Promise.resolve(result)
	}



	/**
	 * Create a new data record instance, not saved.
	 * 
	 * @param {object} arg_record_datas - new record attributes.
	 * @param {string} arg_record_id - new record unique id (optional).
	 * 
	 * @returns {Promise} - Promise(DataRecord)
	 */
	new_record(arg_record_datas, arg_record_id)
	{
		// const is_cached_promise = this._has_cached_record_by_id(arg_record_id)
		// if (is_cached)
		// {
		// 	console.log('collection:is cached')
		// 	return this._get_cached_record_by_id(arg_record_id)
		// }
		return this._adapter.new_record(this._schema.get_name(), arg_record_datas, arg_record_id)
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
	 * @param {DataRecord} arg_record - data record instance.
	 * 
	 * @returns {Promise} - Promise of a DataRecord object.
	 */
	create_record(arg_record)
	{
		assert( T.isObject(arg_record) && arg_record.is_data_record, context + ':create_record:bad data record object')
		
		this._trigger('before_create', { has_error:false, error_msg:undefined, record:arg_record})
		
		return this._has_cached_record_by_id(arg_record.get_id())
		.then(
			(is_cached)=>{
				if (is_cached)
				{
					this._trigger('after_create', { has_error:true, error_msg:'already_exists', record:arg_record })
					return Promise.reject('already_exists')
				}
			}
		)
		.then(
			()=>{
				const is_valid = this.validate_record(arg_record)
				if ( ! is_valid)
				{
					this._trigger('after_create', { has_error:true, error_msg:'not_valid', record:arg_record })
					return Promise.reject('not_valid')
				}
			}
		)
		.then(
			()=>{
				return this._adapter.create_record(this._schema.get_name(), arg_record.get_attributes_object())
			}
		)
		.then(
			(record)=>{
				this._trigger('after_create', { has_error:false, error_msg:undefined, record:record})
				return record
			}
		)
		.catch(
			(e)=>{
				this._trigger('after_create', { has_error:true, error_msg:e, record:arg_record})
				console.error(context + ':create_record:', e)
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
	 * @param {DataRecord} arg_record - data record instance.
	 * 
	 * @returns {Promise} - Promise of boolean success.
	 */
	delete_record(arg_record)
	{
		assert( T.isObject(arg_record) && arg_record.is_data_record, context + ':delete_record:bad data record object')

		this._trigger('before_delete', { has_error:false, error_msg:undefined, record:arg_record})
		
		return this._remove_cached_record_by_id(arg_record.get_id())
		.then(
			()=>{
				return this._adapter.delete_record(this._schema.get_name(), arg_record.get_id())
				.then( (record)=> { return record.set_removed() } )
			}
		).then(
			()=>{
				this._trigger('after_delete', { has_error:false, error_msg:undefined, record:arg_record})
				return true
			}
		).catch(
			(e)=>{
				this._trigger('after_delete', { has_error:true, error_msg:e, record:arg_record})
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
	 * @param {DataRecord} arg_record - data record instance.
	 * 
	 * @returns {Promise} - Promise of boolean success.
	 */
	update_record(arg_record)
	{
		assert( T.isObject(arg_record) && arg_record.is_data_record, context + ':update_record:bad data record object')
		
		this._trigger('before_update', { has_error:false, error_msg:undefined, record:arg_record})
		
		return this._adapter.update_record(this._schema.get_name(), arg_record)
		.then(
			(record)=>{
				console.log(context + ':update_record:record', record)
				return this._set_cached_record_by_id(arg_record.get_id(), record)
			}
		)
		.then(
			()=>{
				this._trigger('after_update', { has_error:false, error_msg:undefined, record:arg_record})
				console.log(context + ':update_record:true')
				return true
			}
		)
		.catch(
			(e)=>{
				this._trigger('after_update', { has_error:true, error_msg:e, record:arg_record})
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
				return this._adapter.has_record(this._schema.get_name(), arg_record_id)
			}
		).catch(
			(e)=>{
				this._trigger('has_record', { has_error:true, error_msg:e, id:arg_record_id} )
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
					this._trigger('find_one_record', { has_error:false, error_msg:undefined, id:arg_record_id, from:'cache'})
					return record
				}
				return this._adapter.find_one_record(this._schema.get_name(), arg_record_id)
				.then(
					(attributes)=>{
						// console.log(context + ':find_one_record:adapter:attributes', attributes)
						return this.new_record(attributes, arg_record_id)
					}
				)
				.then(
					(record)=>{
						if ( T.isObject(record) && record.is_data_record )
						{
							this._trigger('find_one_record', { has_error:false, error_msg:undefined, id:arg_record_id, record:record, from:'adapter'})
							// console.log(context + ':find_one_record:adapter:good record', record)
							return record
						}

						console.error(context + ':find_one_record:adapter:bad record', record)
						this._trigger('find_one_record', { has_error:false, error_msg:undefined, id:arg_record_id, from:'notfound'})
						return undefined
					}
				)
			}
		)
		.catch(
			(e)=>{
				this._trigger('find_one_record', { has_error:true, error_msg:e, id:arg_record_id} )
				console.error(context + ':find_one_record:error', e)
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
					this._trigger('find_records', { has_error:false, error_msg:undefined, query:arg_query, from:'cache'})
					return record_array
				}
				return this._adapter.find_records(this._schema.get_name(), arg_query)
				.then(
					(attributes_array)=>{
						if ( T.isArray(attributes_array) )
						{
							return this.new_record_array(attributes_array)
						}

						this._trigger('find_records', { has_error:true, error_msg:'bad attributes array', query:arg_query, from:'notfound'})
						return undefined
					}
				)
				.then(
					(record_array)=>{
						if ( T.isObject(record_array) && record_array.is_data_record_array )
						{
							return this._set_cached_record_by_query(arg_query, record_array).then(
								()=>{
									this._trigger('find_records', { has_error:false, error_msg:undefined, query:arg_query, records:record_array, from:'adapter'})
									return record_array
								}
							)
						}

						this._trigger('find_records', { has_error:false, error_msg:'bad DataRecordArray', query:arg_query, from:'notfound'})
						return undefined
					}
				)
			}
		).catch(
			(e)=>{
				this._trigger('find_one_record', { has_error:true, error_msg:e, query:arg_query} )
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
		return this._adapter.find_all_records(this._schema.get_name())
		.then(
			(record_array)=>{
				if ( T.isObject(record_array) && record_array.is_data_record_array )
				{
					this._trigger('find_all_records', { has_error:false, error_msg:undefined, from:'adapter'})
					return record_array
				}

				this._trigger('find_all_records', { has_error:true, error_msg:'bad DataRecordArray'} )
				return undefined
			}
		)
		.catch(
			(e)=>{
				this._trigger('find_all_records', { has_error:true, error_msg:e } )
				return undefined
			}
		)
	}
}

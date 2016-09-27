// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Loggable from '../base/loggable'


let context = 'common/data/data_store'

/*
createRecord is used for creating new records on the client side. This will return a new record in the created.uncommitted state.
In order to persist this record to the backend you will need to call record.save().

push is used to notify Ember Data's store of new or updated records that exist in the backend. This will return a record in the loaded.saved state. The primary use-case for store#push is to notify Ember Data about record updates (full or partial) that happen outside of the normal adapter methods (for example SSE or Web Sockets).

pushPayload is a convenience wrapper for store#push that will deserialize payloads if the Serializer implements a pushPayload method.



METHODS

adapterFor
modelFor
normalize
peekAll
peekRecord
push
pushPayload
query
recordIsLoaded
serializerFor
unloadAll
unloadRecord
*/

/**
 * @file DataStore class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DataStore extends Loggable
{
	/**
	 * Data store class is the main interface between datas consumers (views) and producers (adapters).
	 * 
	 * Each application on the browser has crendtials for one tenant.
	 * 
	 * 
	 * 	API:
	 * 		->constructor()
	 * 		
	 * 		// DATA ADAPTERS MANAGEMENT
	 * 		->add_adapter(arg_adapter):boolean
	 * 		->remove_adapter(arg_adapter):boolean
	 * 		->suspend_adapter(arg_adapter):boolean
	 * 		->resume_adapter(arg_adapter):boolean
	 * 		
	 * 		// DATA COLLECTIONS MANAGEMENT
	 * 		->get_collection(arg_model_name):DataCollection - get a data collection for a model.
	 * 		->add_collection(arg_collection):boolean - add a data collection.
	 * 		->remove_collection(arg_collection):boolean - remove a data collection.
	 * 
	 * 		// WRAPPERS FOR DATA COLLECTIONS OPERATIONS
	 * 		->create_record(arg_collection_name, arg_record_id, arg_record_datas):Promise(DataRecord) - create a new data record.
	 * 		->delete_record(arg_collection_name, arg_record_id):Promise(boolean) - delete an existing data record.
	 * 		->update_record(arg_collection_name, arg_record_id, arg_record_datas):Promise(DataRecord) - update an existing data record.
	 * 		->has_record(arg_collection_name, arg_record_id):Promise(boolean) - test if a data record exists with an id.
	 * 		
	 * 		->find_one_record(arg_collection_name, arg_record_id):Promise(DataRecord) - find an existing data record with an id.
	 * 		->find_records(arg_collection_name, arg_query):Promise(DataRecordArray) - find existing data records with a query.
	 * 		->find_all_records(arg_collection_name):Promise(DataRecordArray) - find all xisting data records.
	 * 
	 * 
	 * 	USAGE ON BROWSER:
	 * 		var memory_cache = new CacheAdapterNodeCache( {ttl:5000, check_period:2000} )
	 * 		var cache_manager = new CacheManager([memory_cache])
	 * 
	 * 		var rest_settings = {...}
	 * 		var models_settings = {...}
	 * 		var rest_adapter = new DataAdapterRest(rest_settings, models_settings)
	 * 		var ds = new DataStore(cache_manager, [rest_adapter])
	 * 		ds.set_tenant('my tenant')
	 * 		ds.set_credentials('*', app.get_credentials())
	 * 		ds.set_credentials('cars', {token:'...'} )
	 * 		
	 * 		var cars = ds.get_collection('cars')
	 * 		var car_12 = cars.find_one_record('12')
	 * 
	 * 		or
	 * 
	 * 		var car_13 = ds.find_one_record('cars', '13')
	 * 		
	 * 		var car_14 = ds.create_record('cars', '14', { engine:'gazol', color:'red' } )
	 * 
	 * 
	 * @param {CacheManager} arg_cache_manager - cache manager instance.
	 * @param {array} arg_data_adapters - data adapters array.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_cache_manager, arg_data_adapters=[])
	{
		assert( T.isObject(arg_cache_manager) && arg_cache_manager.is_cache_manager, context + ':constructor:bad cache manager object')
		assert( T.isArray(arg_data_adapters), context + ':constructor:bad data adapters array')

		super(context)

		this.is_data_store = true

		this._cache_manager = arg_cache_manager
		this._adapters = arg_data_adapters

		this._collections = {}
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
	_emit(arg_event/*, arg_datas=undefined*/) // TODO
	{
		this.debug(context + ':emit:' + arg_event)
	}



	/**
	 * Add a data adapter.
	 * 
	 * @param {DataAdapter} arg_adapter - data adapter.
	 * 
	 * @returns {boolean}
	 */
	add_adapter(arg_adapter)
	{
		assert( T.isObject(arg_adapter) && arg_adapter.is_data_adapter, context + ':add_adapter:bad data adapter object')
		
		const adapter_name = arg_adapter.get_name()
		if (adapter_name in this._adapters)
		{
			this.warn('add_adapter:adapter exist [' + adapter_name + ']')
			return false
		}

		this._adapters[adapter_name] = arg_adapter

		this._emit('adapter.added', adapter_name)
		return true
	}



	/**
	 * Remove a data adapter.
	 * 
	 * @param {DataAdapter} arg_adapter - data adapter.
	 * 
	 * @returns {boolean}
	 */
	remove_adapter(arg_adapter)
	{
		assert( T.isObject(arg_adapter) && arg_adapter.is_data_adapter, context + ':remove_adapter:bad data adapter object')
		
		const adapter_name = arg_adapter.get_name()
		if ( ! (adapter_name in this._adapters) )
		{
			this.warn('remove_adapter:adapter does\'t exist [' + adapter_name + ']')
			return false
		}

		arg_adapter.destroy()
		delete this._adapters[adapter_name]
		this._emit('adapter.removed', adapter_name)
		return true
	}



	/**
	 * Suspend a data adapter.
	 * 
	 * @param {DataAdapter} arg_adapter - data adapter.
	 * 
	 * @returns {boolean}
	 */
	suspend_adapter(arg_adapter)
	{
		assert( T.isObject(arg_adapter) && arg_adapter.is_data_adapter, context + ':suspend_adapter:bad data adapter object')
		
		arg_adapter.suspend()
	}



	/**
	 * Resume a data adapter.
	 * 
	 * @param {DataAdapter} arg_adapter - data adapter.
	 * 
	 * @returns {boolean}
	 */
	resume_adapter(arg_adapter)
	{
		assert( T.isObject(arg_adapter) && arg_adapter.is_data_adapter, context + ':resume_adapter:bad data adapter object')
		
		arg_adapter.resume()
	}



	/**
	 * Get a data collection for a model.
	 * 
	 * @param {string} arg_model_name - data collection model name.
	 * 
	 * @returns {DataCollection|undefined}
	 */
	get_collection(arg_model_name)
	{
		assert( T.isOString(arg_model_name), context + ':get_collection:bad data collection model name string')
		
		if (arg_model_name in this._collections)
		{
			
			return this._collections[arg_model_name]
		}

		this.warn('get_collection:collection doesn\'t exist')
		return undefined
	}



	/**
	 * Add a data collection.
	 * 
	 * @param {DataCollection} arg_collection - data collection.
	 * 
	 * @returns {boolean}
	 */
	add_collection(arg_collection)
	{
		assert( T.isObject(arg_collection) && arg_collection.is_data_collection, context + ':add_collection:bad data collection object')
		
		const collection_name = arg_collection.get_name()
		if (collection_name in this._collections)
		{
			this.warn('add_collection:collection exist')
			return false
		}

		this._collections[collection_name] = arg_collection
		this._emit('collection.added', collection_name)
		return true
	}



	/**
	 * Remove a data collection.
	 * 
	 * @param {DataCollection} arg_collection - data collection.
	 * 
	 * @returns {boolean}
	 */
	remove_collection(arg_collection)
	{
		assert( T.isObject(arg_collection) && arg_collection.is_data_collection, context + ':remove_collection:bad data collection object')
		
		const collection_name = arg_collection.get_name()
		if ( !(collection_name in this._collections) )
		{
			this.warn('remove_collection:collection doesn\'t exist [' + collection_name + ']')
			return false
		}

		arg_collection.destroy()

		delete this._collections[collection_name]
		this._emit('collection.removed', collection_name)
		return true
	}



	/**
	 * Create a data collection record.
	 * 
	 * @param {string} arg_collection_name - data collection name.
	 * @param {string} arg_record_id - data record id.
	 * @param {object} arg_record_datas - data record datas.
	 * 
	 * @returns {Promise} - Promise of a DataRecord object.
	 */
	create_record(arg_collection_name, arg_record_id, arg_record_datas)
	{
		assert( T.isString(arg_collection_name), context + ':create_record:bad data collection string')
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':create_record:bad record id string')
		assert( T.isObject(arg_record_datas), context + ':create_record:bad record datas object')
		
		// CHECK COLLECTION NAME
		if (! (arg_collection_name in this._collections) )
		{
			this.warn('create_record:collection doesn\'t exist [' + arg_collection_name + ']')
			return Promise.reject('create_record:bad collection name [' + arg_collection_name + ']')
		}

		// GET COLLECTION
		const collection = this._collections[arg_collection_name]
		assert( T.isObject(collection) && collection.is_data_collection, context + ':create_record:bad data collection object')
		
		// CHECK EXISTING RECORD
		const check_record_promise = collection.has_record_by_id(arg_record_id)
		return check_record_promise.then(
			(found)=>{
				if (! found)
				{
					this.warn('create_record:collection record id already exists collection=[' + arg_collection_name + '] id=[' + arg_record_id + ']')
					return Promise.reject('create_record:bad collection [' + arg_collection_name + '] id [' + arg_record_id + ']')
				}
				return collection.create_record(arg_record_id, arg_record_datas)
			}
		)
	}



	/**
	 * Delete a data collection record.
	 * 
	 * @param {string} arg_collection_name - data collection name.
	 * @param {string} arg_record_id - data record id.
	 * 
	 * @returns {Promise} - Promise of boolean success.
	 */
	delete_record(arg_collection_name, arg_record_id)
	{
		assert( T.isString(arg_collection_name), context + ':delete_record:bad data collection string')
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':delete_record:bad record id string')
		
		// CHECK COLLECTION NAME
		if (! (arg_collection_name in this._collections) )
		{
			this.warn('delete_record:collection doesn\'t exist [' + arg_collection_name + ']')
			return Promise.reject('delete_record:bad collection name [' + arg_collection_name + ']')
		}

		// GET COLLECTION
		const collection = this._collections[arg_collection_name]
		assert( T.isObject(collection) && collection.is_data_collection, context + ':delete_record:bad data collection object')
		
		return collection.delete_record(arg_record_id)
	}



	/**
	 * Update a data collection record.
	 * 
	 * @param {string} arg_collection_name - data collection name.
	 * @param {string} arg_record_id - data record id.
	 * @param {object} arg_record_datas - data record datas.
	 * 
	 * @returns {Promise} - Promise of boolean success.
	 */
	update_record(arg_collection_name, arg_record_id, arg_record_datas)
	{
		assert( T.isString(arg_collection_name), context + ':update_record:bad data collection string')
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':update_record:bad record id string')
		assert( T.isObject(arg_record_datas), context + ':update_record:bad record datas object')
		
		// CHECK COLLECTION NAME
		if (! (arg_collection_name in this._collections) )
		{
			this.warn('update_record:collection doesn\'t exist [' + arg_collection_name + ']')
			return Promise.reject('update_record:bad collection name [' + arg_collection_name + ']')
		}

		// GET COLLECTION
		const collection = this._collections[arg_collection_name]
		assert( T.isObject(collection) && collection.is_data_collection, context + ':update_record:bad data collection object')
		
		return collection.update_record(arg_record_id, arg_record_datas)
	}



	/**
	 * Update a data collection record.
	 * 
	 * @param {string} arg_collection_name - data collection name.
	 * @param {string} arg_record_id - data record id.
	 * 
	 * @returns {Promise} - Promise of boolean found:true, not found:false.
	 */
	has_record(arg_collection_name, arg_record_id)
	{
		assert( T.isString(arg_collection_name), context + ':has_record:bad data collection string')
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':has_record:bad record id string')
		
		// CHECK COLLECTION NAME
		if (! (arg_collection_name in this._collections) )
		{
			this.warn('update_record:collection doesn\'t exist [' + arg_collection_name + ']')
			return Promise.reject('update_record:bad collection name [' + arg_collection_name + ']')
		}

		// GET COLLECTION
		const collection = this._collections[arg_collection_name]
		assert( T.isObject(collection) && collection.is_data_collection, context + ':update_record:bad data collection object')
		
		// CHECK EXISTING RECORD
		return collection.has_record_by_id(arg_record_id)
	}



	/**
	 * Find an existing data record with an id.
	 * 
	 * @param {string} arg_collection_name - data collection name.
	 * @param {string} arg_record_id - data record id.
	 * 
	 * @returns {Promise} - Promise of DataRecord.
	 */
	find_one_record(arg_collection_name, arg_record_id)
	{
		assert( T.isString(arg_collection_name), context + ':find_one_record:bad data collection string')
		assert( T.isString(arg_record_id) && arg_record_id.length > 0, context + ':find_one_record:bad record id string')
		
		// CHECK COLLECTION NAME
		if (! (arg_collection_name in this._collections) )
		{
			this.warn('find_one_record:collection doesn\'t exist [' + arg_collection_name + ']')
			return Promise.reject('find_one_record:bad collection name [' + arg_collection_name + ']')
		}

		// GET COLLECTION
		const collection = this._collections[arg_collection_name]
		assert( T.isObject(collection) && collection.is_data_collection, context + ':find_one_record:bad data collection object')
		
		return collection.find_one_record(arg_record_id)
	}



	/**
	 * Find existing data records with a query.
	 * 
	 * @param {string} arg_collection_name - data collection name.
	 * @param {DataQuery} arg_query - data query.
	 * 
	 * @returns {Promise} - Promise of DataRecordArray.
	 */
	find_records(arg_collection_name, arg_query)
	{
		assert( T.isString(arg_collection_name), context + ':find_records:bad data collection string')
		assert( T.isObject(arg_query) && arg_query.is_data_query, context + ':find_records:bad query object')
		
		// CHECK COLLECTION NAME
		if (! (arg_collection_name in this._collections) )
		{
			this.warn('find_records:collection doesn\'t exist [' + arg_collection_name + ']')
			return Promise.reject('find_records:bad collection name [' + arg_collection_name + ']')
		}

		// GET COLLECTION
		const collection = this._collections[arg_collection_name]
		assert( T.isObject(collection) && collection.is_data_collection, context + ':find_records:bad data collection object')
		
		return collection.find_records(arg_query)
	}



	/**
	 * Find all existing data records.
	 * 
	 * @param {string} arg_collection_name - data collection name.
	 * 
	 * @returns {Promise} - Promise of DataRecordArray.
	 */
	find_all_records(arg_collection_name)
	{
		assert( T.isString(arg_collection_name), context + ':find_all_records:bad data collection string')
		
		// CHECK COLLECTION NAME
		if (! (arg_collection_name in this._collections) )
		{
			this.warn('find_all_records:collection doesn\'t exist [' + arg_collection_name + ']')
			return Promise.reject('find_all_records:bad collection name [' + arg_collection_name + ']')
		}

		// GET COLLECTION
		const collection = this._collections[arg_collection_name]
		assert( T.isObject(collection) && collection.is_data_collection, context + ':find_all_records:bad data collection object')
		
		return collection.find_all_records()
	}
}

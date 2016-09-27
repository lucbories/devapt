// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Loggable from '../base/loggable'
import DataCollection from './data_collection'
import DataRecord from '../data_record'


let context = 'common/data/data_adapter'



/**
 * @file DataAdapter class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DataAdapter extends Loggable
{
	/**
	 * DataAdapter class is responsible to manage one source of records for many model.
	 * DataAdapter instances are managed by a DataStore instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_database, arg_models_schemas)
	 * 		
	 * 		->suspend()
	 * 		->resume()
	 * 
	 * 		->add_model_schema(arg_model_schema)
	 * 		->remove_model_schema(arg_model_name)
	 * 		->get_model_schema(arg_model_name):TopologyRuntimeModelSchema
	 * 
	 * 		->get_collection(arg_model_name):DataCollection
	 * 
	 * 		->load_database(arg_topology_database)
	 * 		->load_model(arg_model_schema)
	 * 		->unload_model(arg_model_name)
	 * 		->load_associations()
	 * 
	 *	 	->new_record(arg_model_name, arg_record_datas, arg_record_id):DataRecord - create a new data record instance, not saved.
	 *	 	->delete_record(arg_model_name, arg_record_id):Promise(boolean) - delete an existing data record.
	 * 		->update_record(arg_model_name, arg_record_datas, arg_record_id):Promise(DataRecord) - update an existing data record.
	 * 		->has_record(arg_model_name, arg_record_id):Promise(boolean) - test if a data record exists with an id.
	 * 		
	 * 		->find_one_record(arg_model_name, arg_record_id):Promise(DataRecord) - find an existing data record with an id.
	 * 		->find_or_create_record(arg_model_name, arg_record_id):Promise(DataRecord) - find an existing data record with an id.
	 * 		->find_records(arg_model_name, arg_query):Promise(DataRecordArray) - find existing data records with a query.
	 * 		->find_all_records(arg_model_name):Promise(DataRecordArray) - find all xisting data records.
	 * 
	 * 	PRIVATE:
	 * 		->_emit(arg_event, arg_datas=undefined):nothing
	 * 
	 * 
	 * 	USAGE ON BROWSER:
	 * 		see DataStore
	 * 
	 * 
	 * @param {CacheManager} arg_cache_manager - cache manager instance.
	 * @param {TopologyRuntimeDatabase} arg_database - topology database.
	 * @param {object} arg_models_schemas - topology models schemas array.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_cache_manager, arg_database, arg_models_schemas=[])
	{
		assert( T.isObject(arg_cache_manager) && arg_cache_manager.is_cache_manager, context + ':constructor:bad cache manager object')
		assert( T.isObject(arg_database) && arg_database.is_topology_database, context + ':constructor:bad topology database object')
		assert( T.isArray(arg_models_schemas), context + ':constructor:bad topology models schema array')

		super(context)

		this.is_data_adapter = true
		this._cache_manager = arg_cache_manager

		// TOPOLOGY ITEMS
		this._topology_database = undefined
		this._topology_models_array = []
		this._topology_models_map = {}
		
		// ADAPTER ATTRIBUTES
		this._collections = {}
		this._roles = {}
		this._includes = {}

		// LOAD DATABASE AND MODEL
		this.database_promise = this.load_database(arg_database).then(
			(result)=>{
				if (result)
				{
					this._topology_database = arg_database
					const promises = []
					arg_models_schemas.forEach(
						(model_schema)=>{
							promises.push( this.add_model_schema(model_schema) )
						}
					)

					return Promise.all(promises).then(
						(results)=>{
							console.log(results, 'results')
							let all_result = true
							results.forEach( (result)=>{ all_result = all_result && result} )
							return all_result
						}
					)
				}
				return false
			}
		)
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
	 * Suspend adapter work.
	 * 
	 * @returns {Promise} - Promise(boolean) with true: suspend is success, false for failure
	 */
	suspend()
	{
		return Promise.resolve(false)
	}



	/**
	 * Resume adapter work.
	 * 
	 * @returns {Promise} - Promise(boolean) with true: resume is success, false for failure
	 */
	resume()
	{
		return Promise.resolve(false)
	}



	/**
	 * Add a model schema.
	 * 
	 * @param {TopologyRuntimeModelSchema} arg_model_schema - topology model schema.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	add_model_schema(arg_model_schema)
	{
		return this.load_model(arg_model_schema).then(
			(result)=>{
				if (result)
				{
					this._topology_models_array.push(arg_model_schema)
					this._topology_models_map[arg_model_schema.plural] = arg_model_schema
					arg_model_schema.index_in_array = this._topology_models_array.length - 1
				}
				return result
			}
		)
	}



	/**
	 * Remove a model schema.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	remove_model_schema(arg_model_name)
	{
		return this.unload_model(arg_model_name).then(
			(result)=>{
				if (result)
				{
					const index = this._topology_models_map[arg_model_name].index_in_array
					delete this._topology_models_array[index] // TODO CLEAN ARRAY
					delete this._topology_models_map[arg_model_name]
				}
				return result
			}
		)
	}



	/**
	 * Get a registered model schema.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * 
	 * @returns {TopologyRuntimeModelSchema} - model schema.
	 */
	get_model_schema(arg_model_name)
	{
		return (arg_model_name in this._topology_models_map) ? this._topology_models_map[arg_model_name] : undefined
	}



	/**
	 * Get a collection for a registered model schema.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * 
	 * @returns {DataCollection} - model collection instance.
	 */
	get_collection(arg_model_name)
	{
		if (! (arg_model_name in this._topology_models_map) )
		{
			console.debug(context + ':get_collection:bad model name')
			return undefined
		}

		const found_collection = (arg_model_name in this._collections) ? this.this._collections[arg_model_name] : undefined
		if (found_collection)
		{
			console.debug(context + ':get_collection:collection found')
			return found_collection
		}
		
		console.debug(context + ':get_collection:create collection')
		const model_schema = this._topology_models_map[arg_model_name]
		let collection = new DataCollection(this._cache_manager, this, model_schema)
		this._collections[arg_model_name] = collection
		return collection
	}



	/**
	 * Load adapter topology database.
	 * 
	 * @param {TopologyRuntimeDatabase} arg_topology_database - topology database.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	load_database(arg_topology_database)
	{
		return Promise.resolve(false)
	}



	/**
	 * Load model.
	 * 
	 * @param {TopologyRuntimeModelSchema} arg_model_schema - topology model schema.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	load_model(arg_model_schema)
	{
		return Promise.resolve(false)
	}



	/**
	 * Unload model.
	 * 
	 * @param {string} arg_model_name - model name.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	unload_model(arg_model_name)
	{
		return Promise.resolve(false)
	}


	
	/**
	 * Load associations between models.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	load_associations()
	{
		return Promise.resolve(false)
	}



	/**
	 * Create a new data record instance, not saved.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {object} arg_record_datas - new record attributes.
	 * @param {string} arg_record_id - new record unique id (optional).
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	new_record(arg_model_name, arg_record_datas, arg_record_id)
	{
		// CHECK ARGS
		if (! T.isString(arg_model_name))
		{
			return Promise.reject('bad model name string')
		}
		if (! ( T.isString(arg_record_id) || T.isNumber(arg_record_id) ) )
		{
			return Promise.reject('bad record id integer or string')
		}

		// GET COLLECTION
		const collection = this.get_collection(arg_model_name)
		if (!collection)
		{
			return Promise.reject('collection not found')
		}

		// GET TOPOLOGY MODEL
		const topology_model = this.get_model_schema(arg_model_name)
		if (!topology_model)
		{
			return Promise.reject('bad topology model')
		}

		// GET SEQUELIZE MODEL
		const sequelize_model = this.get_sequelize_model(arg_model_name)
		if (!sequelize_model)
		{
			return Promise.reject('bad sequelize model')
		}
		
		// GET PRIMARY KEY FIELD NAME
		const pk_name = topology_model.get_id_field_name()
		if (!pk_name)
		{
			return Promise.reject('bad pk name')
		}

		// CHECK ID
		if (! T.isString(arg_record_id) )
		{
			arg_record_id = arg_record_datas[pk_name]
		}
		if (! ( T.isString(arg_record_id) || T.isNumber(arg_record_id) ) )
		{
			return Promise.reject('id value not found')
		}

		// CHECK ATTRIBUTES
		if ( ! topology_model.validate() )
		{
			return Promise.reject('model attributes are not valid')
		}

		const record = new DataRecord(collection, arg_record_id, arg_record_datas)
		return Promise.resolve(record)
	}



	/**
	 * Delete an existing data record.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {string} arg_record_id - new record unique id (optional).
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	delete_record(arg_model_name, arg_record_id)
	{
		return Promise.resolve(false)
	}



	/**
	 * Update an existing data record.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {object} arg_record_datas - new record attributes.
	 * @param {string} arg_record_id - new record unique id (optional).
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	update_record(arg_model_name, arg_record_datas, arg_record_id)
	{
		return Promise.resolve(false)
	}



	/**
	 * Test if a data record exists with an id.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {string} arg_record_id - new record unique id.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	has_record(arg_model_name, arg_record_id)
	{
		return Promise.resolve(false)
	}



	/**
	 * Find an existing data record with an id.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {string} arg_record_id - new record unique id.
	 * 
	 * @returns {Promise} - Promise(DataRecord)
	 */
	find_one_record(arg_model_name, arg_record_id)
	{
		return Promise.resolve(undefined)
	}



	/**
	 * Find an existing data record with an id or create it with given datas.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {object} arg_record_datas - new record attributes.
	 * @param {string} arg_record_id - new record unique id.
	 * 
	 * @returns {Promise} - Promise(DataRecord)
	 */
	find_or_create_record(arg_model_name, arg_record_datas, arg_record_id)
	{
		return Promise.resolve(undefined)
	}



	/**
	 * Find existing data records corresponding to the given query.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {DataQuery} arg_query - data query instance.
	 * 
	 * @returns {Promise} - Promise(DataRecordArray)
	 */
	find_records(arg_model_name, arg_query)
	{
		return Promise.resolve(undefined)
	}



	/**
	 * Find all existing data records.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * 
	 * @returns {Promise} - Promise(DataRecordArray)
	 */
	find_all_records(arg_model_name)
	{
		return Promise.resolve(undefined)
	}
}



/*

Pubsub (interface)

Stability: 1 - Experimental
Adapters implementing the pubsub interface report changes from the service/database back up to the app.

They should emit an event on the sails object.



One-Way (interface)

Stability: 1 - Experimental
Adapters which implement one-way messages should do so using send() or a suffixed send*() method. This lets developers know that it's not safe to assume that these operations are reversible. An example of one such adapter is SMTP, for sending email, or APNS for sending Apple push notifications.

Class methods

send()




Blob (interface)

Stability: 1 - Experimental
e.g. sails-local-fs, sails-s3

Implementing the Blob interface allows you to upload and download binary data (aka files) to the service/database. These "blobs" might be MP3 music files (~5MB) but they could also be data-center backups (~50TB). Because of this, it's crucial that adapters which implement this interface use streams for uploads (incoming, into data source from Sails) and downloads (outgoing, from data source to Sails).

Class methods

write()
read()

*/


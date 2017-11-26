// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import Sequelize from 'sequelize'
import epilogue from 'epilogue'

// COMMON IMPORTS
import DataAdapter from '../data_adapter'
import load_sequelize_model from './load_sequelize_model'
import load_sequelize_association from './load_sequelize_association'


let context = 'common/data/sequelize/data_adapter_sequelize'



/**
 * @file Sequelize Data Adapter class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DataAdapterSequelize extends DataAdapter
{
	/**
	 * Create a DataAdapterSequelize instance.
	 * @extends DataAdapter
	 * 
	 * 	API:
	 * 		load_database(arg_database):Promise(boolean) - load database settings.
	 * 		load_model(arg_model_schema):Promise(boolean)
	 * 		load_associations():Promise(boolean)
	 * 		load_association(arg_asso_cfg):Promise(boolean)
	 * 
	 * 
	 * @param {CacheManager} arg_cache_manager - cache manager instance.
	 * @param {TopologyRuntimeDatabase} arg_database - topology database.
	 * @param {object} arg_sequelize_models_schemas - topology models schemas array.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_cache_manager, arg_database, arg_sequelize_models_schemas)
	{
		assert( T.isObject(arg_cache_manager) && arg_cache_manager.is_cache_manager, context + ':constructor:bad cache manager object')
		assert( T.isObject(arg_database) && arg_database.is_topology_database, context + ':bad topology database object')
		assert( T.isArray(arg_sequelize_models_schemas), context + ':bad topology models schemas array')
		
		super(arg_cache_manager, arg_database, arg_sequelize_models_schemas)
		
		this.is_data_adapter_sequelize = true

		// this._sequelize_db = null
		// this._sequelize_models = {}
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
		this._sequelize_models = {}
		this._associations = {}

		// SET DB DIALECT
		let db_dialect = null
		switch(arg_topology_database.db_engine.toLocaleLowerCase())
		{
			case 'mysql':
			case 'mariadb':
			case 'sqlite':
			case 'postgres':
			case 'mssql':
				db_dialect = arg_topology_database.db_engine.toLocaleLowerCase()
				break
		}
		assert.ok(db_dialect !== null, context + ':bad db dialect')
		
		// SET DB SETTINGS
		this._db_sequelize_options = {
			dialect:db_dialect,
			// dialectOptions: { charset:'utf-8'},
			
			host:arg_topology_database.db_host,
			port:arg_topology_database.db_port,
			
			logging:console.log, // OR false
			
			pool: {
				max: arg_topology_database.get_setting('pool_max', 5),
				min: arg_topology_database.get_setting('pool_min', 0),
				idle: arg_topology_database.get_setting('pool_idle', 10000)
			}
		}
		
		// SET SQLITE FILE
		if (db_dialect === 'sqlite')
		{
			this._db_sequelize_options.storage = arg_topology_database.get_setting('file', undefined)
			assert.ok( (typeof this._db_sequelize_options.storage).toLocaleLowerCase() === 'string', context + ':bad sqlite file')
		}
		
		// DEFINE AUTH DATABASE
		this._sequelize_db = new Sequelize(arg_topology_database.db_name, arg_topology_database.db_user, arg_topology_database.db_password, this._db_sequelize_options)
		
		return Promise.resolve(true)
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
		return load_sequelize_model(this, arg_model_schema)
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
	 * Load association between two models.
	 * 
	 * @param {object} arg_association_setting - association settings.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	load_association(arg_association_setting)
	{
		return load_sequelize_association(this, arg_association_setting)
	}



	/**
	 * Get a sequelize model by its name.
	 * 
	 * @param {string} arg_model_name - model name.
	 * 
	 * @returns {object} - sequelize model object.
	 */
	get_sequelize_model(arg_model_name)
	{
		return (arg_model_name in this._sequelize_models) ? this._sequelize_models[arg_model_name] : undefined
	}


	
	/**
	 * Load associations between: a model can include attributes of an other model.
	 * 
	 * @param {TopologyRuntimeModelSchema} arg_model_schema - model schema resource.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	load_associations()
	{
		if (! this._associations)
		{
			return
		}
		for(let asso of this._associations)
		{
			this.load_association(asso)
		}

		return Promise.resolve(true)
	}



	/**
	 * Load included schema: a model can include attributes of an other model.
	 * 
	 * @param {TopologyRuntimeModelSchema} arg_model_schema - model schema resource.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	load_includes(arg_model_schema)
	{
		// LOAD INCLUDED MODELS
		// console.log(arg_adapter._includes, arg_adapter.$name + '.includes')
		
		const schema_name = arg_model_schema.get_setting('plural')

		if ( ! T.isArray(this._includes) )
		{
			this.error('model.includes is not an array')
			return Promise.reject(context + ':load_includes:model.includes is not an array for: ' + schema_name)
		}
		
		for(let include of this._includes[schema_name])
		{
			var loop_model = include.sequelize_model

			if ( T.isString(loop_model) )
			{
				// arg_adapter.info('adding include [' + loop_model + ']')
				include.sequelize_model = arg_model_schema
			}
			// console.log(arg_adapter._includes[arg_index].sequelize_model, 'arg_adapter._includes[arg_index].sequelize_model');
		}

		return Promise.resolve(true)
	}
	
	

	/**
	 * Get epilogue resource for a rest server.
	 * 
	 * @param {Server} arg_server - server instance.
	 * @param {string} arg_route - prefix of epilogue rest route.
	 * 
	 * @returns {object} - epilogue resource.
	 */
	get_epilogue_resource(arg_server, arg_route)
	{
		this.info('get epilogue resource for route [' + arg_route + ']')
		
		var epilogue_settings = {
			model: this.sequelize_model,
			endpoints: [arg_route + '/' + this.$name, arg_route + '/' + this.$name + '/:' + this.sequelize_model.primaryKeyAttribute],
			include: this._includes/*,
			search: {
				param: 'searchOnlyUsernames',
				operator: '$gt', // $like as default or $ne, $not, $gte, $gt, $lte, $lt, $like (default), $ilike/$iLike, $notLike, $notILike
				attributes: [ 'username' ]
			},
			sort: {
				default: '-email,username',
				param: 'orderby',
				attributes: [ 'username' ]
			},
			pagination: false // default: true with use of offset and count or page and count
		*/
		}
	
		// INITIALIZE EPILOGUE
		epilogue.initialize(
			{
				app: arg_server.server,
				sequelize: this._sequelize_db
			}
		)
		
		let epilogue_resource = epilogue.resource(epilogue_settings)
		
		return epilogue_resource
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
	// new_record(arg_model_name, arg_record_datas, arg_record_id)
	// {
	// 	return Promise.resolve(false)
	// }



	/**
	 * Create a new data record.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {object} arg_record_datas - new record attributes.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	create_record(arg_model_name, arg_record_datas)
	{
		// CHECK ARGS
		if (! T.isString(arg_model_name))
		{
			return Promise.reject('bad model name string')
		}
		if (! T.isObject(arg_record_datas))
		{
			return Promise.reject('bad record attributes object')
		}

		// GET SEQUELIZE MODEL
		const sequelize_model = this.get_sequelize_model(arg_model_name)
		if (!sequelize_model)
		{
			return Promise.reject('bad sequelize model')
		}

		// DEFINE OPERATION OPTIONS
		const options = {
			isNewRecord:true,
			logging:false,
			benchmark:false
		}

		// DO OPERATION
		return sequelize_model.create(arg_record_datas, options)
		.then(
			(model_instance)=>{
				return model_instance ? true : false
			}
		)
	}



	/**
	 * Delete an existing data record.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {string} arg_record_id - new record unique id.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	delete_record(arg_model_name, arg_record_id)
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

		// DEFINE OPERATION OPTIONS
		const options = {
			where:{},
			limit:1,
			logging:false,
			benchmark:false
		}
		options.where[pk_name] = arg_record_id

		// DO OPERATION
		const result_promise = sequelize_model.destroy(options)
		.then(
			(count)=>{
				if (count == 1)
				{
					return true
				}
				return false
			}
		)
		return result_promise
	}



	/**
	 * Update an existing data record.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {object} arg_record_datas - new record attributes.
	 * 
	 * @returns {Promise} - Promise(boolean)
	 */
	update_record(arg_model_name, arg_record_datas)
	{
		// CHECK ARGS
		if (! T.isString(arg_model_name))
		{
			return Promise.reject('bad model name string')
		}
		
		// GET TOPOLOGY MODEL
		const topology_model = this.get_model_schema(arg_model_name)
		if (!topology_model)
		{
			return Promise.reject('bad topology model')
		}

		// GET PRIMARY KEY FIELD NAME
		const pk_name = topology_model.get_id_field_name()
		if (!pk_name)
		{
			return Promise.reject('bad pk name')
		}

		// CHECK ARGS
		if (! T.isObject(arg_record_datas))
		{
			return Promise.reject('bad record attributes object')
		}
		if ( ! (pk_name in arg_record_datas) )
		{
			return Promise.reject('id not found in record attributes')
		}

		// GET SEQUELIZE MODEL
		const sequelize_model = this.get_sequelize_model(arg_model_name)
		if (!sequelize_model)
		{
			return Promise.reject('bad sequelize model')
		}

		// DEFINE OPERATION OPTIONS
		const options = {
			where:{},
			limit:1,
			logging:false,
			benchmark:false
		}
		options.where[pk_name] = arg_record_datas[pk_name]

		// DO OPERATION
		return sequelize_model.update(arg_record_datas, options)
		.then(
			(result)=>{
				return result[0] == 1
			}
		)
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
		// CHECK ARGS
		if (! T.isString(arg_model_name))
		{
			return Promise.reject('bad model name string')
		}
		if ( ! (T.isString(arg_record_id) || T.isNumber(arg_record_id) ) )
		{
			return Promise.reject('bad record id')
		}
		
		// GET TOPOLOGY MODEL
		const topology_model = this.get_model_schema(arg_model_name)
		if (!topology_model)
		{
			return Promise.reject('bad topology model')
		}

		// GET PRIMARY KEY FIELD NAME
		const pk_name = topology_model.get_id_field_name()
		if (!pk_name)
		{
			return Promise.reject('bad pk name')
		}

		// GET SEQUELIZE MODEL
		const sequelize_model = this.get_sequelize_model(arg_model_name)
		if (!sequelize_model)
		{
			return Promise.reject('bad sequelize model')
		}

		// DEFINE OPERATION OPTIONS
		const options = {
			where:{},
			distinct:true,
			logging:false,
			benchmark:false
		}
		options.where[pk_name] = arg_record_id

		// DO OPERATION
		return sequelize_model.count(options)
		.then(
			(result)=>{
				return result == 1
			}
		)
	}



	/**
	 * Find an existing data record with an id.
	 * 
	 * @param {string} arg_model_name - topology model name.
	 * @param {string} arg_record_id - new record unique id.
	 * 
	 * @returns {Promise} - Promise(object)
	 */
	find_one_record(arg_model_name, arg_record_id)
	{
		// CHECK ARGS
		if (! T.isString(arg_model_name))
		{
			return Promise.reject('bad model name string')
		}
		if ( ! (T.isString(arg_record_id) || T.isNumber(arg_record_id) ) )
		{
			return Promise.reject('bad record id')
		}
		
		// GET TOPOLOGY MODEL
		const topology_model = this.get_model_schema(arg_model_name)
		if (!topology_model)
		{
			return Promise.reject('bad topology model')
		}

		// GET PRIMARY KEY FIELD NAME
		const pk_name = topology_model.get_id_field_name()
		if (!pk_name)
		{
			return Promise.reject('bad pk name')
		}

		// GET SEQUELIZE MODEL
		const sequelize_model = this.get_sequelize_model(arg_model_name)
		if (!sequelize_model)
		{
			return Promise.reject('bad sequelize model')
		}

		// DEFINE OPERATION OPTIONS
		const options = {
			where:{},
			attributes:topology_model.get_fields_names(),
			raw:true,
			logging:false,
			benchmark:false
		}
		options.where[pk_name] = arg_record_id

		// DO OPERATION
		return sequelize_model.findOne(options)
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

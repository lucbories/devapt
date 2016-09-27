// NPM IMPORTS
import chai from 'chai'

const expect = chai.expect

// COMMON IMPORTS
import CacheManager from '../../../../common/cache/cache_manager'
import CacheAdapterNodecache from '../../../../common/cache/cache_adapter_node_cache'
import DataAdapterSequelize from '../../../../common/datas/sequelize/data_adapter_sequelize'
import DataAdapter from '../../../../common/datas/data_adapter'
import TopologyRuntimeDatabase from '../../../../common/topology/runtime/topology_runtime_database'
import TopologyRuntimeModelSchema from '../../../../common/topology/runtime/topology_runtime_model_schema'


const users_schema = require('./users.json')

describe('Sequelize', () => {
	
	describe('DataAdapterSequelize(.db, [])', () => {
		// const ts_start = Date.now()
		let data_adapter = undefined
		let promise0 = undefined
		// let promise1 = undefined
		let topology_db = undefined
		let cache_manager = new CacheManager()

		it('Create CacheManager', () => {
			const cache_adapter = new CacheAdapterNodecache({ttl:300, check_period:1000})
			cache_manager.add_adapter(cache_adapter)
		} )

		it('Create TopologyRuntimeDatabase', () => {
			
			const topology_db_settings = {
				"engine": "mysql",
				"host": "localhost",
				"port": "3306",
				"database": "auth_dev",
				"user": "root",
				"password": "",
				"charset": "Latin1"
			}

			topology_db = new TopologyRuntimeDatabase('db', topology_db_settings, 'unit test context')
			// console.info(Date.now() - ts_start)
		} )

		it('Load TopologyRuntimeDatabase', () => {
			topology_db.load()
		} )

		it('Create DataAdapterSequelize', () => {
			const topology_models = []

			data_adapter = new DataAdapterSequelize(cache_manager, topology_db, topology_models)
			expect( data_adapter).to.be.an('object')
			expect( data_adapter).to.be.an.instanceof(DataAdapter)
			expect( data_adapter).to.be.an.instanceof(DataAdapterSequelize)
			expect( data_adapter.is_data_adapter).equal(true)
			expect( data_adapter.is_data_adapter_sequelize).equal(true)
		} )

		it('adapter.add_model_schema(users_schema)', ()=>{
			const topology_model = new TopologyRuntimeModelSchema('users', users_schema)
			promise0 = data_adapter.add_model_schema(topology_model)
			
			return promise0.then( (result)=>{
				expect(result).equal(true)
			} )
		} )

		it(' users:sequelize find all (raw)', ()=>{
			// const collection = data_adapter.get_collection('users')
			// collection.findAll()
			const model = data_adapter.get_sequelize_model('users')
			promise0 = model.findAll( { attributes:["id_user", "login"], raw:true } )
			return promise0.then( (result)=>{
				expect(result).to.be.an('array')

				const item_0 = result[0]

				expect(item_0).to.be.an('object')
				expect( Object.keys(item_0).length ).equal(2)

				expect(item_0.id_user).to.be.a('number')
				expect(item_0.login).to.be.a('string')

				// console.log(item_0, 'find all [0]')
			} )
		} )

		it(' users:sequelize find all (model)', ()=>{
			// const collection = data_adapter.get_collection('users')
			// collection.findAll()
			const model = data_adapter.get_sequelize_model('users')
			promise0 = model.findAll( { attributes:["id_user", "login"], raw:false } )
			return promise0.then( (result)=>{
				expect(result).to.be.an('array')

				const item_0 = result[0]
				// console.log(Object.keys(item_0), 'find all [0].keys')

				expect(item_0).to.be.an('object')
				expect( Object.keys(item_0).length ).equal(8)

				expect(item_0.dataValues.id_user).to.be.a('number')
				expect(item_0.dataValues.login).to.be.a('string')

				// console.log(item_0.dataValues, 'find all [0]')
			} )
		} )

		
		// it(' users:find one', ()=>{
		// 	const query = {
		// 		where: {},
		// 		attributes: ['id_user', 'login', 'email']
		// 	}
			// const topology_model = new TopologyRuntimeModelSchema('users', users_schema)
			// promise0 = data_adapter.add_model_schema(topology_model)
			
			// return promise0.then( (result)=>{
			// 	expect(result).equal(true)
			// } )
		// } )
	} )
} )

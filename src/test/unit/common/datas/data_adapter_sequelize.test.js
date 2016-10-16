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
		let users_collection = undefined
		let topology_db = undefined
		let cache_manager = new CacheManager()

		// it('Create CacheManager adapter', () => {
		// 	const cache_adapter = new CacheAdapterNodecache({ttl:300, check_period:1000})
		// 	cache_manager.add_adapter(cache_adapter)
		// } )

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

		
		it(' users:adapter.get_collection(users)', ()=>{
			users_collection = data_adapter.get_collection('users')

			expect(users_collection).to.be.an('object')
			expect(users_collection.is_data_collection).equal(true)
		} )

		it(' users:collection.has_record(...)', ()=>{
			let id = '4'
			users_collection.has_record(id).then(
				(found)=>{
					expect(found).equal(true)
				}
			)
			
			id = '2333333'
			return users_collection.has_record(id).then(
				(found)=>{
					expect(found).equal(false)
				}
			)
		} )
		
		const id = '999999999'

		const attributes = {
			users_login:"login_999",
			users_email:"email_999",
			users_lastname:"lastname_999",
			users_firstname:"firstname_999",
			users_password:"password_999"
		}

		it(' users:adapter.get_collection(users).delete_record("999999999")', ()=>{
			return users_collection.get_adapter().delete_record('users', '999999999')
			.then(
				()=>{
					console.log('record is deleted with id', id)
				}
			)
		} )

		it(' users:collection.new_record({...}, "999999999") and save', ()=>{
			users_collection._has_cached_record_by_id(id)
			.then(
				(found)=>{
					expect(found).equal(false)
				}
			)
			return users_collection.new_record(attributes, id)
			.then(
				(record)=>{
					console.log('record is created with id', id)
					// console.log('record.get_id()', record.get_id())
					// console.log('record._attributes', record._attributes)
					
					expect(record).to.be.an('object')
					expect(record.is_data_record).equal(true)
					expect(record._has_dirty_attributes).equal(false)

					expect(record.get_id()).equal(id)

					expect(record.get('users_id_user')).equal(id)
					expect(record.get('users_login')).equal('login_999')
					expect(record.get('users_email')).equal('email_999')
					expect(record.get('users_lastname')).equal('lastname_999')
					expect(record.get('users_firstname')).equal('firstname_999')
					expect(record.get('users_password')).equal('password_999')

					record.set('users_lastname', 'lastname_99988')
					expect(record._has_dirty_attributes).equal(true)
					expect(record.get('users_lastname')).equal('lastname_99988')

					record.set('users_lastname', 'lastname_999')
					expect(record._has_dirty_attributes).equal(true)
					expect(record.get('users_lastname')).equal('lastname_999')

					return record.save()
				}
			)
			.then(
				(save_result)=>{
					console.log('record is saved with id', id)
					expect(save_result).equal(true)
				}
			)
		} )
		
		it(' users:collection.find_one_record("999999999")', ()=>{
			return users_collection.find_one_record(id)
			.then(
				(record)=>{
					console.log('record is found with id', id)
					// console.log('record._id', record._id)

					expect(record).to.be.an('object')
					expect(record.is_data_record).equal(true)
					expect(record._has_dirty_attributes).equal(false)
					expect(record.get_id()).equal(id)
				}
			)
		} )
		
		// it(' users:collection.find_all_records()', ()=>{
		// 	return users_collection.find_all_records()
		// 	.then(
		// 		(record_array)=>{
		// 			console.log('records array', record_array)

		// 			expect(record_array).to.be.an('object')
		// 			expect(record_array.is_data_record_array).equal(true)
		// 			expect(record_array.size()).gt(5)
		// 		}
		// 	)
		// } )
	} )
} )

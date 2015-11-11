
import T from 'typr'
import assert from 'assert'
import Sequelize from 'sequelize'

import Resource from './resource'



let context = 'common/base/database'


export default class Database extends Resource
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, 'Database')
		
		this.is_database = true
		this.$type = 'models'
	}
	
	load()
	{
		const cx_obj = this.$settings.toJS()
		
		// GET ATTRIBUTES
		let cfg_db_engine = '' + cx_obj.engine
		// let cfg_db_charset = '' + cx_obj.charset
		// let cfg_db_options = '' + cx_obj.options // TODO
		let cfg_db_name = cx_obj.database_name
		let cfg_db_user = cx_obj.user_name
		let cfg_db_password = cx_obj.user_pwd
		
		// SET DB DIALECT
		let db_dialect = null
		switch(cfg_db_engine.toLocaleLowerCase())
		{
			case 'pdo_mysql':
			case 'mysql':
				db_dialect = 'mysql'
				break
				
			case 'pdo_mariadb':
			case 'mariadb':
				db_dialect = 'mariadb'
				break
				
			case 'pdo_sqlite':
			case 'sqlite':
				db_dialect = 'sqlite'
				break
				
			case 'pdo_postgres':
			case 'postgres':
				db_dialect = 'postgres'
				break
				
			case 'pdo_mssql':
			case 'mssql':
				db_dialect = 'mssql'
				break
				
			// case 'mongodb':
			//   db_dialect = 'mongodb';
			//   break;
		}
		assert.ok(db_dialect !== null, context + ':bad db dialect')
		
		// SET DB SETTINGS
		let db_options = {
			dialect:db_dialect,
			// dialectOptions: { charset:'utf-8'},
			
			host:cx_obj.host,
			port:cx_obj.port,
			
			logging:console.log, // OR false
			
			pool: {
				max: cx_obj.pool_max ? cx_obj.pool_max : 5,
				min: cx_obj.pool_min ? cx_obj.pool_min : 0,
				idle: cx_obj.pool_idle ? cx_obj.pool_idle : 10000
			}
		}
		
		// SET SQLITE FILE
		if (db_dialect === 'sqlite')
		{
			assert.ok( (typeof cx_obj.file).toLocaleLowerCase() === 'string', context + ':bad sqlite file')
			db_options.storage = cx_obj.file
		}
		
		// if (cfg_db_options !== '')
		// {
		//   db_options.dialectOptions = cfg_db_options; // TODO CONVERT STRING TO PLAIN OBJECT
		// }
	
		// DEFINE AUTH DATABASE
		this.sequelize = new Sequelize(cfg_db_name, cfg_db_user, cfg_db_password, db_options)
		
		
		super.load()
	}
	
	
	export_settings()
	{
		let cfg = this.$settings.toJS()
		
		// SANITY CHECK OF CONNEXIONS
		if (cfg.collection === 'connexions' || cf.type === 'connexions')
		{
			cfg.host = 'host';
			cfg.port = 'port';
			cfg.user_name = 'user';
			cfg.user_pwd = '******';
		}
		
		return cfg
	}
}

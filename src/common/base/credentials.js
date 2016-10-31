// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import util from 'util'
import { fromJS } from 'immutable'
import Digest from '../utils/digest'
import EncodeDecode from '../utils/encode_decode'
import EncryptDecrypt from '../utils/encrypt_decrypt'


const context = 'common/base/credentials'



const default_credentials = {
	tenant:undefined,		// Tenant name (mandatory)
	env:undefined,			// Environment code: dev, test, int, rec, pro (mandatory)
	application:undefined,	// Application name (mandatory)

	token:undefined,
	user_name:undefined,
	user_pass_digest:undefined,

	ts_login:undefined,
	ts_expiration:undefined,

	errors_count:0,
	renew_count:0,

	hash:undefined
}



/**
 * @file Credentials class: contains authentication informations.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Credentials
{
    /**
     * Create a Credentials instance. Store credentials values into an immutable Map.
	 * 
	 * 	API:
	 * 		->set_credentials(arg_datas):nothing - check and set crendtials datas.
	 * 		
	 * 		->dump():string - dump credentials to a readable string without sensitive datas.
	 * 		->digest_password(arg_string):string - hash credentials password (static).
	 * 		
	 * 		->serialize(arg_app_secret):string - transform credentials to a string.
	 * 		->deserialize(string, arg_app_secret):boolean - load credentials from a string.string
	 * 
	 * 		->encrypt(arg_app_key):string - encrypted string.
	 * 		->decrypt(arg_string, arg_app_key):boolean - success or failure.
	 * 
	 * 		->extract(arg_string):object - extract a record with credentials values from a formatted string.
	 * 
     * @param {object} arg_datas - credentials datas object.
	 * 
     * @returns {nothing}
     */
	constructor(arg_datas=default_credentials, update_handler=undefined)
	{
		assert( T.isObject(arg_datas), context + ':bad runtime object')
		this.is_credentials = true

		this._credentials = fromJS(default_credentials)
		// this._crypt_mode = 'AES-CBC' // (other modes include: CFB, OFB, CTR, and GCM)
		// this._crypt_key_length = 32
		// this._crypt_iv_length = 8
		// this._crypt_num_iterations = 10

		this.update_handler = update_handler

		this.set_credentials(arg_datas)
	}
    
    
	
	/**
	 * Get credentials datas.
	 * 
	 * @returns {object}
	 */
	get_credentials()
	{
		const datas = this._credentials.toJS()
		return datas
	}
    
    
	
	/**
	 * Get credentials tenant.
	 * 
	 * @returns {string|undefined}
	 */
	get_tenant()
	{
		return this._credentials.get('tenant', undefined)
	}
    
    
	
	/**
	 * Get credentials environment.
	 * 
	 * @returns {string|undefined}
	 */
	get_env()
	{
		return this._credentials.get('env', undefined)
	}
    
    
	
	/**
	 * Get credentials application.
	 * 
	 * @returns {string|undefined}
	 */
	get_application()
	{
		return this._credentials.get('application', undefined)
	}
    
    
	
	/**
	 * Get credentials token.
	 * 
	 * @returns {string|undefined}
	 */
	get_token()
	{
		return this._credentials.get('token', undefined)
	}
    
    
	
	/**
	 * Get credentials user.
	 * 
	 * @returns {string|undefined}
	 */
	get_user()
	{
		return this._credentials.get('user_name', undefined)
	}
    
    
	
	/**
	 * Get credentials user.
	 * 
	 * @returns {string|undefined}
	 */
	get_pass_digest()
	{
		return this._credentials.get('user_pass_digest', undefined)
	}
    
    
	
	/**
	 * Get credentials url part.
	 * 
	 * @returns {string}
	 */
	get_url_part()
	{
		return 'username=' + this.get_user() + '&password=' + this.get_pass_digest() + '&token=' + this.get_token()
	}
    
    
	
	/**
	 * Get credentials datas.
	 * 
	 * @returns {object}
	 */
	get_credentials_for_template()
	{
		const credentials_obj = this._credentials.toJS()
		const template_datas = {
			credentials_tenant:credentials_obj.tenant,
			credentials_env:credentials_obj.env,
			credentials_application:credentials_obj.application,

			credentials_token:credentials_obj.token,
			credentials_user_name:credentials_obj.user_name,
			credentials_pass_digest:credentials_obj.user_pass_digest,
			
			credentials_login:credentials_obj.ts_login,
			credentials_expire:credentials_obj.ts_expiration,

			credentials_errors_count:credentials_obj.errors_count,
			credentials_renew_count:credentials_obj.renew_count,

			credentials_hash:credentials_obj.hash
		}
		return template_datas
	}
    
	

	/**
	 * Get empty credentials record.
	 * 
	 * @returns {object}
	 */
	static get_empty_credentials()
	{
		const template_datas = {
			tenant:undefined,
			env:undefined,
			application:undefined,

			token:undefined,
			user_name:undefined,
			user_pass_digest:undefined,
			
			ts_login:undefined,
			ts_expiration:undefined,

			errors_count:0,
			renew_count:0,

			hash:undefined
		}
		return default_credentials
	}
    
    
	
			
	/**
	 * Credentials are valid for access.
	 * 
	 * @returns {boolean}
	 */
	is_valid() // TODO
	{
		return true
	}

    
	
	/**
	 * Check and set credentials datas.
	 * 
     * @param {object} arg_datas - credentials datas object.
	 * 
	 * @returns {boolean}
	 */
	set_credentials(arg_datas)
	{
		assert( T.isObject(arg_datas), context + ':set_credentials:bad arg_datas object')

		assert( T.isString(arg_datas.tenant) && arg_datas.tenant.length > 0, context + ':set_credentials:bad tenant string')
		assert( T.isString(arg_datas.env) && arg_datas.env.length > 0, context + ':set_credentials:bad env string')
		assert( T.isString(arg_datas.application) && arg_datas.application.length > 0, context + ':set_credentials:bad application string')

		assert( T.isString(arg_datas.token), context + ':set_credentials:bad token string')
		assert( T.isString(arg_datas.user_name), context + ':set_credentials:bad user_name string')
		assert( T.isString(arg_datas.user_pass_digest), context + ':set_credentials:bad user_pass_digest string')

		if ( T.isString(arg_datas.ts_login) )
		{
			try{
				arg_datas.ts_login = parseInt(arg_datas.ts_login)
			}
			catch(e)
			{}
		}
		if ( T.isString(arg_datas.ts_expiration) )
		{
			try{
				arg_datas.ts_expiration = parseInt(arg_datas.ts_expiration)
			}
			catch(e)
			{}
		}
		assert( T.isNumber(arg_datas.ts_login), context + ':set_credentials:bad ts_login number')
		assert( T.isNumber(arg_datas.ts_expiration), context + ':set_credentials:bad ts_expiration number')

		if ( T.isString(arg_datas.errors_count) )
		{
			try{
				arg_datas.errors_count = parseInt(arg_datas.errors_count)
			}
			catch(e)
			{}
		}
		if ( T.isString(arg_datas.renew_count) )
		{
			try{
				arg_datas.renew_count = parseInt(arg_datas.renew_count)
			}
			catch(e)
			{}
		}
		assert( T.isNumber(arg_datas.errors_count), context + ':set_credentials:bad errors_count number')
		assert( T.isNumber(arg_datas.renew_count), context + ':set_credentials:bad renew_count number')

		let datas = {}
		datas.tenant = arg_datas.tenant
		datas.env = arg_datas.env
		datas.application = arg_datas.application

		datas.token = arg_datas.token
		datas.user_name = arg_datas.user_name
		datas.user_pass_digest = arg_datas.user_pass_digest

		datas.ts_login = arg_datas.ts_login
		datas.ts_expiration = arg_datas.ts_expiration

		datas.errors_count = arg_datas.errors_count
		datas.renew_count = arg_datas.renew_count

		const head = util.format('tenant:%s,env:%s,app:%s', datas.tenant, datas.env, datas.application)
		const auth = util.format('token:%s,user:%s,pass:%s', datas.token ? datas.token : 'none', datas.user_name ? datas.user_name : 'none', datas.user_pass_digest ? datas.user_pass_digest : 'none')
		const str = util.format('CREDENTIALS:{%s,%s}', head, auth)
		datas.hash = Digest.hash(str, 'sha256', 'hex')

		this._credentials = fromJS(datas)

		if ( T.isFunction(this.update_handler) )
		{
			this.update_handler(this._credentials)
		}

		return true
	}



	/**
	 * Dump credentials datas to a readable string without sensitive datas.
	 * 
	 * @returns {string} - readable string without sensitive datas.
	 */
	dump()
	{
		const datas = this._credentials.toJS()
		const head = util.format('tenant:%s,env:%s,app:%s', datas.tenant, datas.env, datas.application)
		const auth = util.format('token:%s,user:%s,pass:%s', datas.token ? datas.token : 'none', datas.user_name ? datas.user_name : 'none', datas.user_pass_digest ? '***' : 'none')
		const foot = util.format('start:%n,expire:%n,errors:%n,renews:%n', datas.ts_login, datas.ts_expiration, datas.errors_count, datas.renew_count)
		
		return util.format('CREDENTIALS:{%s,%s,%s}', head, auth, foot)
	}



	/**
	 * Transform credentials password with a hash method.
	 * 
	 * @param {string} arg_password - password string.
	 * 
	 * @returns {string} - hashed string.
	 */
	static digest_password(arg_password)
	{
		return Digest.hash(arg_password, 'sha256', 'hex')
	}



	/**
	 * Transform credentials to a string without encryption which could be sent over a network.
	 * 
	 * @returns {string} - serialized string.
	 */
	serialize()
	{
		const datas = this._credentials.toJS()
		const head = util.format('tenant:%s,env:%s,app:%s', datas.tenant, datas.env, datas.application)
		const auth = util.format('token:%s,user:%s,pass:%s', datas.token ? datas.token : 'none', datas.user_name ? datas.user_name : 'none', datas.user_pass_digest ? datas.user_pass_digest : 'none')
		const str = util.format('CREDENTIALS:{%s,%s}', head, auth)

		return EncodeDecode.encode(str, 'base64')
	}



	/**
	 * Deserialize credentials from a string without encryption.
	 * @TODO: use RegExp to split the string into credentials attributes.
	 * 
	 * @param {string} arg_string - serialized string.
	 * 
	 * @returns {boolean} - deserialized string success or failure.
	 */
	deserialize(arg_string)
	{
		const str = EncodeDecode.decode(arg_string, 'base64')
		const record = this.extract(str)

		return this.set_credentials(record)
	}



	/**
	 * Transform credentials to a string with encryption.
	 * 
	 * @param {string} arg_app_key - encryption key.
	 * 
	 * @returns {string} - encrypted string.
	 */
	encrypt(arg_app_key)
	{
		const datas = this._credentials.toJS()
		const head = util.format('tenant:%s,env:%s,app:%s', datas.tenant, datas.env, datas.application)
		const auth = util.format('token:%s,user:%s,pass:%s', datas.token ? datas.token : 'none', datas.user_name ? datas.user_name : 'none', datas.user_pass_digest ? datas.user_pass_digest : 'none')
		const str = util.format('CREDENTIALS:{%s,%s}', head, auth)

		return EncryptDecrypt.encrypt(str, arg_app_key)
	}



	/**
	 * Decrypt credentials encrypted string.
	 * 
	 * @param {string} arg_string - string.
	 * @param {string} arg_app_key - encryption key.
	 * 
	 * @returns {string} - encrypted string.
	 */
	decrypt(arg_string, arg_app_key)
	{
		const str = EncryptDecrypt.decrypt(arg_string, arg_app_key)
		const record = this.extract(str)

		return this.set_credentials(record)
	}



	/**
	 * Extract credentials fields from a string (password should be hashed and encoded, only [a-zA-Z0-9_] chars).
	 * 
	 * @param {string} arg_string - string as "CREDENTIALS:{tenant:%s,env:%s,app:%s,token:%s,user:%s,pass:%s}".
	 * 
	 * @returns {object} - credentials values record.
	 */
	extract(arg_string)
	{
		const regexp = /CREDENTIALS:{([a-zA-Z0-9_:]+),([a-zA-Z0-9_:]+),([a-zA-Z0-9_:]+),([a-zA-Z0-9_:]+),([a-zA-Z0-9_:]+),([a-zA-Z0-9_:]+)}/
		const results = regexp.exec(arg_string)

		if (results.length != 6)
		{
			console.log(context + ':extract:bad format [%s]', arg_string)
			return false
		}
		
		let values = []
		results.forEach(
			(str)=>{
				const parts = str.split(':')
				const value = parts.length == 2 ? parts[1] : undefined
				values.push(value)
			}
		)

		const record = {
			tenant:results[0],
			env:results[1],
			application:results[2],

			token:results[3],
			user_name:results[4],
			user_pass_digest:results[5]
		}

		return record
	}
}

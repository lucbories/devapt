
import T from 'typr'
import assert from 'assert'
import lowdb from 'lowdb'
import path from 'path'

import runtime from '../base/runtime'

import AuthenticationPluginPassportLocal from './authentication_plugin_passport_local'


let context = 'common/security/authentication_plugin_passport_local_file'



/**
 * Authentication class for Passport Local file strategy.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationPluginPassportLocalFile extends AuthenticationPluginPassportLocal
{
    /**
     * Create an Authentication plugin class based on passport local file strategy.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication_passport_local_file = true
        
        this.passport.serializeUser(
            function(user, done)
            {
                done(null, this.get_user_id(user))
            }
        )
        
        this.passport.deserializeUser(
            function(id, done)
            {
                this.get_user_by_id(id).then(
                    function(user)
                    {
                        done(null, user)
                    },
                    function()
                    {
                        done('not found', false)
                    }
                )
            }
        )
	}
    
    
	/**
     * Enable authentication plugin with contextual informations.
     * @param {object|undefined} arg_settings - optional contextual settings.
     * @returns {object} - a promise object of a boolean result (success:true, failure:false)
     */
	enable(arg_settings)
	{
        let resolved_promise = super.enable(arg_settings)
        
        // SET FILE NAME
        this.file_name = null
        if (arg_settings && T.isString(arg_settings.file_name) )
        {
            this.file_name = arg_settings.file_name
        }
        
        // LOAD FILE DB
        this.file_db = null
        if (this.file_name)
        {
            resolved_promise = resolved_promise.then(
                function()
                {
                    const base_dir = runtime.get_setting('base_dir', null)
                    assert( T.isString(base_dir), context + ':enable:bad base dir string')
                    
                    const json_full_path = path.join(base_dir, this.file_name)
                    
                    // OPEN DATABASE
                    const db_settings = {
                        autosave:true,
                        async:true
                    }
                    this.file_db = lowdb(json_full_path, db_settings)
                }
            )
        }
        
        return resolved_promise
    }
    
    
    /**
     * Authenticate a user with a file giving request credentials.
     * @param {object|undefined} arg_credentials - request credentials object
     * @returns {object} - a promise of boolean
     */
    authenticate(arg_credentials)
    {
        assert( T.isObject(this.db), context + ':authenticate:bad db object')
        assert( T.isObject(arg_credentials), context + ':authenticate:bad credentials object')
        assert( T.isString(arg_credentials.username), context + ':authenticate:bad credentials.username string')
        assert( T.isString(arg_credentials.password), context + ':authenticate:bad credentials.password string')
        
        // CREATE QUERY
        const username_field = this.username_fieldname ? this.username_fieldname : 'username'
        const password_field = this.id_password_fieldnamefieldname ? this.password_fieldname : 'password'
        let query = {}
        query[username_field] = arg_credentials.username
        query[password_field] = arg_credentials.password
        
        // EXECUTE QUERY
        try{
            const users = this.db('users').find(query)
            if (users)
            {
                const first_user = (T.isArray(users) && users.length > 0) ? users[0] : (T.isObject(users) ? users : null)
                if ( T.isFunction(arg_credentials.done_cb) )
                {
                    arg_credentials.done_cb(first_user)
                }
                return Promise.resolved(true)
            }
        }
        catch(e)
        {
        }
        
        return Promise.resolved(false)
    }
    
    
    /**
     * Get user id from a user record.
     * @param {object} arg_user_record - user record object
     * @returns {string} - user id
     */
    get_user_id(arg_user_record)
    {
        const id_field = this.id_fieldname ? this.id_fieldname : 'id'
        return ( T.isObject(arg_user_record) && (id_field in arg_user_record) ) ? arg_user_record[id_field] : null
    }
    
    
    /**
     * Get user record by its id.
     * @param {string} arg_user_id - user id
     * @returns {string} - user id
     */
    get_user_by_id(arg_user_id)
    {
        assert( T.isObject(this.db), context + ':get_user_by_id:bad db object')
        
        // CREATE QUERY
        const id_field = this.id_fieldname ? this.id_fieldname : 'id'
        let query = {}
        query[id_field] = arg_user_id
        
        // EXECUTE QUERY
        try{
            let users = this.db('users').find(query)
            if (users)
            {
                return (T.isArray(users) && users.length > 0) ? users[0] : (T.isObject(users) ? users : null)
            }
        }
        catch(e)
        {
        }
        
        return null
    }
}

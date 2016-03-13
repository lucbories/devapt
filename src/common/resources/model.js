
import T from 'typr'
import assert from 'assert'
import Sequelize from 'sequelize'
import epilogue from 'epilogue'

import Resource from '../base/resource'
import runtime from '../base/runtime'
import to_boolean from '../utils/to_boolean'



let context = 'common/resources/model'


export default class Model extends Resource
{
	constructor(arg_name, arg_settings, arg_context)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, 'Model', arg_context ? arg_context : context)
		
		this.is_model = true
        this.$type = 'models'
	}
    
    
    load()
    {
    }

      
	export_settings()
	{
		const cfg = this.$settings.toJS()
		
		return cfg
	}
    
    
    /**
     * Find a record by its id.
     * @abstract
     * @param {string|number} arg_id - record id
     * @returns {Promise} - promise of found record or null
     */
    find_record_by_id(arg_id)
    {
        assert( T.isString(arg_id) || T.isNumber(arg_id), context + ':find_record_by_id:bad id string or number')
        
        // TO IMPLEMENT IN SUBCLASSES
        
        return Promise.resolve(null)
    }
    
    
    /**
     * Find a record with a set of values.
     * @abstract
     * @param {object} arg_values_map - values map
     * @returns {Promise} - promise of found record or null
     */
    find_record_by_values(arg_values_map)
    {
        assert( T.isObject(arg_values_map), context + ':find_record_by_id:bad values object')
        
        // TO IMPLEMENT IN SUBCLASSES
        
        return Promise.resolve(null)
    }
}



/*

// REGISTER A MODEL
    models[arg_model_name] = {
      database:arg_cx_name,
      name:arg_model_name,
      model:arg_model,
      roles:arg_roles,
      includes: arg_includes
    }

*/
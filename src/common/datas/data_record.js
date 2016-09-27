// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import {Map} from 'immutable'


let context = 'common/data/data_record'



/**
 * @file DataRecord class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DataRecord
{
	/**
	 * Data record class, contains one collection item attributes.
	 * 
	 * 
	 * 	API:
	 * 		->constructor(arg_collection, arg_id, arg_attributes)
	 * 
	 * 		->get_collection():DataCollection - get record collection.
	 * 
	 * 		->get_type():string - get record type.
	 * 		->get_id():string - get record id.
	 * 		->get_id_field_name():string - get record id.
	 * 		->get_attributes():Immutable.Map - get record attributes.
	 * 
	 * 		->set(arg_attribute_name, arg_attribute_value):boolean - set an attribute value.
	 * 		->get(arg_attribute_name):any - get an attribute value.
	 * 
	 * 		->save():Promise - save all changed attributes to the collection store.
	 * 		->rollback():boolean - disguard any unsaved changed attributes.
	 * 		->remove():Promise - remove record from collection store.
	 * 		->reload():Promise - restore attributes from collection store.
	 * 
	 * 		->serialize():string - transform attributes map to a string.
	 * 		->deserialize(string):boolean - load attributes from a string.
	 * 
	 * 		->fill(arg_datas):boolean - fill attributes with given datas.
	 * 		->clear():boolean - fill attributes with default datas.
	 * 
	 * 
	 * @param {DataCollection} arg_data_collection - data collection: contains schema.
	 * @param {string} arg_id - data id, unique in collection.
	 * @param {object|Immutable.Map} arg_attributes - initial datas values.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_data_collection, arg_id, arg_attributes)
	{
		assert( T.isObject(arg_data_collection) && arg_data_collection.is_data_collection, context + ':constructor:bad model object')
		assert( T.isString(arg_id) && arg_id.length > 0, context + ':constructor:bad id string')
		assert( T.isObject(arg_attributes), context + ':constructor:bad attributes object')

		this.is_data_record = true

		this._collection = arg_data_collection
		this._id = arg_id
		this._attributes = (arg_attributes.has && arg_attributes.get && arg_attributes.getIn) ? arg_attributes : new Map(arg_attributes)
		this._has_dirty_attributes = false
		this._dirty_attributes = []
		this._previous_attributes = this._attributes
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
	}



	/**
	 * Check attribute name and value against model schema.
	 * 
	 * @param {string} arg_attribute_name - attribute name.
	 * @param {any} arg_attribute_value - attribute value.
	 * 
	 * @returns {boolean}
	 */
	_check_attribute(arg_attribute_name, arg_attribute_value) // TODO
	{
		return true
	}



	/**
	 * Get record model.
	 * 
	 * @returns {DataModel}
	 */
	get_model()
	{
		return this._model
	}



	/**
	 * Get record collection.
	 * 
	 * @returns {DataCollection}
	 */
	get_collection()
	{
		return this._model.get_collection()
	}



	/**
	 * Get record type.
	 * 
	 * @returns {string}
	 */
	get_type()
	{
		return this._model.get_name()
	}



	/**
	 * Get record id.
	 * 
	 * @returns {string}
	 */
	get_id()
	{
		return this._id
	}



	/**
	 * Get record id field name.
	 * 
	 * @returns {string}
	 */
	get_id_field_name()
	{
		return this.get_collection().get_schema().get_id_field_name()
	}



	/**
	 * Get record attributes.
	 * 
	 * @returns {Immutable.Map}
	 */
	get_attributes()
	{
		return this._attributes
	}



	/**
	 * Set an attribute value.
	 * 
	 * @param {string} arg_attribute_name - attribute name.
	 * @param {any} arg_attribute_value - attribute value.
	 * 
	 * @returns {boolean}
	 */
	set(arg_attribute_name, arg_attribute_value)
	{
		const check = this._check_attribute(arg_attribute_name, arg_attribute_value)
		if (!check)
		{
			return false
		}

		this._has_dirty_attributes = true
		if ( this._dirty_attributes.indexOf(arg_attribute_name) == -1 )
		{
			this._dirty_attributes.push(arg_attribute_name)
		}
		this._attributes = this._attributes.set(arg_attribute_name, arg_attribute_value)
		this._emit('changed', {arg_attribute_name:arg_attribute_value})

		return true
	}



	/**
	 * Get an attribute value.
	 * 
	 * @param {string} arg_attribute_name - attribute name.
	 * 
	 * @returns {any|undefined}
	 */
	get(arg_attribute_name)
	{
		return this._attributes.get(arg_attribute_name, undefined)
	}



	/**
	 * Save all attributes values to the collection store.
	 * 
	 * @returns {Promise} - promise of success (boolean)
	 */
	save()
	{
		return this._model.get_collection().save(this).then(
			(success)=>{
				if (success)
				{
					this._emit('saved')
					this._has_dirty_attributes = false
					this._dirty_attributes = []
					this._previous_attributes = this._attributes
				}
			}
		)
	}



	/**
	 * Disguard all dirty attributes values.
	 * 
	 * @returns {Promise} - promise of success (boolean)
	 */
	rollback()
	{
		this._emit('rollbacked')
		this._has_dirty_attributes = false
		this._dirty_attributes = []
		this._attributes = this._previous_attributes
		return Promise.resolve(true)
	}



	/**
	 * Delete record from collection store.
	 * 
	 * @returns {Promise} - promise of success (boolean)
	 */
	remove()
	{
		return this._model.get_collection().remove(this).then(
			(success)=>{
				if (success)
				{
					this._emit('removed')
					this._has_dirty_attributes = false
					this._dirty_attributes = []
					this._previous_attributes = this._attributes = new Map()
				}
			}
		)
	}



	/**
	 * Reload record from collection store.
	 * 
	 * @returns {Promise} - promise of success (boolean)
	 */
	reload()
	{
		return this._model.get_collection().reload(this).then(
			(success)=>{
				if (success)
				{
					this._emit('reloaded')
					this._has_dirty_attributes = false
					this._dirty_attributes = []
					this._previous_attributes = this._attributes
				}
			}
		)
	}



	/**
	 * Transform attributes to a string.
	 * 
	 * @returns {string} - serialized attributes.
	 */
	serialize() // TODO
	{
		return ''
	}



	/**
	 * Transform attributes string to an object.
	 * 
	 * @param {stirng} arg_serialized - serialized attributes.
	 *  
	 * @returns {boolean} - success.
	 */
	deserialize() // TODO
	{
		return false
	}



	/**
	 * Fill all attributes values with given dats.
	 * 
	 * @param {arg_datas} - new attribute values.
	 * 
	 * @returns {boolean} - success.
	 */
	fill(arg_datas)
	{
		if ( ! T.isObject(arg_datas) )
		{
			return false
		}

		const backup = this._attributes
		let result = true
		Object.keys(arg_datas).forEach(
			(attribute_name)=>{
				const value = arg_datas[attribute_name]
				if ( ! this.set(attribute_name, value) )
				{
					result = false
					return
				}
				if ( this._dirty_attributes.indexOf(attribute_name) == -1 )
				{
					this._dirty_attributes.push(attribute_name)
				}
			}
		)

		if (! result)
		{
			this._attributes = backup
			return false
		}

		this._emit('filled')
		this._has_dirty_attributes = true
		return true
	}



	/**
	 * Clear all attributes values with default values.
	 * 
	 * @returns {boolean} - success.
	 */
	clear()
	{
		const backup = this._attributes
		let result = true
		this._dirty_attributes = []
		this._model.get_fields().forEach(
			(field)=>{
				result = result && this.set(field.get_name(), field.get_default())
				this._dirty_attributes.push(field.get_name())
			}
		)

		if (!result)
		{
			this._attributes = backup
			return false
		}

		this._has_dirty_attributes = true
		this._emit('cleared')
		return true
	}
}
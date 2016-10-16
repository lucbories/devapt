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

		this._is_new = false
		this._id = arg_id
		this._id_field_name = this._collection.get_schema().get_id_field_name()
		this._attributes = new Map()
		this.set_attributes(arg_attributes)
		if (this._id)
		{
			this.set(this._id_field_name, this._id)
		}

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
		return this._collection
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
	 * Get record fields names.
	 * 
	 * @returns {array} - array of all schema fields names strings.
	 */
	get_fields_names()
	{
		return this.get_collection().get_schema().get_fields_names()
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
	 * Get record attributes.
	 * 
	 * @returns {object}
	 */
	get_attributes_object()
	{
		return this._attributes.toJS()
	}



	/**
	 * Set record attributes and normalize with schema.
	 * 
	 * @param {object|Immutable.Map} arg_attributes - attributes map.
	 * 
	 * @returns {nothing}
	 */
	set_attributes(arg_attributes)
	{
		this._previous_attributes = this._attributes
		this._attributes = (arg_attributes.has && arg_attributes.get && arg_attributes.getIn) ? arg_attributes : new Map(arg_attributes)
		// console.log('record._attributes 1', this._attributes)

		const fields_names = this.get_fields_names()
		const defaults_values = this.get_collection().get_schema().get_defaults()

		fields_names.forEach(
			(field_name)=>{
				if(this._attributes.has(field_name) || this._id_field_name == field_name)
				{
					return
				}
				
				this._attributes.set(field_name, defaults_values[field_name])
			}
		)
		// console.log('record._attributes 2', this._attributes)

		this._has_dirty_attributes = true
		this._dirty_attributes = Object.keys( this._attributes.toJS() )
	}
	



	/**
	 * Set an attribute value.
	 * 
	 * @param {string|array} arg_attribute_path - attribute name or path.
	 * @param {any} arg_attribute_value - attribute value.
	 * 
	 * @returns {boolean}
	 */
	set(arg_attribute_path, arg_attribute_value)
	{
		const check = this._check_attribute(arg_attribute_path, arg_attribute_value)
		if (!check)
		{
			return false
		}

		this._has_dirty_attributes = true
		if ( this._dirty_attributes.indexOf(arg_attribute_path) == -1 )
		{
			this._dirty_attributes.push(arg_attribute_path)
		}
		this._attributes = this._attributes.set(arg_attribute_path, arg_attribute_value)
		this._emit('changed', {path:arg_attribute_path, value:arg_attribute_value})

		return true
	}



	/**
	 * Get an attribute value.
	 * 
	 * @param {string|array} arg_attribute_path - attribute name or path.
	 * 
	 * @returns {any|undefined}
	 */
	get(arg_attribute_path)
	{
		return this._attributes.get(arg_attribute_path, undefined)
	}



	/**
	 * Save all attributes values to the collection store.
	 * 
	 * @returns {Promise} - promise of success (boolean)
	 */
	save()
	{
		let promise = undefined
		if (this._is_new)
		{
			promise = this.get_collection().create_record(this)
		} else {
			promise = this.get_collection().update_record(this)
		}
		
		return promise.then(
			(success)=>{
				if (success)
				{
					this._is_new = false
					this._emit('saved')
					this._has_dirty_attributes = false
					this._dirty_attributes = []
					this._previous_attributes = this._attributes
				}
				console.log(context + ':save:success', success)
				return success
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
		return this.get_collection().delete_record(this).then(
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
	 * Set record as removed.
	 * 
	 * @return {nothing}
	 */
	set_removed()
	{
		// TODO
	}



	/**
	 * Reload record from collection store.
	 * 
	 * @returns {Promise} - promise of success (boolean)
	 */
	reload()
	{
		return this.get_collection().reload_record(this).then(
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
	 * Fill all attributes values with given datas.
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
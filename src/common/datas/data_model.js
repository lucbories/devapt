// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import DataRecord from './data_record'


let context = 'common/data/data_model'



/**
 * @file DataModel class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DataModel extends DataRecord
{
	/**
	 * DataModel class inherits from DataRecord and aims to provide a high level API for sub-classes.
	 * 
	 * 	API:
	 * 		->constructor(arg_attributes)
	 * 
	 * 		->get_collection():DataCollection
	 * 		
	 * 		->set(arg_attribute_name, arg_attribute_value):boolean - set an attribute value.
	 * 		->get(arg_attribute_name):any - get an attribute value.
	 * 		->get_id():string - get id attribute value.
	 * 
	 * 		->save():Promise - save all changed attributes to the collection store.
	 * 		->rollback():boolean - disguard any unsaved changed attributes.
	 * 		->remove():Promise - remove record from collection store.
	 * 		->reload():Promise - restore attributes from collection store.
	 * 
	 * 
	 * 	USAGE ON BROWSER:
	 * 		class Cars extends DataModel {
	 * 			constructor(arg_attributes) {
	 * 				const ds = ... // get data store
	 * 				super(ds.get_collection('cars'), undefined, arg_attributes)
	 * 			}
	 * 		}
	 * 		var cars = new Cars( { engine:"fuel", color:"blue"} )
	 * 
	 * 
	 * @param {DataCollection} arg_data_collection - data collection: contains schema (mandatory).
	 * @param {string|undefined} arg_id - data id, unique in collection (optional).
	 * @param {object|Immutable.Map|undefined} arg_attributes - initial datas values (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_collection, arg_id, arg_attributes)
	{
		assert( T.isUndefined(arg_attributes) || T.isObject(arg_attributes), context + ':constructor:bad attributes object or undefined')

		if( T.isObject(arg_id) && T.isUndefined(arg_attributes) )
		{
			arg_attributes = arg_id
			arg_id = undefined
		}

		if ( T.isUndefined(arg_id) && T.isObject(arg_attributes) )
		{
			const id_field_name = arg_collection.get_id_field_name()
			if (id_field_name in arg_attributes)
			{
				arg_id = arg_attributes[id_field_name]
			}
		}

		super(arg_collection, arg_id, arg_attributes)

		this.is_data_model = true
	}
}
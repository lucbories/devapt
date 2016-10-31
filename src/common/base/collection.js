// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import CollectionBase from './collection_base'
import Instance from './instance'


let context = 'common/base/collection'



/**
 * @file Collection class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Collection extends CollectionBase
{
	/**
	 * Create a collection of Instance objects.
	 * 
	 * API:
	 * 		->set_all(arg_items):nothing - Set all collection items.
	 * 		->get_all(arg_types):array - Get all collection items or filter items with given type.
	 * 		->get_all_names(arg_types):array - Get all items names with or without a filter on items types.
	 * 		->get_all_ids():array - Get all items ids with or without a filter on items types.
	 * 
	 * 		->item(arg_name):Instance - Get an item by its name.
	 * 
	 * 		->get_count():number - Get all items count.
	 * 		->get_first():object|undefined - Get first item.
	 * 		->get_last():object|undefined - Get last item.
	 * 
	 * 		->add(arg_item):nothing - Add an item to the collection.
	 * 		->add_first(arg_item):nothing - Add an item to the collection at the first position.
	 * 		->remove(arg_item):nothing - Remove an item from the collection.
	 * 		->has(arg_item):boolean -  Test if an item is inside the collection.
	 * 
	 * 		->find_by_name(arg_name):Instance|undefined - Find an item by its name into the collection.
	 * 		->find_by_id(arg_id):Instance|undefined - Find an item by its id into the collection.
	 * 		->find_by_attr(arg_attr_name, arg_attr_value):Instance|undefined - Find an item by one of its attributes into the collection.
	 * 		->find_by_filter(arg_filter_function):Instance|undefined - Find an item by a filter function.
	 * 
	 * 		->filter_by_attr(arg_attr_name, arg_attr_value):array - Filter items by one of theirs attributes into the collection.
	 * 		->filter_by_filter(arg_filter_function):array - Filter items by a filter function.
	 * 
	 * 		->get_accepted_types():array - Get all collection accepted types.
	 * 		->set_accepted_types(arg_types):nothing - Set all collection accepted types.
	 * 		->add_accepted_type(arg_type):nothing - Add one collection accepted type.
	 * 		->has_accepted_type(arg_type):boolean - Test if collection has given accepted type.
	 * 
	 * 		->forEach(arg_cb):nothing - forEach wrapper on ordered items.
	 * 
	 * @param {...Instance} args - variadic list of Instance.
	 * 
	 * @returns {nothing}
	 */
	constructor(...args)
	{
		super()

		this.is_collection  = true

		if ( args.length == 1 && T.isArray(args[0]) )
		{
			args = args[0]
		}
		
		if (args && args.length > 0)
		{
			this.set_all(args)
		}
	}
}

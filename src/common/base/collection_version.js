// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import semver from 'semver'

// COMMON IMPORTS
import Instance from './instance'
import CollectionBase from './collection_base'


let context = 'common/base/collection_version'



/**
 * @file CollectionVersion class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class CollectionVersion extends CollectionBase
{
	/**
	 * Create a collection of versionned Instance objects.
	 * 
	 * API:
	 * 		->set_version_getter(arg_getter):nothing - Set version getter.
	 * 		->get_version(arg_item):string - Get instance version.
	 * 		->compare_versions(arg_version1, arg_version2):integer - Compare two instance versions: v1 < v2 => -1, v1 = v2 => 0, v1 > v2 => 1.
	 * 		
	 * 		->get_latest_item(arg_name):Instance|undefined - Get latest version of item by its name.
	 * 		->get_latest_items():array - Get latest version of all items.
	 * 		->get_item_of_version(arg_name, arg_version):Instance|undefined - Get an item by its name and its version.
	 * 		->has_version(arg_item_name, arg_version):boolean -  Test if an item is inside the collection.
	 * 
	 * INHERITED API:
	 * 		->set_all(arg_items):nothing - Set all collection items. (INHERITED)
	 * 		->get_all(arg_types):array - Get all collection items or filter items with given type. (INHERITED)
	 * 		->get_all_names(arg_types):array - Get all items names with or without a filter on items types. (INHERITED)
	 * 		->get_all_ids():array - Get all items ids with or without a filter on items types. (INHERITED)
	 * 
	 * 		->item(arg_name):Instance - Get an item by its name. (INHERITED)
	 * 
	 * 		->get_count():number - Get all items count. (INHERITED)
	 * 		->get_first():object|undefined - Get first item. (INHERITED)
	 * 		->get_last():object|undefined - Get last item. (INHERITED)
	 * 
	 * 		->add(arg_item):nothing - Add an item to the collection. (OVERWRITTEN)
	 * 		->add_first(arg_item):nothing - Add an item to the collection at the first position. (INHERITED)
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
		super(args, false)

		this.is_collection_version  = true

		this.$items_by_name_by_version     = {}
		this.$items_by_name_latest_version = {}
		this.$version_getter = (item)=> item && item.get_version ? item.get_version() : undefined

		if ( args.length == 1 && T.isArray(args[0]) )
		{
			args = args[0]
		}
		
		if (args && args.length > 0)
		{
			this.set_all(args)
		}
	}



	/**
	 * Set version getter.
	 * 
	 * @param {Function} arg_getter - instance version getter.
	 * 
	 * @returns {nothing}
	 */
	set_version_getter(arg_getter)
	{
		if ( T.isFunction(arg_getter) )
		{
			this.$version_getter = arg_getter
		}
	}



	/**
	 * Get instance version.
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {string}
	 */
	get_version(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			return T.isFunction(this.$version_getter) ? this.$version_getter(arg_item) : undefined
		}

		return undefined
	}



	/**
	 * Compare two instance versions: v1 < v2 => -1, v1 = v2 => 0, v1 > v2 => 1.
	 * 
	 * @param {string} arg_version1 - requested instance 1 version.
	 * @param {string} arg_version2 - requested instance 2 version.
	 * 
	 * @returns {integer}
	 */
	compare_versions(arg_version1, arg_version2)
	{
		return semver.compare(arg_version1, arg_version2)
		// return (arg_version1 < arg_version2) ? -1 : ( (arg_version1 == arg_version2) ? 0 : 1) // TODO
	}
	


	/**
	 * Get latest version of item by its name.
	 * 
	 * @param {string} arg_name - instance name.
	 * 
	 * @returns {Instance|undefined}
	 */
	get_latest_item(arg_name)
	{
		return this.$items_by_name_latest_version ? this.$items_by_name_latest_version[arg_name] : undefined
	}
	


	/**
	 * Get latest version of all items.
	 * 
	 * @returns {array}
	 */
	get_latest_items()
	{
		const items = this.$items_by_name_latest_version ? _.toArray(this.$items_by_name_latest_version) : []
		// console.log(items.length, context + ':get_latest_items:items.length')
		return items
	}
	
	
	
	/**
	 * Get an item by its name and its version.
	 * 
	 * @param {string} arg_name - requested instance name.
	 * @param {string} arg_version - requested instance version.
	 * 
	 * @returns {Instance|undefined}
	 */
	get_item_of_version(arg_name, arg_version)
	{
		const versions = this.$items_by_name_by_version ? this.$items_by_name_by_version[arg_name] : undefined
		return versions ? versions[arg_version] : undefined
	}
	
	

	/**
	 * Test if an item is inside the collection.
	 * 
	 * @param {string} arg_item_name - Instance item name.
	 * @param {string} arg_version - requested instance version.
	 * 
	 * @returns {boolean}
	 */
	has_version(arg_item_name, arg_version)
	{
		if ( ! this.$items_by_name_by_version[arg_item_name] )
		{
			return false
		}
		return arg_version in this.$items_by_name_by_version[arg_item_name]
	}
	
	

	/**
	 * Add an item to the collection without type checks (unsafe).
	 * @private
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {nothing}
	 */
	_add(arg_item)
	{
		if( this._has(arg_item) )
		{
			return
		}

		const name = arg_item.get_name()
		const id   = arg_item.get_id()
		const version = this.get_version(arg_item)

		this.$items_array.push(arg_item)
		this.$items_by_name[name] = arg_item
		this.$items_by_id[id] = arg_item

		if (! this.$items_by_name_by_version[name])
		{
			this.$items_by_name_by_version[name] = {}
			this.$items_by_name_latest_version[name] = undefined
		}

		this.$items_by_name_by_version[name][version] = arg_item
		if ( this.$items_by_name_latest_version[name] )
		{
			const prev_latest = this.get_version(this.$items_by_name_latest_version[name])
			const comparison = this.compare_versions(version, prev_latest)
			if (comparison == 1)
			{
				this.$items_by_name_latest_version[name] = arg_item
			}
		} else {
			this.$items_by_name_latest_version[name] = arg_item
		}
	}
	
	

	/**
	 * Add an item to the collection without type checks at first position (unsafe).
	 * @private
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {nothing}
	 */
	_add_first(arg_item)
	{
		if( this._has(arg_item) )
		{
			return
		}

		this._add(arg_item)
		this.$items_array.pop()
		this.$items_array = [arg_item].concat(this.$items_array)
	}
	
	

	/**
	 * Remove an item from the collection without type checks (unsafe).
	 * @private
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {nothing}
	 */
	_remove(arg_item)
	{
		const name = arg_item.get_name()
		const id   = arg_item.get_id()
		const version = this.get_version(arg_item)
		const index = this.$items_array.indexOf(arg_item)

		this.$items_array.splice(index, 1)
		delete this.$items_by_name[name]
		delete this.$items_by_id[id]

		if ( this.$items_by_name_by_version[name] )
		{
			delete this.$items_by_name_by_version[name][version]
		}
		delete this.$items_by_name_latest_version[name]
	}
	
	

	/**
	 * Test if an item is inside the collection without type checks (unsafe).
	 * @private
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {boolean}
	 */
	_has(arg_item)
	{
		const name = arg_item.get_name()
		const version = this.get_version(arg_item)
		return (name in this.$items_by_name) && this.has_version(name, version)
	}
}

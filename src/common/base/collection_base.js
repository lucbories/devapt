// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// COMMON IMPORTS
import Errorable from './errorable'
import Instance from './instance'


let context = 'common/base/collection_base'



/**
 * @file CollectionBase class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class CollectionBase extends Errorable
{
	/**
	 * Create a collection of Instance objects.
	 * @private
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
	 * @returns {nothing}
	 */
	constructor()
	{
		super(context, undefined)

		this.is_collection_base  = true

		this.$items_array   = []
		this.$items_by_name = {}
		this.$items_by_id   = {}

		this.$accepted_types = ['*']
	}



	/**
	 * Format string dump.
	 * 
	 * @returns{string}
	 */
	toString()
	{
		let str = '['
		_.forEach(this.$items_array, (item, index)=>(index > 0 ? ',' : '') + item.get_name() )
		return str + ']'
	}
	
	
	
	/**
	 * Set all collection items.
	 * 
	 * @param {Instance|array} arg_items - collection items: one or many Instance objects.
	 * 
	 * @returns {nothing}
	 */
	set_all(arg_items)
	{
		// DEBUG
		let str = '['
		_.forEach(arg_items, (item, index)=> str += (index > 0 ? ',' : '') + (item.get_name ? item.get_name() : 'bad item of type ' + (typeof item) ) )
		str += ']'
		console.log('set_all', str, typeof arg_items)

		// RESET STORES
		this.$items_array   = []
		this.$items_by_name = {}
		this.$items_by_id   = {}

		// ONE INSTANCE IS GIVEN
		if ( T.isObject(arg_items) && arg_items instanceof Instance )
		{
			this._add(arg_item)
			return
		}
		
		// AN OBJECT OR AN ARRAY IS GIVEN
		if ( T.isObject(arg_items) || T.isArray(arg_items) )
		{
			_.forEach(arg_items,
				(item)=>{
					if ( T.isObject(item) && item instanceof Instance )
					{
						this._add(item)
					}
				}
			)
			return
		}

		console.error(context + '::bad given items type (not an Instance, object, array)')
	}
	
	
	
	/**
	 * Get all collection items or filter items with given type.
	 * 
	 * @param {array|string|nothing} arg_types - type or types for items filtering.
	 * 
	 * @returns {array} - all or filtered items, empty array if not found.
	 */
	get_all(arg_types)
	{
		// NO TYPE FILTER
		if (! arg_types)
		{
			return _toArray( this.$items_array )
		}

		// ONE TYPE FILTER
		if ( T.isString(arg_types) )
		{
			return _.filter(this.$items_array, item => item.get_types() == arg_types )
		}

		// MANY TYPES FILTER
		if ( T.isArray(arg_types) )
		{
			return _.filter(this.$items_array, item => arg_types.indexOf( item.get_types() ) >= 0 )
		}

		return []
	}
	
	
	
	/**
	 * Get all items names with or without a filter on items types.
	 * 
	 * @param {array|string|nothing} arg_types - type or types for items filtering.
	 * 
	 * @returns {array} - all or filtered items names, empty array if not found.
	 */
	get_all_names(arg_types)
	{
		// NO TYPE FILTER
		if (! arg_types)
		{
			return _.map(this.$items_array, (item) => item.get_name() )
		}

		// ONE TYPE FILTER
		if ( T.isString(arg_types) )
		{
			return _.filter( this.$items_array, item => item.get_types() == arg_types ).map( (item) => item.get_name() )
		}

		// MANY TYPES FILTER
		if ( T.isArray(arg_types) )
		{
			return _.filter( this.$items_array, item => arg_types.indexOf( item.get_types() ) >= 0 ).map( (item) => item.get_name() )
		}

		return []
	}
	
	

	/**
	 * Get all items ids with or without a filter on items types.
	 * 
	 * @returns {array} - all items ids.
	 */
	get_all_ids()
	{
		return _.map(this.$items_array, (item) => item.get_id() )
	}
	
	
	
	/**
	 * Get an item by its name.
	 * 
	 * @param {string} arg_name - instance name.
	 * 
	 * @returns {Instance|undefined}
	 */
	item(arg_name)
	{
		return this.$items_by_name ? this.$items_by_name[arg_name] : undefined
	}
	
	
	
	/**
	 * Get an item by its name.
	 * 
	 * @param {string} arg_name - instance name.
	 * 
	 * @returns {Instance|undefined}
	 */
	get(arg_name)
	{
		return this.$items_by_name ? this.$items_by_name[arg_name] : undefined
	}
	
	
	
	/**
	 * Default iterator operator.
	 */
	
	// * [Symbol.iterator]() {
	// 	for (let item of this.$items)
	// 	{
	// 		yield item
	// 	}
	// }
	
	// [Symbol.iterator]()
	// {
	// 	let step = 0
	// 	const count = this.$items.length
		
	// 	const iterator = {
	// 		next()
	// 		{
	// 			if (step < count)
	// 			{
	// 				const item = this.$items[step]
	// 				step++
	// 				return { value:item, done:false }
	// 			}
				
	// 			return { value:undefined, done:true }
	// 		}
	// 	}
		
	// 	return iterator
	// }
	
	
	// NOT COMPATIBLE WITH NODE 0.10
	// [Symbol.iterator]()
	// {
	// 	return this.$items.iterator()
	// }
	
	
	
	/**
	 * Get all items count.
	 * 
	 * @returns {number} - all items count.
	 */
	get_count()
	{
		return _.size(this.$items_array)
	}
    
    
	
	/**
	 * Get first item.
	 * 
	 * @returns {object|undefined} - first collection items or undefined if collection is empty.
	 */
	get_first()
    {
		return _.first(this.$items_array)
	}
	
	
    
	/**
	 * Get last item.
	 * 
	 * @returns {object|undefined} - last collection items or null if collection is empty.
	 */
	get_last()
    {
		return _.last(this.$items_array)
	}



	/**
	 * Add an item to the collection.
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {nothing}
	 */
	add(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			if ( this.has_accepted_type('*') || this.has_accepted_type( arg_item.get_type() ) )
			{
				this._add(arg_item)
				return
			}
			
			this.error('not accepted type [' + arg_item.get_type() + '] for instance [' + arg_item.get_name() + ']')
			return
		}
		
		this.error('bad item: not an instance object')
	}
	
	
	
	/**
	 * Add an item to the collection at the first position.
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {nothing}
	 */
	add_first(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			if ( this.has_accepted_type('*') || this.has_accepted_type(arg_item.$type) )
			{
				this._add_first(arg_item)
				return
			}
			
			this.error('not accepted type [' + arg_item.$type + '] for instance [' + arg_item.$name + ']')
			return
		}
		
		this.error('bad item: not an instance object')
	}
	
	
	
	/**
	 * Remove an item from the collection.
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {nothing}
	 */
	remove(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			const name = arg_item.get_name()
			if (name in this.$items_by_name)
			{
				this._remove(arg_item)
				return
			}
		}
		
		this.error('bad item: not an instance object or not found')
	}
	
	

	/**
	 * Test if an item is inside the collection.
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {boolean}
	 */
	has(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			return this._has(arg_item)
		}
		return false
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

		this.$items_array.push(arg_item)
		this.$items_by_name[name] = arg_item
		this.$items_by_id[id] = arg_item
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
		
		const name = arg_item.get_name()
		const id   = arg_item.get_id()

		this.$items_array = [arg_item].concat(this.$items_array)
		this.$items_by_name[name] = arg_item
		this.$items_by_id[id] = arg_item
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
		const name  = arg_item.get_name()
		const id    = arg_item.get_id()
		const index = this.$items_array.indexOf(arg_item)

		this.$items_array.splice(index, 1)
		delete this.$items_by_name[name]
		delete this.$items_by_id[id]
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
		return (name in this.$items_by_name)
	}
	
	
    
	/**
	 * Find an item by its name into the collection.
	 * 
	 * TODO: optimize with a map index.
	 * 
	 * @param {string} arg_name - instance name.
	 * 
	 * @returns {Instance|undefined}
	 */
	find_by_name(arg_name)
	{
		return this.$items_by_name[arg_name]
	}
	
	
	
	/**
	 * Find an item by its id into the collection.
	 * 
	 * @param {string} arg_id - instance id.
	 * 
	 * @returns {Instance|undefined}
	 */
	find_by_id(arg_id)
	{
		return this.$items_by_id[arg_id]
	}
	
	
	
	/**
	 * Find an item by one of its attributes into the collection.
	 * 
	 * @param {string} arg_attr_name - instance attribute name.
	 * @param {any} arg_attr_value - instance attribute value.
	 * 
	 * @returns {Instance|undefined}
	 */
	find_by_attr(arg_attr_name, arg_attr_value)
	{
		return _.find(this.$items_array, item => (arg_attr_name in item) && item[arg_attr_name] == arg_attr_value)
	}
	
	
	
	/**
	 * Find an item by a filter function.
	 * 
	 * @param {string} arg_filter_function - function to apply on instance, returns a boolean.
	 * 
	 * @returns {Instance|undefined}
	 */
	find_by_filter(arg_filter_function)
	{
		return _.find(this.$items_array, item => arg_filter_function(item) )
	}
	
	
	
	/**
	 * Filter items by one of theirs attributes into the collection.
	 * 
	 * @param {string} arg_attr_name - instance attribute name.
	 * @param {any} arg_attr_value - instance attribute value.
	 * 
	 * @returns {array}
	 */
	filter_by_attr(arg_attr_name, arg_attr_value)
	{
		return _.filter(this.$items_array, item => (arg_attr_name in item) && item[arg_attr_name] == arg_attr_value)
	}
	
	

	/**
	 * Filter items by a filter function.
	 * 
	 * @param {string} arg_filter_function - function to apply on instance, returns a boolean.
	 * 
	 * @returns {array}
	 */
	filter_by_filter(arg_filter_function)
	{
		return _.filter(this.$items_array, item => arg_filter_function(item) )
	}
	
	
	
	/**
	 * Get all collection accepted types.
	 * 
	 * @returns {array} - array of types strings.
	 */
	get_accepted_types()
	{
		this.$accepted_types
	}
	
	
	
	/**
	 * Set all collection accepted types.
	 * 
	 * @param {array} arg_types - accepted types strings array.
	 * 
	 * @returns {nothing}
	 */
	set_accepted_types(arg_types)
	{
		assert(T.isArray(arg_types), context + ':bad accepted types array')
		this.$accepted_types = arg_types
	}
	
	
	
	/**
	 * Add one collection accepted type.
	 * 
	 * @param {string} arg_type - accepted types string.
	 * 
	 * @returns {nothing}
	 */
	add_accepted_type(arg_type)
	{
		assert(T.isString(arg_type), context + ':bad accepted type string')
		this.$accepted_types.push(arg_type)
	}
	
	
	
	/**
	 * Test if collection has given accepted type.
	 * 
	 * @param {string} arg_type - accepted types string.
	 * 
	 * @returns {boolean}
	 */
	has_accepted_type(arg_type)
	{
		return this.$accepted_types.indexOf(arg_type) > -1
	}
	
	
	
	/**
	 * forEach wrapper on ordered items.
	 * 
	 * @param {function} arg_cb - callback to call on each item.
	 * 
	 * @returns {nothing}
	 */
	forEach(arg_cb)
	{
		_.forEach(this.$items_array, arg_cb)
	}
}

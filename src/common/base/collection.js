// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Errorable from './errorable'
import Instance from './instance'


let context = 'common/base/collection'



/**
 * @file Application class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Collection extends Errorable
{
	/**
	 * Create a collection of Instance objects.
	 * 
	 * API:
	 * 		->set_all(arg_items):nothing - 
	 * 		->get_all(arg_types):array - 
	 * 		->item(arg_name):Instance - 
	 * 
	 * @param {array} args - variadic arguments.
	 * 
	 * @returns {nothing}
	 */
	constructor(...args)
	{
		super(context, undefined)

		this.is_collection = true
		this.$items = []
		this.$accepted_types = ['*']
		this.set_all(args)
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
		// ONE INSTANCE IS GIVEN
		if ( T.isObject(arg_items) && arg_items instanceof Instance )
		{
			this.$items = [arg_items]
		}
		
		// AN ARRAY IS GIVEN
		if ( T.isArray(arg_items) )
		{
			arg_items.forEach(
				(item) => {
					if (item instanceof Instance)
					{
						this.$items.push(item)
					}
				}
			)
		}
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
		if (! arg_types)
		{
			return this.$items
		}
		if (T.isString(arg_types))
		{
			return this.$items.filter( item => item.$type == arg_types )
		}
		if (T.isArray(arg_types))
		{
			return this.$items.filter( item => arg_types.indexOf(item.$types) >= 0 )
		}
		return []
	}
	
	
	
	/**
	 * Get an item by its name.
	 * 
	 * @returns {Instance}
	 */
	item(arg_name)
	{
		return this.find_by_name(arg_name)
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
	 * Get all items names with or without a filter on items types.
	 * 
	 * @param {array|string|nothing} arg_types - type or types for items filtering.
	 * 
	 * @returns {array} - all or filtered items names, empty array if not found.
	 */
	get_all_names(arg_types)
	{
		if (! arg_types)
		{
			return this.$items.map( (item) =>{ return item.$name } )
		}
		if (T.isString(arg_types))
		{
			return this.$items.filter( item => item.$type == arg_types ).map( (item) =>{ return item.$name } )
		}
		if (T.isArray(arg_types))
		{
			return this.$items.filter( item => arg_types.indexOf(item.$types) >= 0 ).map( (item) =>{ return item.$name } )
		}
		return []
	}
	
	
	
	/**
	 * Get all items ids with or without a filter on items types.
	 * 
	 * @returns {array} - all items ids.
	 */
	get_all_ids() { return this.$items.map( (item) =>{ return item.$id } ) }
	
	
	
	/**
	 * Get all items count.
	 * 
	 * @returns {number} - all items count.
	 */
	get_count() { return this.$items.length }
    
    
	
	/**
	 * Get first item.
	 * 
	 * @returns {object|null} - first collection items or null if collection is empty.
	 */
	get_first()
    {
		if ( ! this.$weight_map )
		{
			return this.$items.length > 0 ? this.$items[0] : null
		}
		
		// TODO:TO CLEAN OR IMPLEMENT
		return this.$weight_map.first() // TO FIX
	}
	
	
    
	/**
	 * Get Last item.
	 * 
	 * @returns {object|null} - last collection items or null if collection is empty.
	 */
	get_last()
    {
		if ( ! this.$weight_map )
		{
			return this.$items.length > 0 ? this.$items[ this.$items.length - 1 ] : null
		}
		
		// TODO:TO CLEAN OR IMPLEMENT
		return this.$weight_map.last() // TO FIX
	}
	
	
	
	/**
	 * Add an item to the collection.
	 * 
	 * TODO: use indices to optimize search.
	 * 
	 * @param {Instance} arg_item - Instance item.
	 * 
	 * @returns {nothing}
	 */
	add(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			if ( this.has_accepted_type('*') || this.has_accepted_type(arg_item.$type) )
			{
				this.$items.push(arg_item)
                
				// TODO:TO CLEAN OR IMPLEMENT
                // CLASS USES weight ?
                // if (arg_item.is_weighted)
                // {
                //     if ( ! T.isObject(this.$weight_map) )
                //     {
                //         this.$weight_map = new ???() // TODO
                //         this.$weight_map.push(arg_item.get_weight(), arg_item)
                //     }
                // }
                
				return
			}
			
			this.error('not accepted type [' + arg_item.$type + '] for instance [' + arg_item.$name + ']')
			return
		}
		
		this.error('bad item: not an instance object')
	}
	
	
	
	/**
	 * Add an item to the collection at the first position.
	 * 
	 * TODO: use indices to optimize search.
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
				this.$items = [arg_item].concat(this.$items)
                
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
			const index = this.$items.indexOf(arg_item)
			if (index > -1)
			{
				this.$items.splice(index, 1)
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
			return this.find_by_name(arg_item.get_name()) ? true : false
		}
		return false
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
		return this.$items.find(
			item => {
				// console.log('collection.find_by_name.item for[' + arg_name + ']', item.$name)
				return item.$name == arg_name
			}
		)
	}
	
	
	
	/**
	 * Find an item by its id into the collection.
	 * 
	 * TODO: optimize with a map index.
	 * 
	 * @param {string} arg_id - instance id.
	 * 
	 * @returns {Instance|undefined}
	 */
	find_by_id(arg_id) { return this.$items.find( item => item.id == arg_id) }
	
	
	
	/**
	 * Find an item by one of its attributes into the collection.
	 * 
	 * TODO: optimize with a map index.
	 * 
	 * @param {string} arg_attr_name - instance attribute name.
	 * @param {any} arg_attr_value - instance attribute value.
	 * 
	 * @returns {Instance|undefined}
	 */
	find_by_attr(arg_attr_name, arg_attr_value) { return this.$items.find( item => (arg_attr_name in item) && item[arg_attr_name] == arg_attr_value) }
	
	
	
	/**
	 * Find an item by a filter function.
	 * 
	 * @param {string} arg_filter_function - function to apply on instance, returns a boolean.
	 * 
	 * @returns {Instance|undefined}
	 */
	find_by_filter(arg_filter_function) { return this.$items.find( item => arg_filter_function(item) ) }
	
	
	
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
		// FOR NODEJS 0.10
		// POLYFILL PROBLEM
		// for(let item of this.$items)
		// {
		// 	arg_cb(item)
		// }
		const count = this.$items.length
		for(let i = 0 ; i < count ; i++)
		{
			const item = this.$items[i]
			arg_cb(item)
		}
	}
}

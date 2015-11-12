
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import Instance from './instance'



let context = 'common/base/collection'
let debug = debug_fn(context)


export default class Collection
{
	constructor(...args)
	{
		this.is_collection = true
		this.$items = []
		this.$accepted_types = ['*']
		this.set_all(args)
	}
	
	
	// DEFAULT GETTER
	// get $items() { return this.$items }
	
	
	// DEFAULT SETTER
	// set $items(arg_items) { this.set_all(arg_items) }
	
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
	
	
	// DEFAULT ITERATOR
	* [Symbol.iterator]() {
		for (let item of this.$items) {
            yield item;
        }
	}
	
	
	// NAMES GETTER
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
	
	
	// IDs GETTER
	get_all_ids() { return this.$items.map( (item) =>{ return item.$id } ) }
	
	
	// ADD AN ITEM: TODO update indices
	add(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			if ( this.has_accepted_type('*') || this.has_accepted_type(arg_item.$type) )
			{
				this.$items.push(arg_item)
				return
			}
			
			this.error('not accepted type [' + arg_item.$type + '] for instance [' + arg_item.$name + ']')
			return
		}
		
		this.error('bad item: not an instance object')
	}
	
	
	// FIND AN ITEM BY NAME: TODO optimize with a map index
	find_by_name(arg_name) { return this.$items.find( item => { return item.$name == arg_name } ) }
	
	
	// FIND AN ITEM BY ID: TODO optimize with a map index
	find_by_id(arg_id) { return this.$items.find( item => item.id == arg_id) }
	
	
	// MANAGE ACCEPTED TYPES
	get_accepted_types()
	{
		this.$accepted_types
	}
	
	set_accepted_types(arg_types)
	{
		assert(T.isArray(arg_types), context + ':bad accepted types array')
		this.$accepted_types = arg_types
	}
	
	add_accepted_type(arg_type)
	{
		assert(T.isString(arg_type), context + ':bad accepted type string')
		this.$accepted_types.push(arg_type)
	}
	
	has_accepted_type(arg_type)
	{
		return this.$accepted_types.indexOf(arg_type) > -1
	}
}

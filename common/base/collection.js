
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
	
	get_all() { return this.$items }
	
	
	// DEFAULT ITERATOR
	* [Symbol.iterator]() {
		for (let item of this.$items) {
            yield item;
        }
	}
	
	
	// NAMES GETTER
	get_all_names() { return this.$items.map( (item) =>{ return item.$name } ) }
	
	
	// ADD AN ITEM
	add(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			this.$items.push(arg_item)
		}
	}
	
	
	// FIND AN ITEM BY NAME
	find_by_name(arg_name) { return this.$items.find( item => item.$name == arg_name) }
	
	
	// FIND AN ITEM BY ID
	find_by_id(arg_id) { return this.$items.find( item => item.id == arg_id) }
}

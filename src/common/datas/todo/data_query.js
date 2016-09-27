// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
// import {Map} from 'immutable'


let context = 'common/data/data_record'



/**
 * @file DataRecord class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class DataQuery
{
	/**
	 * Data record class, contains one collection item attributes.
	 * 
	 * 	API:
	 * 		->constructor(arg_model)
	 * 
	 * 		->get_model():DataModel - get record model.
	 * 		->hash():string - get query hash string.
	 * 
	 * 		->set_fields(arg_fields_names:array):nothing - set query fields.
	 * 		->get_fields():array - get query fields names.
	 * 
	 * 		->set_limit(arg_offset:integer, arg_length:integer):nothing - set query limit with offset and length.
	 * 		->set_range(arg_first:integer, arg_last:integer):nothing - set query limit with first and last index.
	 * 		->get_limit():object - get query limit as { offset:..., length:..., first:..., last:...}
	 * 		->set_page(arg_page_size, arg_page_index):nothing - set query limit with a page index.
	 * 		->get_page(arg_page_size):integer - get query page.
	 * 
	 * 		->set_where(arg_where:object):nothing - set query where clause.
	 * 		->get_where():object - get query where clause.
	 * 		->and():this
	 * 		->or():this
	 * 		->not():this
	 * 		->field(arg_field_name):this
	 * 		->lt():this
	 * 		->gt():this
	 * 		->lte():this
	 * 		->gte():this
	 * 		->equal():this
	 * 		->notequal():this
	 * 		->like():this
	 * 		->value(arg_string):this
	 * 
	 * 		->set_orderby(arg_orderby:array):nothing - set query orderby clause.
	 * 		->get_orderby():array - get query orderby clause.
	 * 
	 * 		->set_groupby(arg_groupby:array):nothing - set query groupby clause.
	 * 		->get_groupby():array - get query groupby clause.
	 * 
	 * @param {DataModel} arg_model - data model: contains schema.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_model)
	{
		assert( T.isObject(arg_model) && arg_model.is_data_model, context + ':constructor:bad model object')

		this.is_data_query = true

		this._model = arg_model
		this._hash = undefined
		this._hash_is_dirty = true

		this._fields = []
		this._limit = { offset:0, length:1000, first:0, last:999 }
		this._where = {}
		this._where_cursor = undefined
		this._orderby = []
		this._groupby = []
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
	_emit(/*arg_event, arg_datas=undefined*/) // TODO
	{
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
	 * Calculate query hash string.
	 * 
	 * @returns {string}
	 */
	_calculate_hash()
	{
		const model = this._model.get_name()
		const fields = this.fields.joins(',')
		const limit = this._limit.offset + ',' + this._limit.length
		const where = this._where.hash// TODO
		const groupby = this._groupby.hash // TODO
		const orderby = this._orderby.hash // TODO
		
		this._hash = 'QUERY[' + model + ':' + fields + ':' + limit + ':' + where + ':' + groupby + ':' + orderby + ']'
		this._hash_is_dirty = false

		return this._hash
	}



	/**
	 * Get hash string.
	 * 
	 * @returns {string}
	 */
	hash()
	{
		return this._hash_is_dirty ? this._calculate_hash() : this._hash
	}



	/**
	 * Set query fields.
	 * 
	 * @param {array} arg_fields_names - query fields names
	 * 
	 * @returns {nothing}
	 */
	set_fields(arg_fields_names)
	{
		assert( T.isArray(arg_fields_names), context + ':set_fields:bad fields array')
		arg_fields_names.forEach(
			(field_name, index)=>{
				assert( T.isString(field_name), context + ':set_fields:bad field string at [' + index + '] for [' + field_name + ']')
				assert( this._model.check_field_name(field_name), context + ':set_fields:bad field name at [' + index + '] for [' + field_name + ']')
			}
		)
		this._fields = arg_fields_names
	}



	/**
	 * Get query fields.
	 * 
	 * @returns {array}
	 */
	get_fields()
	{
		return this._fields
	}



	/**
	 * Get query limit as { offset:..., length:..., first:..., last:...}.
	 * 
	 * @returns {object}
	 */
	get_limit()
	{
		return this._limit
	}



	/**
	 * Set query limit with offset and count.
	 * 
	 * @param {integer} arg_offset - query limit offset.
	 * @param {integer} arg_length - query limit length.
	 * 
	 * @returns {nothing}
	 */
	set_limit(arg_offset, arg_length)
	{
		assert( T.isNumber(arg_offset) && arg_offset >= 0, context + ':set_limit:bad offset number [' + arg_offset + ']')
		assert( T.isNumber(arg_length) && arg_length > 0, context + ':set_limit:bad length number [' + arg_length + ']')

		this._limit = {
			offset:arg_offset,
			length:arg_length,
			first: arg_offset,
			last: arg_offset + arg_offset - 1,
			hash:'LIMIT[' + this._limit.offset + ':' + this._limit.length + ']'
		}
	}



	/**
	 * Set query limit with first and last indices.
	 * 
	 * @param {integer} arg_first - query limit first index.
	 * @param {integer} arg_last - query limit last index.
	 * 
	 * @returns {nothing}
	 */
	set_range(arg_first, arg_last)
	{
		assert( T.isNumber(arg_first) && arg_first >= 0, context + ':set_limit:bad first index number [' + arg_first + ']')
		assert( T.isNumber(arg_last) && arg_last > 0 && arg_last >= arg_first, context + ':set_limit:bad last index number [' + arg_last + ']')

		this._limit = {
			offset:arg_first,
			length:arg_last - arg_first + 1,
			first: arg_first,
			last: arg_last,
			hash:'LIMIT[' + this._limit.offset + ':' + this._limit.length + ']'
		}
	}



	/**
	 * Set query limit with page size and page index.
	 * 
	 * @param {integer} arg_page_size - query page size.
	 * @param {integer} arg_page_index - query page index.
	 * 
	 * @returns {nothing}
	 */
	set_page(arg_page_size, arg_page_index)
	{
		assert( T.isNumber(arg_page_size) && arg_page_size > 0, context + ':set_limit:bad page size number [' + arg_page_size + ']')
		assert( T.isNumber(arg_page_index) && arg_page_index >= 0, context + ':set_limit:bad page index number [' + arg_page_index + ']')

		this._limit = {
			offset:arg_page_size * (arg_page_index == 0 ? 0 : (arg_page_index - 1) ),
			length:arg_page_size,
			first: arg_page_size * (arg_page_index == 0 ? 0 : (arg_page_index - 1) ),
			last: arg_page_size * arg_page_index,
			hash:'LIMIT[' + this._limit.offset + ':' + this._limit.length + ']'
		}
	}



	/**
	 * Get query limit page index.
	 * 
	 * @param {integer} arg_page_size - query page size.
	 * 
	 * @returns {integer}
	 */
	get_page(arg_page_size)
	{
		assert( T.isNumber(arg_page_size) && arg_page_size > 0, context + ':set_limit:bad page size number [' + arg_page_size + ']')
		
		const size = this._limit.offset + this._limit.length
		const rest = size % arg_page_size
		const pages = ( size - rest ) / arg_page_size
		return pages + (rest > 0 ? 1 : 0)
	}
	
}
/*

	 * 		->set_where(arg_where:object):nothing - set query where clause.
	 * 		->get_where():object - get query where clause.
	 * 		->and():this
	 * 		->or():this
	 * 		->not():this
	 * 		->field(arg_field_name):this
	 * 		->lt():this
	 * 		->gt():this
	 * 		->lte():this
	 * 		->gte():this
	 * 		->equal():this
	 * 		->notequal():this
	 * 		->like():this
	 * 		->value(arg_string):this
	 * 
	 * 		->set_orderby(arg_orderby:array):nothing - set query orderby clause.
	 * 		->get_orderby():array - get query orderby clause.
	 * 
	 * 		->set_groupby(arg_groupby:array):nothing - set query groupby clause.
	 * 		->get_groupby():array - get query groupby clause.


	 * 		->set_credentials(arg_crentials:object) - set credentials to use with some adapters.
	 * 		->get_credentials():object - get credentials to use with some adapters.


Query modifiers include filters:

where
limit
skip
sort
select
distinct
Boolean logic:

and
or
not
As well as groupBy and the aggregators:

count
sum
min
max
average
IN queries: Adapters which implement where should recognize a list of values (e.g. name: ['Gandalf', 'Merlin']) as an IN query. In other words, if name is either of those values, a match occured.

Sub-attribute modifiers: You are also responsible for sub-attribute modifiers, (e.g. { age: { '>=' : 65 } }) with the notable exception of contains, startsWith, and endsWith, since support for those modifiers can be derived programatically by leveraging your definition of like.

like (SQL-style, with % wildcards)
'>' (you can also opt to use the more verbose .greaterThan(), etc.)
'<'
'>='
'<='
TODO: range queries (e.g. { '<':4, >= 2 })


*/
// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
import _ from 'lodash'
import Immutable from 'immutable'

// COMMON IMPORTS
import uid from '../../common/utils/uid'

// BROWSER IMPORTS
import Table from './table'


const context = 'browser/components/logs_table'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LogsTable extends Table
{
	
	/**
	 * Creates an instance of LogsTable.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_state, log_context)
		
		this.is_logs_table_component = true

		this.register_state_value_change_handle(['selected_column'], 'handle_selected_column_change')

		this._elements_cache = {}
		this._filters = {}

		// DEBUG
		// this.enable_trace()
	}
	
	
	
	/**
	 * Build a table row DOM element.
	 *
	 * @param {array} arg_row_array - row values array.
	 * @param {integer} arg_row_index - row index.
	 * @param {integer} arg_max_cols - max columns number.
	 * 
	 * @returns {Element} - TD DOM Element.
	 */
	build_row(arg_row_array, arg_row_index, arg_max_cols)
	{
		const td_elem = super.build_row(arg_row_array, arg_row_index, arg_max_cols)
		
		const log_uid = 'log_' + uid()
		arg_row_array.push(log_uid)
		td_elem.setAttribute('data-devapt-log_uid', log_uid)

		const row_record = {
			elem:td_elem,
			log:arg_row_array,
			log_uid:log_uid,
			row_index:arg_row_index
		}
		this._elements_cache[log_uid] = row_record

		this.apply_filter_on_row_record(row_record)

		return td_elem
	}
	
	
	
	/**
	 * Get column index from its name.
	 *
	 * @param {string} arg_column_name - column name.
	 * 
	 * @returns {integer} - column index
	 */
	get_column_index(arg_column_name)
	{
		switch(arg_column_name){
			case 'ts':       return 0
			case 'level':    return 1
			case 'source':   return 2
			case 'context':  return 3
			case 'instance': return 4
			case 'group':    return 5
			case 'action':   return 6
			case 'text':     return 7
		}

		return 0
	}
	
	
	
	/**
	 * Delete table row DOM element.
	 *
	 * @param {Element} arg_row_elem - row TR Element.
	 * 
	 * @returns {nothing}
	 */
	delete_row_elem(arg_row_elem)
	{
		const log_uid = arg_row_elem.getAttribute('data-devapt-log_uid')
		delete this._elements_cache[log_uid]
	}


	apply_filter(arg_filter_value, arg_cell_value)
	{
		const filter_mode_not = ('' + arg_filter_value).startsWith('NOT ') ? true : false
		if (filter_mode_not)
		{
			return ('' + arg_cell_value).search(arg_filter_value.substr(4)) < 0
		}
		return ('' + arg_cell_value).search(arg_filter_value) >= 0
	}


	apply_filter_on_row_record(arg_row_record)
	{
		let match = true
		_.forEach(this._filters,
			(filter)=>{
				if (match && arg_row_record.log.length > filter.index)
				{
					const column_value = arg_row_record.log[filter.index]
					const cell_match = this.apply_filter(filter.value, column_value)

					match = filter.value == '' || cell_match
				}
			}
		)
				
		// console.log('apply_filter_on_row_record:match %b', match, this._filters, row_record.elem.style.display)
		
		if (match)
		{
			arg_row_record.elem.style.display = 'table-row'
		} else {
			arg_row_record.elem.style.display = 'none'
		}
	}
	
	
	
	/**
	 * Filter a column.
	 *
	 * @param {array} arg_row_array - row values array.
	 * @param {integer} arg_row_index - row index.
	 * @param {integer} arg_max_cols - max columns number.
	 * 
	 * @returns {string} - HTML TR string
	 */
	do_action_filter_column(arg_column_name, arg_filter_value)
	{
		// console.log(context + ':do_action_filter_column:column=%s, filter=%s',arg_column_name, arg_filter_value, this._elements_cache)

		const column_index = this.get_column_index(arg_column_name)
		this._filters[arg_column_name] = { value:arg_filter_value, index:column_index }

		_.forEach(this._elements_cache,
			(row_record)=>{
				this.apply_filter_on_row_record(row_record)
			}
		)
	}



	/**
	 * Handle click on TH tags.
	 * 
	 * @param {any} arg_stream_data - object record: { component_name:string,  event_name:string, dom_selector:string, target:object, data:any }.
	 * 
	 * @returns {nothing}
	 */
	do_click_th(arg_stream_data)
	{
		this.dispatch_update_state_value_action(['selected_column'], arg_stream_data.target.id)
	}



	/**
	 * Handle selected_column state change.
	 * 
	 * @param {array}       arg_path           - value state path.
	 * @param {Immutable.*} arg_previous_value - previous state value.
	 * @param {Immutable.*} arg_new_value      - new state value.
	 * 
	 * @returns {nothing}
	 */
	handle_selected_column_change(arg_path, arg_previous_value, arg_new_value)
	{
		console.log(context + ':handle_selected_column_change', arg_path, arg_previous_value, arg_new_value)
		
		if (! arg_previous_value && ! arg_new_value)
		{
			console.log(context + ':handle_selected_column_change:no previous and no new values', arg_path, arg_previous_value, arg_new_value)
			return
		}

		if ( Immutable.is(arg_previous_value, arg_new_value) )
		{
			console.log(context + ':handle_selected_column_change:previous value = new value', arg_path, arg_previous_value, arg_new_value)
			return
		}

		const new_value = arg_new_value && arg_new_value.toJS() ? arg_new_value.toJS() : undefined
		if ( ! T.isString(new_value) )
		{
			console.warn(context + ':handle_selected_column_change:bad new value string', arg_path, arg_previous_value, arg_new_value)
			return
		}

		// TODO
	}
}

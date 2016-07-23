
import T from 'typr'
// import assert from 'assert'

import Table from './table'


const context = 'browser/components/records_table'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RecordsTable extends Table
{
	
	/**
	 * Creates an instance of Component.
	 * @extends Table
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
		
		this.is_one_record_table_component = true
		
		this.table_jqo = $("#" + this.get_dom_id())
		this.records = {}
		
		const state = this.get_initial_state()
		this.fields = ('fields' in state) ? state.fields : []
		this.labels = ('labels' in state) ? state.labels : []
		this.records_key = ('records_key' in state) ? state.records_key : 'records'
		this.record_key  = ('record_key' in state) ? state.record_key : 'record_key'
	}
	
	
	
	/**
	 * Update the table with records.
	 * 
	 * @param {objetc} arg_records - datas records, plain object.
	 * 
	 * @returns {nothing}
	 */
	update_records(arg_records)
	{
		// console.log(arg_records, 'table.update_records:arg_records')
		
		var self = this
		
		if (typeof arg_records != "object")
		{
			return
		}
		
		if ( ! (this.records_key in arg_records) )
		{
			return
		}
		
		const records_of_key = arg_records[this.records_key]
		if ( T.isArray(records_of_key) )
		{
			records_of_key.forEach(
				function(record)
				{
					self.add_record(record)
				}
			)
		}
	}
	
	
	
	/**
	 * Add one record to the table.
	 * 
	 * @param {objetc} arg_records - datas records, plain object.
	 * 
	 * @returns {nothing}
	 */
	add_record(arg_record)
	{
		// console.log(arg_record, 'table.add_record:arg_record')
		
		var self = this
		
		if (arg_record in this.records)
		{
			return
		}
		
		var row_id = this.get_dom_id() + '_' + arg_record
		var html = '<tr colspan="3" id="' + row_id + '"><td>' + arg_record + '</td></tr>'
		
		this.fields.forEach(
			function(field, index)
			{
				html += '<tr> <td></td> <td>' + self.labels[index] + '</td> <td id="' + row_id + '_' + field + '">0</td> </tr>'
			}
		)
		
		$('tbody', this.table_jqo).append(html)
		this.records[arg_record] = row_id
	}
	
	
	
	/**
	 * Update table with records values.
	 * 
	 * @param {array} arg_values - datas values, plain objects array.
	 * 
	 * @returns {nothing}
	 */
	update_values(arg_values)
	{
		// console.log(arg_values, 'table.update_values')
		
		var self = this
		
		if (! arg_values)
		{
			console.log(table_id, 'no values', 'table.update_values')
			return
		}
		
		const table_id = this.get_dom_id()
		
		// console.log(arg_values, 'table.update_values')
		
		arg_values = Array.isArray(arg_values) ? arg_values : [arg_values]
		
		arg_values.forEach(
			function(values)
			{
				if (values)
				{
					self.update_record_values(values)
				}
			}
		)
	}
	
	
	
	/**
	 * Update table with one record values.
	 * 
	 * @param {object} arg_record_values - datas values, plain objects.
	 * 
	 * @returns {nothing}
	 */
	update_record_values(arg_record_values)
	{
		// console.log(arg_record_values, 'table.update_record_values:values')
		
		var self = this
		
		if (! arg_record_values || ! arg_record_values[this.record_key] )
		{
			return
		}
		
		const values_key = arg_record_values[this.record_key]
		if (! (values_key in self.records) )
		{
			return
		}
		
		var row_id = self.records[values_key]
		// console.log(row_id, 'table.update_record_values:row_id')
		
		this.fields.forEach(
			function(field)
			{
				if (field in arg_record_values)
				{
					var value = arg_record_values[field]
					if (typeof value == 'number')
					{
						value = value.toFixed()
					}
					
					var field_id = row_id + '_' + field
					$("#" + field_id).text(value)
				}
				else
				{
					console.log('field not found in record', field, arg_record_values)
				}
			}
		)
	}
}

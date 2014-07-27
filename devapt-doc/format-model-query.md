
MODEL QUERY FORMAT DOCUMENTATION
=============================

Project: Devapt (www.devapt.org)

Source: https://github.com/lucbories/DevApt

Module: documentation - client/server model query interface


CONTEXT
-------

*This documentation apply to the browser to server communication.*

*Query datas are transmitted into a GET or POST HTTP request.*

To determine which version is used for a query, this attribute is used:
* query_api
  * default value: '1'
  * value type: integer
  * values: '1', '2'


QUERY VERSION 1
---------------

 * query_action
  * default value: 'select'
  * value type: predefined strings list
  * values: select, select_distinct, insert, insert_ignore, replace, select_distinct_one, select_count, update, delete, delete_all

 * crud_db
  * default value: ''
  * value type: string
  * values: database name
	
 * crud_table
  * default value: ''
  * value type: string
  * values: database table name
	
 * query_one_field
  * default value: ''
  * value type: string
  * values: field name for action with only one field (select_distinct_one)
  * prerequisite: the field name should a be a valid model field name
	
 * query_fields
  * default value: ''
  * value type: strings list with ',' separator
  * values: fields names
	
 * query_values
  * default value: 
  * value type: strings list with ',' separator
  * values: fields/values association
      * to build a filter on fields
      * or to insert fields values
      * or to update fields values
	
 * query_filters
  * default value: ''
  * value type: strings list with '|' separator
  * values: each filter string is a key=value pair list with a ',' separator
	  * format: field=field name,type=field type,modifier=modifier operator name (optional),op=filtering operator name,var1=operand 1 value,var2=operand 2 value
      * example 1: field=brand_name,type=String,modifier=upper,op=equals,var1=ADJ
      * example 2: field=brand_name,type=String,modifier=,op=in,var1='value1,value2,value3'

 * query_orders
  * default value: ''
  * value type: strings list with ',' separator
  * values: each group string is a field name / order mode association : field name=DESC or field name=ASC
	
 * query_groups
  * default value: ''
  * value type: strings list with ',' separator
  * values: each group string is a field name
	
 * query_slice_begin
  * default value: ''
  * value type: integer
  * values: any positive value
	
 * query_slice_end
  * default value: ''
  * value type: integer
  * values: any positive value
	
 * query_slice_offset
  * default value: ''
  * value type: integer
  * values: any positive value
	
 * query_slice_length
  * default value: ''
  * value type: integer
  * values: any positive value
	
 * query_joins
  * default value: ''
  * value type: strings list with '|' separator
  * values: each join string is a key=value pair list with a ',' separator
      * example: db=,table=table1,column=field1,join_db=,join_table=table2,join_table_alias=join1,join_column=col5,join_mode=
      * join_mode in 'INNER', 'OUTER', 'LEFT', 'RIGHT'

Filters operators names:
* ANY TYPE:  "equals", "notequals", "isnull", "isnotnull",
* STRING: "bw", "begins_with", "begins with", "contains", "ew", "ends_with", "ends with", "min length", "max length", "length between", "in",
* NUMBER: "gt", "ge", "lt", "le", "between"

Filters modifier operators names:
* STRING: "upper", "lower", "ltrim", "rtrim", "aes_encrypt", "aes_decrypt", "md5",
* NUMBER: "abs", "floor",
* DATE: "date", "day", "week", "month", "year", "day of week", "day of month", "day of year", "last day of month", "quarter",
* TIME:  "time", "hour", "minute", "second"

Filters types: "String", "Integer", "Float", "Date", "Time", "DateTime", "Boolean"


QUERY VERSION 2
---------------

 * query_json
  * default value: ''
  * value type: string
  * values: one JSON object string

JSON object string format:
`{
	action: '...',
	crud_db: '...',
	crud_table: '...',
	fields: [],
	one_field: '...',
	values: {},
	values_count: ...,
	filters: [],
	orders: [],
	groups: [],
	slice: { offset:'...', length:'...' },
	joins: [],
}`

with attributes definition:

 * action
  * default value: 'select'
  * value type: predefined strings list
  * values: select, select_distinct, insert, insert_ignore, replace, select_distinct_one, select_count, update, delete, delete_all

 * crud_db
  * default value: ''
  * value type: string
  * values: database name of the crud table
	
 * crud_table
  * default value: ''
  * value type: string
  * values: database table name for write operations (create, update, delete)

 * fields
  * default value: []
  * value type: ordered field names (string) list as a JSON array
  * values: fields names

 * one_field
  * default value: ''
  * value type: string
  * values: field name for unary operation 
  
 * values
  * default value: {}
  * value type:  an associative array of field name / field value
  * values: fields/values association
      * to build a filter on fields
      * or to insert fields values
      * or to update fields values

 * values_count
  * default value : 0
  * value type: integer
  * values: 'values' records count

 * orders
  * default value: []
  * value type: a JSON array of orders objects
  * values: each order object is as
		`{
			field: field name (string),
			mode: 'ASC' or 'DESC' (string)
		}`

 * groups
  * default value: []
  * value type: a JSON array of string
  * values: each group string is a field name

 * slice
  * default value: null
  * value type: slice object
  * values: { offset:'...', length:'...' }
	
 * joins
  * default value: []
  * value type: a JSON array of joins objects
  * values: each join object is as
		`{
			mode: string in 'inner', 'straight join', 'left outer', 'right outer', 'natural left outer', 'natural right outer' 
			source: { db: '...', table: '...', column: '...' },
			target: { db: '...', table: '...', column: '...' }
		}`
  
 * filters
  * default value: []
  * value type: a JSON array of filters objects
  * values: each filter object is as
		`{
			predicate: 'AND' / 'OR'
			expression: expression object
		}`

 * expression object:
		`{
			operator: an operator name
			operands: an array of expression
		}`
		or
		{
			value: expression value
			type: value type name
		}
	
 * value types: "String", "Integer", "Float", "Date", "Time", "DateTime", "Boolean"
 
 * operators:
  * ANY TYPE: "equals", "notequals", "isnull", "isnotnull",
  * STRING: "bw", "begins_with", "begins with", "contains", "ew", "ends_with", "ends with", "min length", "max length", "length between", "in"
			"upper", "lower", "ltrim", "rtrim", "aes_encrypt", "aes_decrypt", "md5"
  * NUMBER: "gt", "ge", "lt", "le", "between", "abs", "floor"
  * DATE: "date", "day", "week", "month", "year", "day of week", "day of month", "day of year", "last day of month", "quarter",
  * TIME:  "time", "hour", "minute", "second"

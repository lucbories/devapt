/**
 * @file        libapt-model-tu.js
 * @brief       Model class Test Unit
 * @details     ...
 * @see			libapt-model.js libapt-fieldsset.js libapt-field.js libapt-main.js libapt-main-ajax.js
 * @ingroup     LIBAPT_MODELS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

var LIBAPT_MODELS_MODEL_TRACE_TU = true;


// ERROR CALLBACK
LibaptModel.tu_error_callback = function()
{
	console.log('callback: ERROR');
}


// SYNC METHODS
LibaptModel.tu_users_1 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_1: MODEL_AUTH_USERS : read all records (sync)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	
	console.log( model.read_all_records_sync(null, null, LibaptModel.tu_error_callback) );
}

LibaptModel.tu_users_2 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_2: MODEL_AUTH_USERS : read all distinct records (sync)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	var field_login = model.fields_set.get_field('login');
	var order_login = new LibaptOrder(field_login, 'DESC');
	
	console.log( model.read_all_distinct_sync([field_login], [order_login], 20, null, LibaptModel.tu_error_callback) );
}

LibaptModel.tu_users_3 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_3: MODEL_AUTH_USERS : read all distinct records max=4 (sync)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	var field_login = model.fields_set.get_field('login');
	var order_login = new LibaptOrder(field_login, 'DESC');
	
	console.log( model.read_all_distinct_sync([field_login], [order_login], 4, null, LibaptModel.tu_error_callback) );
}
	

// ASYNC METHODS
LibaptModel.tu_users_4 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_4: MODEL_AUTH_USERS : read all records (async)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	
	var ok_cb = function(datas){
		console.log('LibaptModel.tu_users_4: MODEL_AUTH_USERS : async results:');
		console.log(datas);
	}
	
	model.read_all_records(100, ok_cb, LibaptModel.tu_error_callback);
}

LibaptModel.tu_users_5 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_5: MODEL_AUTH_USERS : read all distinct records (async)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	var field_login = model.fields_set.get_field('login');
	var order_login = new LibaptOrder(field_login, 'DESC');
	
	var ok_cb = function(datas){
		console.log('LibaptModel.tu_users_5: MODEL_AUTH_USERS : async results:');
		console.log(datas);
	}
	
	model.read_all_distinct([field_login], [order_login], 20, ok_cb, LibaptModel.tu_error_callback);
}

LibaptModel.tu_users_6 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_6: MODEL_AUTH_USERS : read all distinct records max=4 (async)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	var field_login = model.fields_set.get_field('login');
	var order_login = new LibaptOrder(field_login, 'DESC');
	
	var ok_cb = function(datas){
		console.log('LibaptModel.tu_users_6: MODEL_AUTH_USERS : async results:');
		console.log(datas);
	}
	
	model.read_all_distinct([field_login], [order_login], 4, ok_cb, LibaptModel.tu_error_callback);
}

LibaptModel.tu_users_7 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_7: MODEL_AUTH_USERS : read record with pk=4 (async)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	var pk_value = 4;
	
	var ok_cb = function(datas){
		console.log('LibaptModel.tu_users_7: MODEL_AUTH_USERS : async results:');
		console.log(datas);
	}
	
	model.read_record_with_pk(pk_value, ok_cb, LibaptModel.tu_error_callback);
}

LibaptModel.tu_users_7 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_7: MODEL_AUTH_USERS : read records with values filters (async)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	var fields_value = new Object();
	fields_value['lastname'] = 'TEST 3';
	console.log(fields_value);
	
	var ok_cb = function(datas){
		console.log('LibaptModel.tu_users_7: MODEL_AUTH_USERS : async results:');
		console.log(datas);
	}
	
	model.read_records_with_values(fields_value, ok_cb, LibaptModel.tu_error_callback);
}

LibaptModel.tu_users_8 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModel.tu_users_8: MODEL_AUTH_USERS : read records with values filters (async)');
	
	var model = LibaptModels.get('MODEL_AUTH_USERS');
	var fields_value = new Object();
	fields_value['lastname'] = ['TEST 3', 'TEST 4', 'TEST 5'];
	console.log(fields_value);
	
	var ok_cb = function(datas){
		console.log('LibaptModel.tu_users_8: MODEL_AUTH_USERS : async results:');
		console.log(datas);
	}
	
	model.read_records_with_values(fields_value, ok_cb, LibaptModel.tu_error_callback);
}

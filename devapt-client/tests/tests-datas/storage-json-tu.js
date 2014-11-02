/**
 * @file        storage-json-tu.js
 * @desc        Devapt storage tests unit
 * @ingroup     LIBAPT_CORE
 * @date        2014-08-14
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'datas/query', 'datas/storage-json'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptQuery, DevaptJsonStorage)
{
	console.log('Load qUnit test for DevaptStorage');
	
	function run_tests()
	{
		console.log('Running qUnit test for DevaptJsonStorage');
		
		
		// INIT STORAGE ENGINE
		var store_opts = { url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_uprate:'', url_delete:'' };
		var store = new DevaptJsonStorage('store', store_opts);
		// var records = null;
		
		
		// IS VALID
		QUnit.test('DevaptTypes.is_valid',
			function()
			{
				expect(1);
				
				var is_valid = store.is_valid();
				QUnit.assert.ok(is_valid, 'store is valid?');
			}
		);
		
		
		// CREATE
	/*	QUnit.asyncTest('DevaptTypes.create_records (1 user)',
			function()
			{
				expect(3);
				
				// TEST CREATE WITH 1 RECORDS
				var records_1 = [
					{
						login: 'tu_user_1',
						lastame: 'TU User 1',
						firstame: 'user 1',
						email: 'tu_user_1@tu_users.net',
						password: 'xxx'
					}
				];
				
				store.create_records(records_1).then(
					function(result)
					{
						QUnit.equal(result.status, 'ok', 'result.status = ok');
						QUnit.equal(result.count, 1, 'result.count = 1');
						QUnit.equal(result.error, '', 'result.error = ""');
						QUnit.start();
					}
				);
			}
		); */
				
	/*	QUnit.asyncTest('DevaptTypes.create_records (3 users)',
			function()
			{
				expect(3);
				
				// TEST CREATE WITH 3 RECORDS
				QUnit.stop();
				var records_3 = [
					{
						login: 'tu_user_2',
						lastame: 'TU User 2',
						firstame: 'user 2',
						email: 'tu_user_2@tu_users.net',
						password: 'xxx'
					},
					{
						login: 'tu_user_3',
						lastame: 'TU User 3',
						firstame: 'user 3',
						email: 'tu_user_3@tu_users.net',
						password: 'xxx'
					},
					{
						login: 'tu_user_4',
						lastame: 'TU User 4',
						firstame: 'user 4',
						email: 'tu_user_4@tu_users.net',
						password: 'xxx'
					}
				];
				
				store.create_records(records_3).then(
					function(result)
					{
						QUnit.equal(result.status, 'ok', 'result.status = ok');
						QUnit.equal(result.count, 3, 'result.count = 3');
						QUnit.equal(result.error, '', 'result.error = ""');
						QUnit.start();
					}
				);
			}
		); */
		
		
		// READ
		QUnit.asyncTest('DevaptTypes.read_all_records',
			function()
			{
				expect(3);
				
				// READ ALL RECORDS
				store.read_all_records().then(
					function(result)
					{
						QUnit.equal(result.status, 'ok', 'result.status = ok');
						// QUnit.equal(result.count, 20, 'result.count = 20');
						QUnit.equal(result.count, 17, 'result.count = 17');
						QUnit.equal(result.error, '', 'result.error = ""');
						QUnit.start();
					}
				);
			}
		);
		
		QUnit.asyncTest('DevaptTypes.read_records',
			function()
			{
				expect(3);
				
				// READ ...
				var query_opts = {
					action: 'select',
					one_field: 'login',
					values: null,
					values_count: 0
				/*	crud_db: '...',
					crud_table: '...',
					fields: [],
					one_field: '...',
					values: {},
					values_count: ...,
					filters: [],
					orders: [],
					groups: [],
					slice: { offset:'...', length:'...' },
					joins: [],*/
				};
				var query = new DevaptQuery('query1', query_opts);
				store.read_records(query).then(
					function(result)
					{
						QUnit.equal(result.status, 'ok', 'result.status = ok');
						// QUnit.equal(result.count, 20, 'result.count = 20');
						QUnit.equal(result.count, 17, 'result.count = 17');
						QUnit.equal(result.error, '', 'result.error = ""');
						QUnit.start();
					}
				);
			}
		);
		
		
		// UDPATE
		
		
		// DELETE
		
	}
	
	return run_tests;
} );
/*import {describe, it} from 'mocha';
import {expect} from 'chai';
import {List, Map} from 'immutable';
import T from 'typr'
import { ActionCreators } from 'redux-undo';

import { store, config, runtime } from '../store/index'
import { dispatch_store_config_get_value } from '../store/config/actions'
import { dispatch_store_runtime_get_value } from '../store/runtime/actions'
import { dispatch_store_runtime_apps_create } from '../store/runtime/applications/actions'

import * as test_load_config from '../store/test/test_load_config'



describe('store',
	() => {
		it('create_store()',
			() => {
				let state = store.getState()
				let config_present = state.config_reducer.present
				let runtime_present = state.runtime_reducer
				
				let config_obj = config_present.toJS()
				// console.log(config_obj, 'config_obj')
				
				config_obj = config_obj.config
				
				if (config_obj.modules && config_obj.modules.error)
				{
					console.log(config_obj.modules.error, 'config_obj.modules.error')
					console.log(config_obj.modules.errors, 'config_obj.modules.errors')
				}
				
				expect( T.isObject(state) ).to.be.true
				
				expect(state).contain.keys('config_reducer', 'runtime_reducer')
				
				expect(config_present.has('config')).to.be.true
				expect(runtime_present.has('runtime')).to.be.true
				
				expect(config_present.get('config').has('error')).to.be.false
				expect(config_present.get('config').has('servers')).to.be.true
				expect(config_present.get('config').has('services')).to.be.true
				expect(config_present.get('config').has('applications')).to.be.true
				expect(config_present.get('config').has('modules')).to.be.true
				expect(config_present.get('config').has('plugins')).to.be.true
				expect(config_present.get('config').has('security')).to.be.true
				
				expect(runtime_present.get('runtime').has('error')).to.be.false
				expect(runtime_present.get('runtime').has('applications')).to.be.true
				expect(runtime_present.get('runtime').has('records')).to.be.true
				expect(runtime_present.get('runtime').has('instances')).to.be.true
				expect(runtime_present.get('runtime').has('security')).to.be.true
			}
		)
		
		it('store getters',
			() => {
				// let state = store.getState()
				// let config_present = state.config_reducer.present
				// let runtime_present = state.runtime_reducer.present
				
				let store_config = devapt.runtime.get_registry().root
				// let store_runtime = runtime()
				
				expect( T.isObject(store_config) ).to.be.true
				// expect( T.isObject(store_runtime) ).to.be.true
				
				
				let value = null;
				
				// GET RESOURCES LIST
				expect(config).contain.keys('get_resources', 'get_views', 'get_models', 'get_menubars', 'get_menus', 'get_connexions', 'get_loggers')
				
				value = config.get_resources();
				// console.log(value, 'value')
				expect( T.isArray(value) ).to.be.true
				
				value = config.get_views();
				// console.log(value, 'value')
				expect( T.isArray(value) ).to.be.true
				
				value = config.get_models();
				// console.log(value, 'value')
				expect( T.isArray(value) ).to.be.true
				
				value = config.get_menubars();
				// console.log(value, 'value')
				expect( T.isArray(value) ).to.be.true
				
				value = config.get_menus();
				// console.log(value, 'value')
				expect( T.isArray(value) ).to.be.true
				
				value = config.get_connexions();
				// console.log(value, 'value')
				expect( T.isArray(value) ).to.be.true
				
				value = config.get_loggers();
				// console.log(value, 'value')
				expect( T.isArray(value) ).to.be.true
				
				
				// GET A RESOURCE
				expect(config).contain.keys('get_resource', 'get_view', 'get_model', 'get_menubar', 'get_menu', 'get_connexion', 'get_logger')
				
			}
		)
		
		
		it('get config resource("VIEW_HOME")',
			() => {
				const RES_NAME = 'VIEW_HOME'
				const RES_CLASS = 'IncludeView'
				
				let value_obj = null
				
				
				value_obj = config.get_resource(RES_NAME)
				
				// console.log(value_obj, 'value_obj')
				
				expect( T.isObject(value_obj) ).to.be.true
				expect( T.isString(value_obj.class_name) ).to.be.true
				expect( value_obj.class_name ).to.be.equal(RES_CLASS)
				
				
				value_obj = config.get_view(RES_NAME)
				
				// console.log(value_obj, 'value_obj')
				
				expect( T.isObject(value_obj) ).to.be.true
				expect( T.isString(value_obj.class_name) ).to.be.true
				expect( value_obj.class_name ).to.be.equal(RES_CLASS)
			}
		)
		
		
		it('get config resource("HOME_MENUBAR")',
			() => {
				const RES_NAME = 'HOME_MENUBAR'
				const RES_CLASS = 'Menubar'
				
				let value_obj = null
				
				value_obj = config.get_resource(RES_NAME)
				// console.log(value_obj, 'value_obj')
				expect( T.isObject(value_obj) ).to.be.true
				expect( T.isString(value_obj.class_name) ).to.be.true
				expect( value_obj.class_name ).to.be.equal(RES_CLASS)
				
				value_obj = config.get_menubar(RES_NAME)
				// console.log(value_obj, 'value_obj')
				expect( T.isObject(value_obj) ).to.be.true
				expect( T.isString(value_obj.class_name) ).to.be.true
				expect( value_obj.class_name ).to.be.equal(RES_CLASS)
			}
		)
		
		
		it('create a runtime application for ("tutorial-1")',
			() => {
				const APP_NAME = 'tutorial-1'
				
				expect( config().has('applications') ).to.be.true
				expect( runtime().has('applications') ).to.be.true
				
				expect( config().get('applications').toMap().has(APP_NAME) ).to.be.true
				expect( config.has_application(APP_NAME) ).to.be.true
				expect( runtime().get('applications').toMap().has(APP_NAME) ).to.be.false
				expect( runtime.has_application(APP_NAME) ).to.be.false
				
				dispatch_store_runtime_apps_create(store, APP_NAME, { app_setting_1:'hello' })
				
				console.log(runtime().get('applications').toMap().toJS(), 'runtime.applications')
				
				expect( config().get('applications').toMap().has(APP_NAME) ).to.be.true
				expect( runtime().get('applications').toMap().has(APP_NAME) ).to.be.true
				expect( runtime().hasIn(['applications', APP_NAME, 'app_setting_1']) ).to.be.true
				
				store.dispatch( ActionCreators.undo() )
				
				expect( config().get('applications').toMap().has(APP_NAME) ).to.be.true
				// expect( runtime().get('applications').toMap().has(APP_NAME) ).to.be.false
				
				store.dispatch( ActionCreators.redo() )
				
				expect( config().get('applications').toMap().has(APP_NAME) ).to.be.true
				expect( runtime().get('applications').toMap().has(APP_NAME) ).to.be.true
				expect( runtime().hasIn(['applications', APP_NAME, 'app_setting_1']) ).to.be.true
			}
		)
	}
)
*/
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {List, Map} from 'immutable';
import T from 'typr'

import { store, config, runtime } from '../store/index'
import { dispatch_store_config_get_value } from '../store/config/actions'
import { dispatch_store_runtime_get_value } from '../store/runtime/actions'

import * as test_load_config from '../store/test/test_load_config'



describe('store',
	() => {
		it('create_store()',
			() => {
				let state = store.getState()
				let config_obj = state.config_reducer.toJS()
				
				// console.log(config_obj, 'config_obj')
				
				config_obj = config_obj.config
				
				if (config_obj.modules && config_obj.modules.error)
				{
					console.log(config_obj.modules.error, 'config_obj.modules.error')
					console.log(config_obj.modules.errors, 'config_obj.modules.errors')
				}
				
				expect( T.isObject(state) ).to.be.true
				
				expect(state).contain.keys('config_reducer', 'runtime_reducer')
				
				expect(state.config_reducer.has('config')).to.be.true
				expect(state.runtime_reducer.has('runtime')).to.be.true
				
				expect(state.config_reducer.get('config').has('error')).to.be.false
				expect(state.config_reducer.get('config').has('host')).to.be.true
				expect(state.config_reducer.get('config').has('port')).to.be.true
				expect(state.config_reducer.get('config').has('apps')).to.be.true
				expect(state.config_reducer.get('config').has('modules')).to.be.true
				expect(state.config_reducer.get('config').has('plugins')).to.be.true
				expect(state.config_reducer.get('config').has('security')).to.be.true
				
				expect(state.runtime_reducer.get('runtime').has('error')).to.be.false
				expect(state.runtime_reducer.get('runtime').has('application')).to.be.true
				expect(state.runtime_reducer.get('runtime').has('records')).to.be.true
				expect(state.runtime_reducer.get('runtime').has('instances')).to.be.true
				expect(state.runtime_reducer.get('runtime').has('security')).to.be.true
			}
		)
		
		it('store getters',
			() => {
				let store_config = config()
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
	}
)

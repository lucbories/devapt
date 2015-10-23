import {describe, it} from 'mocha';
import {expect} from 'chai';
import {List, Map} from 'immutable';
import T from 'typr'

import create_store from '../store/create_store'

import * as test_load_config from '../store/test/test_load_config'



describe('store',
	() => {
		it('create_store()',
			() => {
				let store = create_store()
				let state = store.getState()
				// console.log(state, 'state')
				
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
	}
)

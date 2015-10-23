import {describe, it} from 'mocha';
import {expect} from 'chai';
import {List, Map} from 'immutable';

import load_config from '../../loaders/load_config'


describe('load_config',
	() => {
		describe('load_config from apps.json',
			() => {
				it('load_config({})',
					() => {
						let state = {}
						let config = load_config(state)
						
						expect(config).to.contain.keys('config')
						state.config = config.config
						// console.log(state, 'state')
						// console.log(config, 'config')
						
						expect(state).to.contain.keys('config')
						expect(state.config).not.to.contain.keys('error')
					}
				)
				
				it('load_config({ item1:100 })',
					() => {
						let state = { item1:100 }
						let config = load_config(state)
						
						expect(config).to.contain.keys('config')
						state.config = config.config
						// console.log(state, 'state')
						// console.log(config, 'config')
						
						expect(state).to.contain.keys('config')
						expect(state.config).not.to.contain.keys('error')
						expect(state.item1).equal(100);
					}
				)
			}
		)
		
		describe('load_config from given value',
			() => {
				it('load_config({}, {})',
					() => {
						let state = {}
						let value = {}
						let config = load_config(state, value)
						
						expect(config).to.contain.keys('config')
						state.config = config.config
						// console.log(state, 'state')
						// console.log(config, 'config')
						
						expect(state).to.contain.keys('config')
						expect(state.config).to.contain.keys('error')
					}
				)
			}
		)
	}
)

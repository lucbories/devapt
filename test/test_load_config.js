import {describe, it} from 'mocha';
import {expect} from 'chai';
import {List, Map} from 'immutable';

import load_config from '../common/loaders/load_config'


describe('load_config',
	() => {
		describe('load_config from apps.json',
			() => {
				it('load_config({})',
					() => {
						let state = {}
						let config = load_config(state)
						console.log(state, 'state')
						expect(config).to.contain.keys('config');
						config = config.config
						expect(config).not.to.contain.keys('error');
						// expect(state).to.equal(42);
					}
				)
			}
		)
	}
)

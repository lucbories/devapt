// NPM IMPORTS
import chai from 'chai'
// import chaiAsPromised from 'chai-as-promised'
// chai.use(chaiAsPromised)
// chai.should()

const expect = chai.expect
// const assert = chai.assert

// COMMON IMPORTS
import CacheManager from '../../../../common/cache/cache_manager'
import CacheAdapterNodecache from '../../../../common/cache/cache_adapter_node_cache'
// import CacheAdapterCacheManager from '../../../../common/cache/cache_adapter_cache_manager'



describe('Cache', () => {

	describe('CacheManager({})', () => {
		let cache_manager = new CacheManager()
		let promise0 = undefined
		let promise1 = undefined

		it('Create CacheManager', () => {
			const cache_adapter = new CacheAdapterNodecache({ttl:300, check_period:1000})
			cache_manager.add_adapter(cache_adapter)
		} )

		it('adapter.has with empty cache', ()=>{
			promise0 = cache_manager.has('test1')
			return promise0.then( (result)=>{
				expect(result).equal(false)
			} )
		} )
		
		it('adapter.set', ()=>{
			promise1 = promise0.then(
				()=>{
					return cache_manager.set('test1', 'value1', 1000)
				}
			)
			return promise1
		} )
		
		it('adapter.has', ()=>{
			const promise11 = promise1.then(
				(success)=>{
					return success ? cache_manager.has('test1') : false
				}
			)
			return promise11.then( (result)=>{ expect(result).equal(true) } )
		} )
		
		it('adapter.get_ttl', ()=>{
			const promise12 = promise1.then(
				()=>{
					return cache_manager.get_ttl('test1')
				}
			)
			return promise12.then( (result)=>{ expect(result).to.be.a('number') } )
		} )
		
		it('adapter.get', ()=>{
			const promise13 = promise1.then(
				()=>{
					return cache_manager.get('test1')
				}
			)
			return promise13.then( (result)=>{ expect(result).equal('value1') } )
		} )
		
		it('adapter.has after 300ms', ()=>{
			const promise14 = new Promise(
				(resolve/*, reject*/)=>{
					setTimeout(
						()=>{
							cache_manager.has('test1').then( (result)=> { resolve(result) } )
						},
						300)
				} 
			)
			return promise14.then( (result) => { expect(result).equal(true) } )
		} )
		
		it('adapter.has after 500ms', ()=>{
			const promise15 = new Promise(
				(resolve/*, reject*/)=>{
					setTimeout(
						()=>{
							cache_manager.has('test1').then( (result)=> { resolve(result) } )
						},
						500)
				} 
			)
			return promise15.then( (result) => { expect(result).equal(true) } )
		} )
		
		it('adapter.has after 1500ms', ()=>{
			const promise16 = new Promise(
				(resolve/*, reject*/)=>{
					setTimeout(
						()=>{
							cache_manager.has('test1').then( (result)=> { resolve(result) } )
						},
						1500)
				} 
			)
			return promise16.then( (result) => { expect(result).equal(false) } )
		} )
	} )
} )

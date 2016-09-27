// NPM IMPORTS
import chai from 'chai'

const expect = chai.expect

// COMMON IMPORTS
import CacheAdapterNodecache from '../../../../common/cache/cache_adapter_node_cache'



describe('Cache', () => {

	describe('CacheAdapterNodecache({ttl:300, check_period:1000})', () => {
		let cache_adapter = undefined
		let promise0 = undefined
		let promise1 = undefined

		it('Create CacheAdapterNodecache', () => {
			cache_adapter = new CacheAdapterNodecache({ttl:300, check_period:1000})
			expect( cache_adapter).to.be.an('object')
			expect( cache_adapter).to.be.an.instanceof(CacheAdapterNodecache)
			expect( cache_adapter.is_cache_adapter).equal(true)
		} )

		it('adapter.has with empty cache', ()=>{
			promise0 = cache_adapter.has('test1')
			return promise0.then( (result)=>{
				expect(result).equal(false)
			} )
		} )
		
		it('adapter.set', ()=>{
			promise1 = promise0.then(
				()=>{
					return cache_adapter.set('test1', 'value1', 1000)
				}
			)
			return promise1
		} )
		
		it('adapter.has', ()=>{
			const promise11 = promise1.then(
				(success)=>{
					return success ? cache_adapter.has('test1') : false
				}
			)
			return promise11.then( (result)=>{ expect(result).equal(true) } )
		} )
		
		it('adapter.get_ttl', ()=>{
			const promise12 = promise1.then(
				()=>{
					return cache_adapter.get_ttl('test1')
				}
			)
			return promise12.then( (result)=>{ expect(result).to.be.a('number') } )
		} )
		
		it('adapter.get', ()=>{
			const promise13 = promise1.then(
				()=>{
					return cache_adapter.get('test1')
				}
			)
			return promise13.then( (result)=>{ expect(result).equal('value1') } )
		} )
		
		it('adapter.has after 300ms', ()=>{
			const promise14 = new Promise(
				(resolve/*, reject*/)=>{
					setTimeout(
						()=>{
							cache_adapter.has('test1').then( (result)=> { resolve(result) } )
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
							cache_adapter.has('test1').then( (result)=> { resolve(result) } )
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
							cache_adapter.has('test1').then( (result)=> { resolve(result) } )
						},
						1500)
				} 
			)
			return promise16.then( (result) => { expect(result).equal(false) } )
		} )
	} )
} )

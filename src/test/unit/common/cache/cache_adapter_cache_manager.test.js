// NPM IMPORTS
import chai from 'chai'

const expect = chai.expect

// COMMON IMPORTS
import CacheAdapterCacheManager from '../../../../common/cache/cache_adapter_cache_manager'



describe('Cache', () => {
	
	describe('CacheAdapterCacheManager({ttl:500, stores:[memory]})', () => {
		let cache_adapter = undefined
		let promise0 = undefined
		let promise1 = undefined

		it('Create CacheAdapterCacheManager', () => {
			const settings = {
				ttl:300,
				stores:[
					{
						type:'memory',
						ttl:500,
						max:10
					}
				]
			}
			cache_adapter = new CacheAdapterCacheManager(settings)
			expect( cache_adapter).to.be.an('object')
			expect( cache_adapter).to.be.an.instanceof(CacheAdapterCacheManager)
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
				()=>{
					return cache_adapter.has('test1')
					// return success ? cache_adapter.has('test1') : false
				}
			)
			return promise11.then( (result)=>{ expect(result).equal(true) } )
		} )
		
		// it('adapter.get_ttl', ()=>{
		// 	const promise12 = promise1.then(
		// 		()=>{
		// 			return cache_adapter.get_ttl('test1')
		// 		}
		// 	)
		// 	return promise12.then( (result)=>{ expect(result).to.be.a('number') } )
		// } )
		
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
		
		it('adapter.max has test1', ()=>{
			const promise17 = promise1.then(
				(success)=>{
					return success ? cache_adapter.has('test1') : false
				}
			)
			return promise17.then( (result)=>{ expect(result).equal(false) } )
		} )

		it('adapter.max has not test1', ()=>{
			promise1 = promise0.then(
				()=>{
					cache_adapter.set('test2', 'value2', 1000)
					cache_adapter.set('test3', 'value3', 1000)
					cache_adapter.set('test4', 'value4', 1000)
					cache_adapter.set('test5', 'value5', 1000)
					cache_adapter.set('test6', 'value6', 1000)
					cache_adapter.set('test7', 'value7', 1000)
					cache_adapter.set('test8', 'value8', 1000)
					cache_adapter.set('test9', 'value9', 1000)
					cache_adapter.set('test10', 'value10', 1000)
					cache_adapter.set('test11', 'valu11', 1000)
					cache_adapter.set('test12', 'value12', 1000)
				}
			)
			const promise17 = promise1.then(
				(success)=>{
					return success ? cache_adapter.has('test1') : false
				}
			)
			return promise17.then( (result)=>{ expect(result).equal(false) } )
		} )
	} )
} )

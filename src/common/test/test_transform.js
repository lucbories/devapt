
import T from 'typr'
// import {describe, it} from 'mocha'
import {expect} from 'chai'

import { extract, flat, transform } from '../utils/transform'



describe('common/utils/transform',
	() => {
		it('Extract',
			() => {
				let items = { v1:'a', v2:'b', v3:'c', v4:['d'] }
				let xform1 = {
					result_type:'object',
					fields:[
						{
							name:'v2',
							path:'v2'
						},
						{
							name:'v4',
							path:'v4'
						},
						{
							name:'v5',
							value:'v5'
						}
					]
				}
				
				const xform1_extract_v2_extractor = extract(xform1.fields[0])
				const xform1_extract_v4_extractor = extract(xform1.fields[1])
				const xform1_extract_v5_extractor = extract(xform1.fields[2])
				
				// console.log(T.isFunction(xform1_extract_v2_f), 'T.isFunction(xform1_extract_v2_f)')
				// console.log(xform1_extract_v2_f, '(xform1_extract_v2_f)')
				
				expect( T.isObject(xform1_extract_v2_extractor) ).to.be.true
				expect( T.isObject(xform1_extract_v4_extractor) ).to.be.true
				expect( T.isObject(xform1_extract_v5_extractor) ).to.be.true
				
				expect( T.isFunction(xform1_extract_v2_extractor.extract) ).to.be.true
				expect( T.isFunction(xform1_extract_v4_extractor.extract) ).to.be.true
				expect( T.isFunction(xform1_extract_v5_extractor.extract) ).to.be.true
				
				const xform1_extract_v2_result = xform1_extract_v2_extractor.extract(items)
				const xform1_extract_v4_result = xform1_extract_v4_extractor.extract(items)
				const xform1_extract_v5_result = xform1_extract_v5_extractor.extract(items)
				
				// console.log(xform1_extract_v2_result, '(xform1_extract_v2_result)')
				// console.log(xform1_extract_v4_result, '(xform1_extract_v4_result)')
				// console.log(xform1_extract_v5_result, '(xform1_extract_v5_result)')
				
				expect( T.isString(xform1_extract_v2_result) ).to.be.true
				expect( T.isArray(xform1_extract_v4_result) ).to.be.true
				expect( T.isString(xform1_extract_v5_result) ).to.be.true
				
				expect( xform1_extract_v2_result == 'b' ).to.be.true
				expect( T.isArray(xform1_extract_v4_result) && xform1_extract_v4_result.length > 0).to.be.true
				expect( xform1_extract_v4_result[0] == 'd' ).to.be.true
				expect( xform1_extract_v5_result == 'v5' ).to.be.true
			}
		)
		
		it('Transform',
			() => {
				let items = [
					{ v1:'a1', v2:'b1', v3:'c1', v4:['d1'] },
					{ v1:'a2', v2:'b2', v3:'c2', v4:['d2'] },
					{ v1:'a3', v2:'b3', v3:'c3', v4:['d3'] }
				]
				let xform1 = {
					result_type:'object',
					fields:[
						{
							name:'i2',
							path:'v2'
						},
						{
							name:'i4',
							path:'v4'
						},
						{
							name:'i5',
							value:'v5'
						}
					]
				}
				
				// const xform1_extract_v2_extractor = extract(xform1.fields[0])
				// const xform1_extract_v4_extractor = extract(xform1.fields[1])
				// const xform1_extract_v5_extractor = extract(xform1.fields[2])
				
				const xformer = transform(xform1)
				// console.log(xformer, 'xformer')
				
				const result0 = xformer(items[0])
				// console.log(result0, 'result0')
				
				const results = xformer(items)
				// console.log(results, 'results')
				
				// console.log('result0:')
				expect( T.isObject(result0) ).to.be.true
				expect( result0.i2 ).to.equal('b1')
				expect( T.isArray(result0.i4) && result0.i4.length > 0 ).to.be.true
				expect( result0.i4[0] ).to.equal('d1')
				expect( result0.i5 ).to.equal('v5')
				
				// console.log('results:')
				expect( T.isArray(results) && results.length == items.length).to.be.true
				let index = 0
				
				// console.log('results[0]:')
				index = 0
				expect( T.isObject(results[index]) ).to.be.true
				expect( results[index].i2).to.equal(items[index].v2)
				expect( T.isArray(results[index].i4) && results[index].i4.length > 0).to.be.true
				expect( results[index].i4[0] ).to.equal(items[index].v4[0])
				expect( results[index].i5 ).to.equal('v5')
				
				// console.log('results[1]:')
				index = 1
				expect( T.isObject(results[index]) ).to.be.true
				expect( results[index].i2).to.equal(items[index].v2)
				expect( T.isArray(results[index].i4) && results[index].i4.length > 0).to.be.true
				expect( results[index].i4[0] ).to.equal(items[index].v4[0])
				expect( results[index].i5 ).to.equal('v5')
				
				// console.log('results[2]:')
				index = 2
				expect( T.isObject(results[index]) ).to.be.true
				expect( results[index].i2).to.equal(items[index].v2)
				expect( T.isArray(results[index].i4) && results[index].i4.length > 0).to.be.true
				expect( results[index].i4[0] ).to.equal(items[index].v4[0])
				expect( results[index].i5 ).to.equal('v5')
			}
		)
		
		it('Flat values',
			() => {
				let items = [
					{ v1:'a1', v2:'b1', v3:'c1', v4:[ 'd1a', 'd1b', 'd1c' ] },
					{ v1:'a2', v2:'b2', v3:'c2', v4:[ 'd2a', 'd2b', 'd2c' ] },
					{ v1:'a3', v2:'b3', v3:'c3', v4:[ 'd3a', 'd3b', 'd3c' ] }
				]
				let xform1 = {
					result_type:'object',
					flat_field_name:'v4',
					flat_fields:[
						{
							name:'pos1'
						}
					],
					fields:[
						{
							name:'i2',
							path:'v2'
						},
						{
							name:'i1',
							path:'v1'
						},
						{
							name:'i5',
							value:'v5'
						}
					]
				}
				
				const xformer = transform(xform1)
				// console.log(xformer, 'xformer')
				
				const result0 = xformer(items[0])
				console.log(result0, 'Flat values results[0]')
				
				const result1 = xformer(items[1])
				console.log(result1, 'Flat values results[1]')
				
				const result2 = xformer(items[2])
				console.log(result2, 'Flat values results[2]')
			}
		)
		
		it('Flat arrays',
			() => {
				let items = [
					{ v1:'a1', v2:'b1', v3:'c1', v4:[ ['item 1 flat value 1:0'], ['item 1 flat value 2:0'], ['item 1 flat value 3:0'] ] },
					{ v1:'a2', v2:'b2', v3:'c2', v4:[ ['item 2 flat value 1:0', 'item 2 flat value 1:1'], ['item 2 flat value 2:0', 'item 2 flat value 2:1'], ['item 2 flat value 3:0', 'item 2 flat value 3:1'] ] },
					{ v1:'a3', v2:'b3', v3:'c3', v4:[ ['item 3 flat value 1:0'], ['item 3 flat value 2:0', 'item 3 flat value 2:1'], ['item 3 flat value 3:0'] ] }
				]
				let xform1 = {
					result_type:'array',
					flat_field_name:'v4',
					flat_fields:[
						{
							path:1,
							name:'pos1'
						},
						{
							path:0,
							name:'pos0'
						}
					],
					fields:[
						{
							name:'i2',
							path:'v2'
						},
						{
							name:'i1',
							path:'v1'
						},
						{
							name:'i5',
							value:'v5'
						}
					]
				}
				
				const flat_extractor = flat('v4', xform1.fields, xform1.flat_fields, xform1.result_type)
				
				const result0 = flat_extractor(items[0])
				console.log(result0, 'Flat arrays results[0]')
				
				const result1 = flat_extractor(items[1])
				console.log(result1, 'Flat values results[1]')
				
				const result2 = flat_extractor(items[2])
				console.log(result2, 'Flat values results[2]')
				
				
				// const xformer = transform(xform1)
				// console.log(xformer, 'xformer')
				
				// const result0 = xformer(items[0])
				// console.log(result0, 'Flat values results[0]')
				
				// const result1 = xformer(items[1])
				// console.log(result1, 'Flat values results[1]')
				
				// const result2 = xformer(items[2])
				// console.log(result2, 'Flat values results[2]')
			}
		)
	}
)

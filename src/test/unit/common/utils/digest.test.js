// NPM IMPORTS
import {expect} from 'chai'

// COMMON IMPORTS
import Digest from '../../../../common/utils/digest'



describe('Errorable', () => {
	let source = "hello world!"
	let result = undefined
	let target = undefined
	
	describe('MD5/hex', () => {
		it('Digest.md5("")', () => {
			result = Digest.md5('')
			target = 'd41d8cd98f00b204e9800998ecf8427e'
			expect(result).equal(target)
		} )

		it('Digest.md5(source)', () => {
			result = Digest.md5(source)
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )

		it('Digest.md5(source, "hex")', () => {
			result = Digest.md5(source, 'hex')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )

		it('Digest.hash(source, "md5", "hex")', () => {
			result = Digest.hash(source, "md5", 'hex')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )
	} )

	describe('MD5/utf8', () => {
		it('Digest.md5("", "utf8")', () => {
			result = Digest.md5('', 'utf8')
			target = 'd41d8cd98f00b204e9800998ecf8427e'
			expect(result).equal(target)
		} )

		it('Digest.md5(source, "utf8")', () => {
			result = Digest.md5(source, 'utf8')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )

		it('Digest.md5(source, "utf8")', () => {
			result = Digest.md5(source, 'utf8')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )

		it('Digest.hash(source, "md5", "utf8")', () => {
			result = Digest.hash(source, 'md5', 'utf8')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )
	} )

	describe('MD5/base64', () => {
		it('Digest.md5("", "base64")', () => {
			result = Digest.md5('', 'base64')
			target = 'd41d8cd98f00b204e9800998ecf8427e'
			expect(result).equal(target)
		} )

		it('Digest.md5(source, "base64")', () => {
			result = Digest.md5(source, 'base64')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )

		it('Digest.md5(source, "base64")', () => {
			result = Digest.md5(source, 'base64')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )

		it('Digest.hash(source, "md5", "base64")', () => {
			result = Digest.hash(source, 'md5', 'base64')
			target = 'fc3ff98e8c6a0d3087d515c0473f8677'
			expect(result).equal(target)
		} )
	} )
} )

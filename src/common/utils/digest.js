// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
// import nodeforge from 'node-forge'

// COMMON IMPORTS
import { is_browser } from './is_browser'

let  forge = undefined
if ( is_browser() )
{
	forge = require('forge-browser').forge
} else {
	forge = require('node-forge')
}


const context = 'common/utils/digest'



/**
 * @file Digest class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Digest
{
    /**
     * Create a Digest instance.
	 * 
	 * 	API:
	 * 		->hash():string - 
	 * 
     * @returns {nothing}
     */
	constructor()
	{
	}
	
	
	
	/**
	 * Hash a string.
	 * 
	 * @param {string} arg_string - string to hash.
	 * @param {string|undefined} arg_digest_method - digest method name (sha1,sha256,sha384,sha512,md5)
	 * @param {string|undefined} arg_encoding_method - encoding method name (hex,utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - hashed string
	 */
	static hash(arg_string, arg_digest_method, arg_encoding_method)
	{
		assert(T.isString(arg_string), context + ':bad input string')
		arg_digest_method = T.isString(arg_digest_method) ? arg_digest_method : 'sha1'
		arg_encoding_method = T.isString(arg_encoding_method) ? arg_encoding_method : 'hex'
		
		// const buffer = forge.util.createBuffer(arg_string, 'utf8')
		// return buffer.toString('base64')
		
		// GET MESSAGE DIGEST FUNCTION
		let md = null
		switch(arg_digest_method.toLocaleLowerCase())
		{
			case 'sha1':   md = forge.md.sha1.create(); break
			case 'sha256': md = forge.md.sha256.create(); break
			case 'sha384': md = forge.md.sha384.create(); break
			case 'sha512': md = forge.md.sha512.create(); break
			case 'md5':	   md = forge.md.md5.create(); break
			default: this.error_bad_digest_method(arg_digest_method); return null
		}
		assert(md, context + ':bad message digest object')
		md.update(arg_string)
		
		// GET ENCODED MESSAGE
		let encoded = null
		switch(arg_encoding_method.toLocaleLowerCase())
		{
			case 'hex':
				encoded = md.digest().toHex(); break
			case 'utf8':
			case 'utf-8':
				// encoded = md.digest().toString('utf8'); break
				encoded = forge.util.createBuffer(md.digest().toHex(), 'hex')
				encoded = encoded.toString('utf8'); break
			case 'utf16':
			case 'utf-16':
				// encoded = md.digest().toString('utf16'); break
				encoded = forge.util.createBuffer(md.digest().toHex(), 'hex')
				encoded = encoded.toString('utf16'); break
			case 'binary':
				// encoded = md.digest().toString('binary'); break
				encoded = forge.util.createBuffer(md.digest().toHex(), 'hex')
				encoded = encoded.toString('binary'); break
			case 'base64':
				// encoded = md.digest().toString('base64'); break
				encoded = forge.util.createBuffer(md.digest().toHex(), 'hex')
				encoded = encoded.toString('base64'); break
			case 'hexstr':
				encoded = md.digest().toString('hex'); break
			default: this.error_bad_encoding_method(arg_encoding_method); return null
		}
		assert(encoded, context + ':bad message encoding result')
		
		return encoded
	}
	
	
	
	/**
	 * Hash a string with SHA1.
	 * 
	 * @param {string} arg_string - string to hash.
	 * @param {string|undefined} arg_encoding_method - encoding (default:hex or utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - hashed string
	 */
	static sha1(arg_string, arg_encoding_method='hex')
	{
		return Digest.hash(arg_string, 'sha1', arg_encoding_method)
	}
	
	
	
	/**
	 * Hash a string with SHA256.
	 * 
	 * @param {string} arg_string - string to hash.
	 * @param {string|undefined} arg_encoding_method - encoding (default:hex or utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - hashed string
	 */
	static sha256(arg_string, arg_encoding_method='hex')
	{
		return Digest.hash(arg_string, 'sha256', arg_encoding_method)
	}
	
	
	
	/**
	 * Hash a string with SHA384.
	 * 
	 * @param {string} arg_string - string to hash.
	 * @param {string|undefined} arg_encoding_method - encoding (default:hex or utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - hashed string
	 */
	static sha384(arg_string, arg_encoding_method='hex')
	{
		return Digest.hash(arg_string, 'sha384', arg_encoding_method)
	}
	
	
	
	/**
	 * Hash a string with SHA512.
	 * 
	 * @param {string} arg_string - string to hash.
	 * @param {string|undefined} arg_encoding_method - encoding (default:hex or utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - hashed string
	 */
	static sha512(arg_string, arg_encoding_method='hex')
	{
		return Digest.hash(arg_string, 'sha512', arg_encoding_method)
	}
	
	
	
	/**
	 * Hash a string with MD5.
	 * 
	 * @param {string} arg_string - string to hash.
	 * @param {string|undefined} arg_encoding_method - encoding (default:hex or utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - hashed string
	 */
	static md5(arg_string, arg_encoding_method='hex')
	{
		return Digest.hash(arg_string, 'md5', arg_encoding_method)
	}
}

// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import forge from 'node-forge'


const context = 'common/utils/encode_decode'



/**
 * @file EncodeDecode class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class EncodeDecode
{
    /**
     * Create a EncodeDecode instance.
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
	 * Encode a string.
	 * 
	 * @param {string} arg_string - utf8 string to hash.
	 * @param {string|undefined} arg_encoding_method - encoding method (default:hex or utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - encoded string
	 */
	static encode(arg_string, arg_encoding_method='hex')
	{
		assert(T.isString(arg_string), context + ':bad input string')
		arg_encoding_method = T.isString(arg_encoding_method) ? arg_encoding_method : 'hex'
		
		const buffer = forge.util.createBuffer(arg_string, 'utf8')
		
		// GET ENCODED MESSAGE
		let encoded = null
		switch(arg_encoding_method.toLocaleLowerCase())
		{
			case 'hex':
				encoded = buffer.toHex(); break
			case 'utf8':
			case 'utf-8':
				encoded = buffer.toString('utf8'); break
			case 'utf16':
			case 'utf-16':
				encoded = buffer.toString('utf16'); break
			case 'binary':
				encoded = buffer.toString('binary'); break
			case 'base64':
				encoded = buffer.toString('base64'); break
			case 'hexstr':
				encoded = buffer.toString('hex'); break
			default: this.error_bad_encoding_method(arg_encoding_method); return null
		}
		assert(encoded, context + ':bad message encoding result')
		
		return encoded
	}
	
	
	
	/**
	 * Decode a string.
	 * 
	 * @param {string} arg_string - string to hash.
	 * @param {string|undefined} arg_encoding_method - encoding method (default:hex,utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - decoded string in utf8
	 */
	static decode(arg_string, arg_encoding_method='hex')
	{
		assert(T.isString(arg_string), context + ':bad input string')
		arg_encoding_method = T.isString(arg_encoding_method) ? arg_encoding_method : 'hex'
		
		let buffer = null
		switch(arg_encoding_method.toLocaleLowerCase())
		{
			case 'hex':
				buffer = forge.util.createBuffer(arg_string, 'hex'); break
			case 'utf8':
			case 'utf-8':
				buffer = forge.util.createBuffer(arg_string, 'utf8'); break
			case 'utf16':
			case 'utf-16':
				buffer = forge.util.createBuffer(arg_string, 'utf16'); break
			case 'binary':
				buffer = forge.util.createBuffer(arg_string, 'binary'); break
			case 'base64':
				buffer = forge.util.createBuffer(arg_string, 'base64'); break
			case 'hexstr':
				buffer = forge.util.createBuffer(arg_string, 'hex'); break
			default: this.error_bad_encoding_method(arg_encoding_method); return null
		}
		assert(buffer, context + ':bad message decoding result')
		
		return buffer.toString('utf8')
	}
}

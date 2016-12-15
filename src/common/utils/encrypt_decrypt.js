// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import {is_browser} from './is_browser'

let  forge = undefined
if ( is_browser() )
{
	forge = require('forge-browser').forge
} else {
	forge = require('node-forge')
}


const context = 'common/utils/encrypt_decrypt'



/**
 * @file EncryptDecrypt class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class EncryptDecrypt
{
    /**
     * Create a EncryptDecrypt instance.
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
	 * Generate an encryption key from a secret.
	 * 
	 * @param {string} arg_app_secret - application cryptographic secret.
	 * @param {number} arg_num_iterations - iterations count.
	 * @param {number} arg_key_length - key length.
	 * @param {number} arg_iv_length - iv length.
	 * 
	 * @returns {string} - encrypted string.
	 */
	static key(arg_app_secret, arg_num_iterations=10, arg_key_length=32)
	{
		assert( T.isString(arg_app_secret) && arg_app_secret.length > 0, context + ':encrypt:bad secret string')
		assert( T.isNumber(arg_num_iterations) && arg_num_iterations > 3, context + ':encrypt:bad key length')
		assert( T.isNumber(arg_key_length) && arg_key_length > 15, context + ':encrypt:bad key length')

		const salt = forge.random.getBytesSync(128)

		return forge.pkcs5.pbkdf2(arg_app_secret, salt, arg_num_iterations, arg_key_length)
	}



	/**
	 * Transform to a string with encryption.
	 * 
	 * @param {string} arg_string - string to encrypt.
	 * @param {string} arg_key - encryotion key.
	 * @param {string} arg_mode - cryptographic mode AES-ECB,AES-CBC,AES-CFB,AES-OFB,AES-CTR,AES-GCM,3DES-ECB,3DES-CBC,DES-ECB,DES-CBC.
	 * @param {number} arg_iv_length - iv length.
	 * 
	 * @returns {string} - encrypted string.
	 */
	static encrypt(arg_string, arg_key, arg_mode='AES-ECB', arg_iv_length=8)
	{
		assert( T.isString(arg_string) && arg_string.length > 0, context + ':encrypt:bad input string')
		assert( T.isNumber(arg_iv_length)  && arg_iv_length > 7, context + ':encrypt:bad iv length')

		const iv = forge.random.getBytesSync(arg_iv_length)

		const buffer = forge.util.createBuffer(arg_string)
		const cipher = forge.cipher.createCipher(arg_mode, arg_key)
		cipher.start({iv: iv})
		cipher.update(buffer)
		cipher.finish()
		const encrypted = cipher.output

		return encrypted.toHex()
	}



	/**
	 * Transform to a string without encryption.
	 * 
	 * @param {string} arg_string - encrypted string.
	 * @param {string} arg_key - encryption key.
	 * @param {string} arg_mode - cryptographic mode AES-ECB,AES-CBC,AES-CFB,AES-OFB,AES-CTR,AES-GCM,3DES-ECB,3DES-CBC,DES-ECB,DES-CBC.
	 * @param {number} arg_iv_length - iv length.
	 * 
	 * @returns {string} - decrypted string.
	 */
	static decrypt(arg_string, arg_key, arg_mode='AES-ECB', arg_iv_length=8)
	{
		assert( T.isString(arg_string) && arg_string.length > 0, context + ':encrypt:bad encrypted string')
		assert( T.isString(arg_mode)   && arg_mode.length > 0, context + ':encrypt:bad mode string')
		assert( T.isString(arg_key)   && arg_mode.length > 0, context + ':encrypt:bad key string')
		assert( T.isNumber(arg_iv_length)  && arg_iv_length > 7, context + ':encrypt:bad iv length')

		const iv = forge.random.getBytesSync(arg_iv_length)

		const buffer = forge.util.createBuffer(arg_string)
		const decipher = forge.cipher.createDecipher(arg_mode, arg_key)
		decipher.start({iv: iv})
		decipher.update(buffer)
		decipher.finish()
		const decrypted = decipher.output

		return decrypted.toHex()
	}
}

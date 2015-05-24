<?php
/**
 * @file        Authentication.php
 * @brief       ...
 * @details     ...
 * @see			...
 * @ingroup     SECURITY
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		
 */

namespace Devapt\Security;

// ZF2 IMPORTS
use Zend\Debug\Debug;
//use Zend\Crypt\Hash;
//use Zend\Crypt\Hmac;
use Zend\Crypt\BlockCipher;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Application\Application as Application;

final class Authentication
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_AUTHENTICATION		= true;
	
	/// @brief AUTHENTICATION IMPLEMENTATION ADAPTER
	static private $authentication_adapter	= null;
	
	/// @brief LIBRARY SECURITY SECRET FOR TOKEN HASH
	static private $security_secret			= 'vjzirjz"ç²1fg4f5*$?./635è"&&4<:>nezrinrfgjg';
	
	/// @brief CURRENT REQUEST SECURITY TOKEN
	static private $security_token			= null;
	
	/// @brief CURRENT REQUEST SECURITY LOGIN FROM TOKEN
	static private $security_login			= null;
	
	/// @brief CURRENT REQUEST SECURITY EXPIRATION FROM TOKEN
	static private $security_expiration		= null;
	
	/// @brief CURRENT REQUEST SECURITY HASH FROM TOKEN
	static private $security_hash		= null;
	
	/// @brief CURRENT REQUEST SECURITY AUTHENTICATED FLAG
	static private $is_logged				= false;
	
	/// @brief TOKEN PARTS SEPARATOR
	static private $TOKEN_PARTS_SEPARATOR	= '******';
	
	/// @brief CURRENT REQUEST SECURITY AUTHENTICATED FLAG
	static private $TOKEN_CRYPT_ALGO		= 'aes';
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Init the authentication adapter
	 * @param[in]	arg_adapter		adapter object
	 * @return		boolean
	 */
	static public function initAuthentication($arg_adapter)
	{
		if ($arg_adapter instanceof AuthenticationAdapterInterface)
		{
			Authentication::$authentication_adapter = $arg_adapter;
		}
		
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		return true;
	}
	
	
	
	/**
	 * @brief		Test if authentication is enabled
	 * @return		boolean
	 */
	static public function isEnabled()
	{
		return Application::getInstance()->getConfig()->getSecurityAuthenticationEnabled();
	}
	
	
	
	/**
	 * @brief		Test if a user is logged
	 * @return		boolean
	 */
	static public function isLogged()
	{
		$context = 'Authentication::isLogged()';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			Trace::step($context, 'AUTHENTICATION IS NOT ENABLED', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		// CHECK STATIC CACHE
		// Trace::value($context, 'AUTHENTICATION IS CACHED VALUE', Authentication::$is_logged, Authentication::$TRACE_AUTHENTICATION);
		if (Authentication::$is_logged)
		{
			Trace::step($context, 'AUTHENTICATION IS CACHED AND VALID', Authentication::$TRACE_AUTHENTICATION);
			return Authentication::$is_logged;
		}
		
		// CHECK TOKEN
		if ( Authentication::checkToken() )
		{
			Trace::step($context, 'AUTHENTICATION TOKEN IS VALID', Authentication::$TRACE_AUTHENTICATION);
			Authentication::$is_logged = true;
			return true;
		}
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			Trace::step($context, 'AUTHENTICATION HAS ADAPTER', Authentication::$TRACE_AUTHENTICATION);
			return Authentication::$authentication_adapter->isLogged();
		}
		
		
		Trace::error($context, 'AUTHENTICATION HAS NO ADAPTER', Authentication::$TRACE_AUTHENTICATION);
		return false;
	}
	
	
	
	/**
	 * @brief		Get the logged user login
	 * @return		string
	 */
	static public function getLogin()
	{
		$context = 'Authentication::getLogin()';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			Trace::step($context, 'AUTHENTICATION IS NOT ENABLED', Authentication::$TRACE_AUTHENTICATION);
			return null;
		}
		
		if (Authentication::$security_login)
		{
			Trace::step($context, 'SECURITY LOGIN EXISTS', Authentication::$TRACE_AUTHENTICATION);
			return Authentication::$security_login;
		}
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			Trace::step($context, 'AUTHENTICATION HAS ADAPTER', Authentication::$TRACE_AUTHENTICATION);
			return Authentication::$authentication_adapter->getLogin();
		}
		
		Trace::error($context, 'AUTHENTICATION HAS NO ADAPTER', Authentication::$TRACE_AUTHENTICATION);
		return null;
	}
	
	
	
	/**
	 * @brief		Test the authentication credentials
	 * @param[in]	arg_login		login
	 * @param[in]	arg_password	password (hashed value)
	 * @return		boolean
	 */
	static public function login($arg_login, $arg_password)
	{
		$context = 'Authentication::login(login,pwd)';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		
		
		// RESET SECURITY ATTRIBUTES
		Authentication::$is_logged = false;
		Authentication::$security_token = null;
		Authentication::$security_login = null;
		Authentication::$security_expiration = null;
		Authentication::$security_hash = null;
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			Trace::step($context, 'AUTHENTICATION IS NOT ENABLED', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			Trace::step($context, 'AUTHENTICATION HAS ADAPTER', Authentication::$TRACE_AUTHENTICATION);
			Authentication::$is_logged = Authentication::$authentication_adapter->login($arg_login, $arg_password);
			if(Authentication::$is_logged)
			{
				Authentication::$security_login = $arg_login;
			}
			return Authentication::$is_logged;
		}
		
		
		Trace::error($context, 'AUTHENTICATION HAS NO ADAPTER', Authentication::$TRACE_AUTHENTICATION);
		return false;
	}
	
	
	
	/**
	 * @brief		Logout the logged user
	 * @return		nothing
	 */
	static public function logout()
	{
		$context = 'Authentication::logout()';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			Trace::step($context, 'AUTHENTICATION IS NOT ENABLED', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		// RESET SECURITY ATTRIBUTES
		Authentication::$is_logged = false;
		Authentication::$security_token = null;
		Authentication::$security_login = null;
		Authentication::$security_expiration = null;
		Authentication::$security_hash = null;
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			Trace::step($context, 'AUTHENTICATION HAS ADAPTER', Authentication::$TRACE_AUTHENTICATION);
			return Authentication::$authentication_adapter->logout();
		}
		
		Trace::error($context, 'AUTHENTICATION HAS NO ADAPTER', Authentication::$TRACE_AUTHENTICATION);
		return false;
	}
	
	
	
	/**
	 * @brief		Get the security expiration for the logged user
	 * @return		string
	 */
	static public function expire()
	{
		$context = 'Authentication::expire()';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		
		// DEFAULT EXPIRATION AFTER FOUR HOURS
		// 1427115300		PHP time() + 60*60*4
		// 1427115078059	JS Date.now()
		
		$expiration_minutes = Application::getInstance()->getConfig()->getSecurityAuthenticationExpirationInMinutes();
		Trace::value($context, 'expiration_minutes', $expiration_minutes, Authentication::$TRACE_AUTHENTICATION);
		
		$expiration_ts = time() + 60*$expiration_minutes;
		Trace::value($context, 'expiration_ts', $expiration_ts, Authentication::$TRACE_AUTHENTICATION);
		
		return $expiration_ts;
	}
	
	
	
	/**
	 * @brief		Get the security token for the logged user
	 * @param[in]	arg_expire		token expiration timestamp
	 * @return		string
	 */
	static public function token($arg_expire)
	{
		$context = 'Authentication::token(expire)';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		
		$error_token = 'not_logged_token';
		$no_auth_token = 'no_auth_token';
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			Trace::step($context, 'AUTHENTICATION IS NOT ENABLED', Authentication::$TRACE_AUTHENTICATION);
			return $no_auth_token;
		}
		
		if ( !  Authentication::isLogged() )
		{
			Trace::step($context, 'AUTHENTICATION HAS NO LOGGED USER', Authentication::$TRACE_AUTHENTICATION);
			return $error_token;
		}
		
		// CHECK LOGIN
		$login = Authentication::getLogin();
		if ( is_null($login) )
		{
			Trace::step($context, 'AUTHENTICATION HAS NO VALID LOGIN', Authentication::$TRACE_AUTHENTICATION);
			return $error_token;
		}
		
		// CREATE TOKEN
		$app_secret = Application::getInstance()->getConfig()->getSecurityAuthenticationSecret();
		$lib_secret = Authentication::$security_secret;
		
		$hash = sha1($arg_expire.$login.$lib_secret.$app_secret);
		$expire_token = $arg_expire.Authentication::$TOKEN_PARTS_SEPARATOR.$login.Authentication::$TOKEN_PARTS_SEPARATOR.$hash;
		
		$encrypted_token = Authentication::encryptToken($expire_token);
		Trace::value($context, 'encrypted token', $encrypted_token, Authentication::$TRACE_AUTHENTICATION);
		
		return $encrypted_token;
	}
	
	
	/**
	 * @brief		Encrypt the security token if valid
	 * @param[in]	arg_token		token string
	 * @return		string
	 */
	static public function encryptToken($arg_token)
	{
		$context = 'Authentication::encryptToken(token)';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'arg_token', $arg_token, Authentication::$TRACE_AUTHENTICATION);
		
		
		// CHECK TOKEN
		if ( is_null($arg_token) || $arg_token === '' )
		{
			Trace::step($context, 'BAD TOKEN', Authentication::$TRACE_AUTHENTICATION);
			return null;
		}
		
		// GET SECRET KEY
		$app_secret = Application::getInstance()->getConfig()->getSecurityAuthenticationSecret();
		Trace::value($context, 'app_secret', $app_secret, Authentication::$TRACE_AUTHENTICATION);
		
		// ENCRYPT TOKEN
		$blockCipher = BlockCipher::factory('mcrypt', array('algo' => Authentication::$TOKEN_CRYPT_ALGO));
		$blockCipher->setKey($app_secret);
		$encrypted_token = $blockCipher->encrypt($arg_token);
		$encrypted_token = base64_encode($encrypted_token);
		Trace::value($context, 'encrypted_token', $encrypted_token, Authentication::$TRACE_AUTHENTICATION);
		
		
		return $encrypted_token;
	}
	
	
	/**
	 * @brief		Decrypt the security token if valid
	 * @param[in]	arg_token		token string
	 * @return		string
	 */
	static public function decryptToken($arg_token)
	{
		$context = 'Authentication::decryptToken(token)';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'arg_token', $arg_token, Authentication::$TRACE_AUTHENTICATION);
		
		
		// CHECK TOKEN
		if ( is_null($arg_token) || $arg_token === '' )
		{
			Trace::step($context, 'BAD TOKEN', Authentication::$TRACE_AUTHENTICATION);
			return null;
		}
		
		// GET SECRET KEY
		$app_secret = Application::getInstance()->getConfig()->getSecurityAuthenticationSecret();
		Trace::value($context, 'app_secret', $app_secret, Authentication::$TRACE_AUTHENTICATION);
		
		// DECRYPT TOKEN
		$arg_token = base64_decode($arg_token);
		$blockCipher = BlockCipher::factory('mcrypt', array('algo' => Authentication::$TOKEN_CRYPT_ALGO));
		$blockCipher->setKey($app_secret);
		$decrypted_token = $blockCipher->decrypt($arg_token);
		Trace::value($context, '$decrypted_token', $decrypted_token, Authentication::$TRACE_AUTHENTICATION);
		
		
		return $decrypted_token;
	}
	
	
	/**
	 * @brief		Test if the security token is valid
	 * @return		boolean
	 */
	static public function checkToken()
	{
		$context = 'Authentication::checkToken()';
		Trace::enter($context, '', Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'security_token', Authentication::$security_token, Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'security_login', Authentication::$security_login, Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'security_expiration', Authentication::$security_expiration, Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'security_hash', Authentication::$security_hash, Authentication::$TRACE_AUTHENTICATION);
		
		
		// CHECK TOKEN
		if ( is_null(Authentication::$security_token) || Authentication::$security_token === '' )
		{
			Trace::leave($context, 'BAD TOKEN', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		// CHECK LOGIN
		if ( ! is_string(Authentication::$security_login) || Authentication::$security_login === '' || count(Authentication::$security_login) < 1)
		{
			Trace::leave($context, 'BAD LOGIN', Authentication::$TRACE_AUTHENTICATION);
			return false;
		};
		
		// CHECK HASH
		$app_secret = Application::getInstance()->getConfig()->getSecurityAuthenticationSecret();
		$lib_secret = Authentication::$security_secret;
		$target_hash = sha1((Authentication::$security_expiration).(Authentication::$security_login).$lib_secret.$app_secret);
		if (Authentication::$security_hash !== $target_hash)
		{
			Trace::value($context, 'target_hash', $target_hash, Authentication::$TRACE_AUTHENTICATION);
			Trace::value($context, 'token_hash', Authentication::$security_hash, Authentication::$TRACE_AUTHENTICATION);
			Trace::leave($context, 'BAD HASH', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		// CHECK EXPIRATION
		$now = time();
		$is_expired = Authentication::$security_expiration < $now;
		Trace::value($context, 'now', $now, Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'is_expired', $is_expired, Authentication::$TRACE_AUTHENTICATION);
		
		
		Trace::leave($context, $is_expired ? 'expired token' : 'valid token', Authentication::$TRACE_AUTHENTICATION);
		return ! $is_expired;
	}
	
	
	/**
	 * @brief		Set the security token
	 * @param[in]	arg_token		token string
	 * @return		boolean
	 */
	static public function setToken($arg_token)
	{
		$context = 'Authentication::setToken(token)';
		Trace::enter($context, '', Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'arg_token', $arg_token, Authentication::$TRACE_AUTHENTICATION);
		
		
		// RESET SECURITY ATTRIBUTES
		Authentication::$is_logged = false;
		Authentication::$security_token = null;
		Authentication::$security_login = null;
		Authentication::$security_expiration = null;
		Authentication::$security_hash = null;
		
		// CHECK TOKEN
		if ( is_null($arg_token) || $arg_token === '' )
		{
			Trace::leave($context, 'BAD TOKEN', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		// DECRYPT TOKEN
		$token = Authentication::decryptToken($arg_token);
		Trace::value($context, 'decrypted token', $token, Authentication::$TRACE_AUTHENTICATION);
		
		// CHECK TOKEN FORMAT
		$parts = explode(Authentication::$TOKEN_PARTS_SEPARATOR, $token);
		if ( ! is_array($parts) || count($parts) !== 3 )
		{
			Trace::value($context, 'parts', $parts, Authentication::$TRACE_AUTHENTICATION);
			Trace::leave($context, 'BAD TOKEN FORMAT', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		// SET SECURITY ATTRIBUTES
		Authentication::$security_token = $token;
		Authentication::$security_login = $parts[1];
		Authentication::$security_expiration = $parts[0];
		Authentication::$security_hash = $parts[2];
		
		
		Trace::leave($context, 'TOKEN IS SET', Authentication::$TRACE_AUTHENTICATION);
		return true;
	}
	
	
	
	/**
	 * @brief		Get the hashed value of the given password
	 * @param[in]	arg_password	password string
	 * @return		strings			hashed value
	 */
	static public function hashPassword($arg_password)
	{
		// TODO choose the hash method: md5, sha1...
		return MD5($arg_password);
	}
}

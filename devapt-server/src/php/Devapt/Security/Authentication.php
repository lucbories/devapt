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

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Application\Application as Application;

final class Authentication
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_AUTHENTICATION		= false;
	
	static private $authentication_adapter	= null;
	static private $security_token			= null;
	static private $security_secret			= 'vjzirjz"ç²1fg4f5*$?./635è"&&4<:>nezrinrfgjg';
	static private $is_logged				= false;
	
	
	
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
		if ( Authentication::checkToken(Authentication::$security_token) )
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
		
		// UPDATE STATIC CACHE
		Authentication::$is_logged = false;
		Authentication::$security_token = null;
		
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
		// TODO READ EXPIRATION IN CONFIG
		// 1427115300		PHP time() + 60*60*4
		// 1427115078059	JS Date.now()
		return time() + 60*60*4;
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
		
		// TODO READ SECRET IN CONFIG
		$hash = sha1($arg_expire.Authentication::$security_secret);
		$expire_token = $arg_expire.'******'.$hash;
		
		return $expire_token;
	}
	
	
	/**
	 * @brief		Test if the security token is valid
	 * @param[in]	arg_token		token string
	 * @return		boolean
	 */
	static public function checkToken($arg_token)
	{
		$context = 'Authentication::checkToken(token)';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'arg_token', $arg_token, Authentication::$TRACE_AUTHENTICATION);
		
		
		// CHECK TOKEN
		if ( is_null($arg_token) || $arg_token === '' )
		{
			Trace::step($context, 'BAD TOKEN', Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		
		// GET EXPIRATION AND CHECK TOKEN FORMAT
		$parts = explode('******', $arg_token);
		if ( ! is_array($parts) || count($parts) !== 2 )
		{
			Trace::step($context, 'BAD TOKEN FORMAT', Authentication::$TRACE_AUTHENTICATION);
			Trace::value($context, 'parts', $parts, Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		$expire = $parts[0];
		$now = time();
		Trace::value($context, 'expire', $expire, Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'now', $now, Authentication::$TRACE_AUTHENTICATION);
		
		
		// CHECK HASH
		$target_hash = sha1($expire.Authentication::$security_secret);
		$token_hash = $parts[1];
		if ($token_hash !== $target_hash)
		{
			Trace::step($context, 'BAD HASH', Authentication::$TRACE_AUTHENTICATION);
			Trace::value($context, 'target_hash', $target_hash, Authentication::$TRACE_AUTHENTICATION);
			Trace::value($context, 'token_hash', $token_hash, Authentication::$TRACE_AUTHENTICATION);
			return false;
		}
		
		
		// CHECK EXPIRATION
		$is_expired = $expire < $now;
		Trace::value($context, 'is_expired', $is_expired, Authentication::$TRACE_AUTHENTICATION);
		return ! $is_expired;
	}
	
	
	/**
	 * @brief		Set the security token
	 * @param[in]	arg_token		token string
	 * @return		nothing
	 */
	static public function setToken($arg_token)
	{
		$context = 'Authentication::setToken(token)';
		Trace::step($context, '', Authentication::$TRACE_AUTHENTICATION);
		Trace::value($context, 'arg_token', $arg_token, Authentication::$TRACE_AUTHENTICATION);
		
		Authentication::$security_token = $arg_token;
	}
	
	
	
	/**
	 * @brief		Get the hashed value of the given password
	 * @param[in]	arg_password	password string
	 * @return		strings			hashed value
	 */
	static public function hashPassword($arg_password)
	{
		return MD5($arg_password);
	}
}

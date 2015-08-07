<?php
/**
 * @file        DbConnexions.php
 * @brief       Load and manage database connexions
 * @details     A connexion has a name and some attributes : db driver, db host, db port, db name, db user, db password, db options
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

use Zend\Config\Reader\Ini AS IniReader;
use Zend\Debug\Debug;

final class DbConnexions
{
	// STATIC ATTRIBUTES
	static private $db_connexions_array			= null;
	static private $db_connexions_config		= null;
	static private $attributes_list				= array('engine', 'host', 'port', 'database_name', 'user_name', 'user_pwd', 'options', 'charset');
	static private $attributes_required_list	= array('engine', 'host', 'port', 'database_name', 'user_name', 'user_pwd');
	
	
	
	/**
	 * @brief		Empty private constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Load connexions from an Ini file
	 * @return		boolean
	 */
	static public function loadConnexionsFromIniFile($arg_file_path_name)
	{
		// CHECK FILE PATH NAME
		if ( is_null($arg_file_path_name) || ! file_exists($arg_file_path_name) || ! is_readable($arg_file_path_name) )
		{
			Debug::dump("bad file path name [$arg_file_path_name]");
			return false;
		}
		
		// LOAD INI FILE
		$reader = new IniReader();
		$reader->setNestSeparator('.');
		DbConnexions::$db_connexions_array = $reader->fromFile($arg_file_path_name);
		// Debug::dump(DbConnexions::$db_connexions_array);
		
		// CHECK CONNEXIONS
		foreach(DbConnexions::$db_connexions_array as $name => $record)
		{
			$checked_record = DbConnexions::getCheckedConnexionRecord($record);
			// Debug::dump($checked_record);
			if ( is_null($checked_record) )
			{
				unset( DbConnexions::$db_connexions_array[$name] );
			}
			else
			{
				DbConnexions::$db_connexions_array[$name] = $checked_record;
			}
		}
		
		// Debug::dump(DbConnexions::$db_connexions_array);
		
		return true;
	}
	
	
	
	/**
	 * @brief		Get a checked a connexion record
	 * @param[in]	arg_connexion_record	connexion record
	 * @return		array
	 */
	static public function getCheckedConnexionRecord($arg_connexion_record)
	{
		// CHECK ARGS
		if ( ! is_array($arg_connexion_record) )
		{
			Debug::dump('bad connexion record');
			return null;
		}
		
		// LOOP ON ATTRIBUTES
		foreach($arg_connexion_record as $key => $value)
		{
			// TEST KEY AND VALUE
			if ( ! is_string($value) || ! is_string($key) )
			{
				Debug::dump("bad key [$key] or bad value [$value]");
				unset( $arg_connexion_record[$key] );
				continue;
			}
			
			// CHECK ATTRIBUTE NAME
			if ( ! in_array($key, DbConnexions::$attributes_list) )
			{
				Debug::dump("bad key [$key]");
				unset( $arg_connexion_record[$key] );
				continue;
			}
		}
		
		// CHECK REQUIRED ATTRIBUTES
		foreach(DbConnexions::$attributes_required_list as $value)
		{
			if ( ! array_key_exists($value, $arg_connexion_record) )
			{
				Debug::dump("no required attribute [$value]");
				return null;
			}
		}
		
		return $arg_connexion_record;
	}
	
	
	
	/**
	 * @brief		Test if at least one connexion exists
	 * @return		boolean
	 */
	static public function hasConnexions()
	{
		return is_array(DbConnexions::$db_connexions_array) && count(DbConnexions::$db_connexions_array) > 0;
	}
	
	
	
	/**
	 * @brief		Test if a connexion exists with the given name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		boolean
	 */
	static public function hasConnexion($arg_connexion_name)
	{
		return DbConnexions::hasConnexions() && array_key_exists($arg_connexion_name, DbConnexions::$db_connexions_array);
	}
	
	
	
	/**
	 * @brief		Get a connexion record with the given name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		array|null
	 */
	static public function getConnexionRecord($arg_connexion_name)
	{
		if ( ! DbConnexions::hasConnexion($arg_connexion_name) )
		{
			return null;
		}
		
		return DbConnexions::$db_connexions_array[$arg_connexion_name];
	}
	
	
	
	/**
	 * @brief		Get a connexion attribute with the given connexion name and the given attribute name
	 * @param[in]	arg_connexion_name	connexion name
	 * @param[in]	arg_attribute_name	attribute name
	 * @return		string|null
	 */
	static public function getConnexionAttribute($arg_connexion_name, $arg_attribute_name, $arg_default_value = null)
	{
		$connexion_record = DbConnexions::getConnexionRecord($arg_connexion_name);
		
		if ( in_array($arg_attribute_name, DbConnexions::$attributes_list) && is_array($connexion_record) )
		{
			if ( array_key_exists($arg_attribute_name, $connexion_record) )
			{
				return $connexion_record[$arg_attribute_name];
			}
		}
		
		return $arg_default_value;
	}
	
	
	
	/**
	 * @brief		Get a connexion driver with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionDriver($arg_connexion_name)
	{
		return DbConnexions::getConnexionAttribute($arg_connexion_name, 'engine', null);
	}
	
	
	
	/**
	 * @brief		Get a connexion hostname with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionHostname($arg_connexion_name)
	{
		return DbConnexions::getConnexionAttribute($arg_connexion_name, 'hostname', null);
	}
	
	
	
	/**
	 * @brief		Get a connexion port with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionPort($arg_connexion_name)
	{
		return DbConnexions::getConnexionAttribute($arg_connexion_name, 'port', null);
	}
	
	
	
	/**
	 * @brief		Get a connexion database name with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionDatabase($arg_connexion_name)
	{
		return DbConnexions::getConnexionAttribute($arg_connexion_name, 'database_name', null);
	}
	
	
	
	/**
	 * @brief		Get a connexion user name with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionUser($arg_connexion_name)
	{
		return DbConnexions::getConnexionAttribute($arg_connexion_name, 'user_name', null);
	}
	
	
	
	/**
	 * @brief		Get a connexion user password with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionPassword($arg_connexion_name)
	{
		return DbConnexions::getConnexionAttribute($arg_connexion_name, 'user_pwd', null);
	}
	
	
	
	/**
	 * @brief		Get a connexion engine options with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionOptions($arg_connexion_name)
	{
		$value = DbConnexions::getConnexionAttribute($arg_connexion_name, 'options', null);
		
		if ( is_string($value) )
		{
			$records = explode('|', $value);
			$value = array();
			foreach($records as $record_str)
			{
				$record = explode('=', $record_str);
				if ( is_array($record) & count($record) === 2 && is_string($record[0]))
				{
					$record_key = $record[0];
					$record_value = $record[1];
					$value[$record_key] = $record_value;
				}
			}
		}
		
		return $value;
	}
	
	
	
	/**
	 * @brief		Get a connexion charset with the given connexion name
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		string|null
	 */
	static public function getConnexionCharset($arg_connexion_name, $arg_default_value)
	{
		return DbConnexions::getConnexionAttribute($arg_connexion_name, 'charset', $arg_default_value);
	}
}

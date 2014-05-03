<?php
/**
 * @file        Broker.php
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

namespace Devapt\Resources;

use Zend\Config\Reader\Ini AS IniReader;
use Zend\Debug\Debug;
use Devapt\Core\Trace;

use Zend\Json\Json as JsonFormatter;

final class Broker
{
	// STATIC ATTRIBUTES
	static private $resources_objects_array		= array();
	static private $resources_records_array		= array();
	static private $resources_files_array		= array();
	static private $loaded_files				= array();
	
	static private $resources_collection		= array('menubars'=>'menubar', 'menus'=>'menu', 'views'=>'view', 'models'=>'model');
	static private $attributes_required_list	= array('name', 'class_type');
	
	
	
	/**
	 * @brief		Empty private constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Test if a resource object exists with a given name
	 * @param[in]	arg_resource_name	resource name
	 * @return		boolean
	 */
	static public function hasResourceObject($arg_resource_name)
	{
		// A RESOURCE OBJECT IS CACHED
		if ( array_key_exists($arg_resource_name, Broker::$resources_objects_array) )
		{
			return true;
		}
		
		// A RESOURCE RECORD IS CACHED
		if ( array_key_exists($arg_resource_name, Broker::$resources_records_array) )
		{
			$resource_record	= Broker::$resources_records_array[$arg_resource_name];
			$resource_object	= Broker::buildResourceObjectFromRecord($resource_record);
			return ! is_null($resource_object);
		}
		
		// SEARCH RESOURCE IN NOT LOADED PROVIDERS
		if ( Broker::searchResource($arg_resource_name) )
		{
			$resource_object	= Broker::$resources_objects_array[$arg_resource_name];
			return ! is_null($resource_object);
		}
		
		return false;
	}
	
	
	
	/**
	 * @brief		Get a resource object with a given name
	 * @param[in]	arg_resource_name	resource name
	 * @return		object|null
	 */
	static public function getResourceObject($arg_resource_name)
	{
		// A RESOURCE OBJECT IS CACHED
		if ( Broker::hasResourceObject($arg_resource_name) )
		{
			return Broker::$resources_objects_array[$arg_resource_name];
		}
		
		return null;
	}
	
	
	
	/**
	 * @brief		Get a resource JSON declaration with a given name
	 * @param[in]	arg_resource_name	resource name
	 * @return		string|null
	 */
	static public function getResourceJson($arg_resource_name)
	{
		// A RESOURCE OBJECT IS CACHED
		if ( ! Broker::hasResourceObject($arg_resource_name) )
		{
			Trace::warning("Resources\Broker.getResourceJson: resource not found [$arg_resource_name]");
			return null;
		}
		
		// GET RESOURCE RECORDS
		$resource_record = Broker::$resources_records_array[$arg_resource_name];
		
		// SANITIZE RECORDS
		$resource_type = $resource_record['class_type'];
		switch($resource_type)
		{
			// case 'view': // TODO
			// case 'model':
			// case 'menu':
			case 'connexion':
				Trace::warning("Resources\Broker.getResourceJson: requested resource is a connexion [$arg_resource_name]");
				return null;
		}
		
		// FORMAT JSON STRING
		$jsonOptions = null;
		$json_str = JsonFormatter::encode($resource_record, null, $jsonOptions);
		
		return $json_str;
	}
	
	
	
	/**
	 * @brief		Search a resource with a given name
	 * @param[in]	arg_resource_name	resource name
	 * @return		boolean
	 */
	static public function searchResource($arg_resource_name)
	{
		// Debug::dump( Broker::$resources_files_array );
		foreach(Broker::$resources_files_array as $file_path_name)
		{
			// CHECK IF LOADED
			if ( array_key_exists($file_path_name, Broker::$loaded_files ) )
			{
				continue;
			}
			
			// Debug::dump('LOAD A RESOURCE FILE:'.$file_path_name );
			
			// LOAD A RESOURCE FILE
			if ( ! Broker::loadResourcesFile($file_path_name) )
			{
				Trace::warning("Resources\Broker.searchResource: resource file [$file_path_name] loading failed.");
				continue;
			}
			
			// A RESOURCE OBJECT IS CACHED
			if ( array_key_exists($arg_resource_name, Broker::$resources_objects_array) )
			{
				// Debug::dump('A RESOURCE OBJECT IS CACHED:'.$arg_resource_name );
				return true;
			}
			
			// A RESOURCE RECORD IS CACHED
			if ( array_key_exists($arg_resource_name, Broker::$resources_records_array) )
			{
				// Debug::dump('A RESOURCE RECORD IS CACHED:'.$arg_resource_name );
				$resource_record	= Broker::$resources_records_array[$arg_resource_name];
				$resource_object	= Broker::buildResourceObjectFromRecord($resource_record);
				return ! is_null($resource_object) && array_key_exists($arg_resource_name, Broker::$resources_objects_array);
			}
		}
		
		// Debug::dump(Broker::$resources_records_array);
		Trace::warning("Resources\Broker.searchResource: resource [$arg_resource_name] not found");
		return false;
	}
	
	
	
	/**
	 * @brief		Add a search file for resources
	 * @param[in]	arg_file_path_name	file path name
	 * @return		boolean
	 */
	static public function addSearchFile($arg_file_path_name)
	{
		if ( is_null($arg_file_path_name) || ! file_exists($arg_file_path_name) || ! is_readable($arg_file_path_name) )
		{
			Debug::dump("Resources\Broker.addSearchFile: bad file path name [$arg_file_path_name]");
			return false;
		}
		
		Broker::$resources_files_array[] = $arg_file_path_name;
		return true;
	}
	
	
	
	/**
	 * @brief		Load connexions from an Ini file
	 * @param[in]	arg_file_path_name	file path name
	 * @return		boolean
	 */
	static public function loadResourcesFile($arg_file_path_name)
	{
		// Debug::dump("Resources\Broker.loadResourcesFile: load file path name [$arg_file_path_name]");
		
		// CHECK FILE PATH NAME
		if ( is_null($arg_file_path_name) || ! file_exists($arg_file_path_name) || ! is_readable($arg_file_path_name) )
		{
			Debug::dump("Resources\Broker.loadResourcesFile: bad file path name [$arg_file_path_name]");
			return false;
		}
		
		// CHECK IF LOADED
		if ( array_key_exists($arg_file_path_name, Broker::$loaded_files ) )
		{
			Debug::dump("Resources\Broker.loadResourcesFile: file already loaded [$arg_file_path_name]");
			return true;
		}
		
		// GET FILE TYPE
		$file_parts = explode('.', $arg_file_path_name);
		if ( ! is_array($file_parts) || count($file_parts) < 2)
		{
			Debug::dump("Resources\Broker.loadResourcesFile: bad file type for [$arg_file_path_name]");
			return false;
		}
		$file_extension = array_pop($file_parts);
		
		// CALL FILE TYPE LOADER
		switch($file_extension)
		{
			case 'ini': return Broker::loadResourcesIniFile($arg_file_path_name);
		}
		
		Debug::dump("Resources\Broker.loadResourcesFile: bad file extension for [$arg_file_path_name]");
		return false;
	}
	
	
	
	/**
	 * @brief		Load resource from an Ini file
	 * @param[in]	arg_file_path_name	file path name
	 * @return		boolean
	 */
	static public function loadResourcesIniFile($arg_file_path_name)
	{
		// CHECK FILE PATH NAME
		if ( is_null($arg_file_path_name) || ! file_exists($arg_file_path_name) || ! is_readable($arg_file_path_name) )
		{
			Debug::dump("Resources\Broker.loadResourcesIniFile: bad file path name [$arg_file_path_name]");
			return false;
		}
		
		
		// LOAD INI FILE
		$reader = new IniReader();
		$reader->setNestSeparator('.');
		$records_array = $reader->fromFile($arg_file_path_name);
		// Debug::dump($records_array);
		
		if ( ! self::loadResourcesRecords($records_array) )
		{
			Debug::dump("Resources\Broker.loadResourcesIniFile: bad file content [$arg_file_path_name]");
			return false;
		}
		
		Broker::$loaded_files[$arg_file_path_name] = 'loaded';
		return true;
	}
	
	
	
	/**
	 * @brief		Load resource from an array of records
	 * @param[in]	arg_records		array
	 * @return		boolean
	 */
	static public function loadResourcesRecords($arg_records)
	{
		// CHECK ARRAY
		if ( ! is_array($arg_records) || count($arg_records) === 0 )
		{
			Debug::dump("Resources\Broker.loadResourcesRecords: bad records array");
			return false;
		}
		
		// TODO
		
		// PROCESS application.menusbars.xxx, application.views.xxx, etc
		$application_resources_collection = array();
		if ( is_array($arg_records) && array_key_exists('application', $arg_records) )
		{
			Trace::debug('Broker::loadResourcesIniFile: an application collection exists');
			$app_resources = $arg_records['application'];
			foreach($app_resources as $resource_collection_name => $resource_collection_record)
			{
				Trace::debug('Broker::loadResourcesIniFile: a collection exists [' . $resource_collection_name . ']');
				$application_resources_collection[$resource_collection_name] = $resource_collection_record;
			}
			unset($arg_records['application']);
		}
		// Debug::dump($arg_records);
		// Debug::dump($application_resources_collection);
		
		
		// PROCESS menubars.xxx, views.xxx, etc
		if ( is_array($application_resources_collection) && count($application_resources_collection) > 0 )
		{
			$config = new \Devapt\Core\Configuration($application_resources_collection);
			foreach(self::$resources_collection as $resource_collection_name => $resource_type)
			{
				$collection = $config->getAttributesCollection($resource_collection_name);
				if ( is_array($collection) )
				{
					foreach($collection as $resource_name => $resource_record)
					{
						Trace::debug('Resources\Broker.loadResourcesIniFile: add collection item resource_name['.$resource_name.']');
						$resource_record['name'] = $resource_name;
						$resource_record['class_type'] = $resource_type;
						$checked_record = Broker::getCheckedResourceRecord($resource_record);
						if ( ! is_null($checked_record) )
						{
							Broker::registerResourceRecord($checked_record);
						}
					}
				}
			}
		}
		// Debug::dump(Broker::$resources_records_array);
		
		
		// CHECK RECORDS
		if ( is_array($arg_records) && count($arg_records) > 0 )
		{
			foreach($arg_records as $key => $record)
			{
				$record['name'] = $key;
				$checked_record = Broker::getCheckedResourceRecord($record);
				// Debug::dump($checked_record);
				if ( ! is_null($checked_record) )
				{
					Broker::registerResourceRecord($checked_record);
				}
			}
		}
		
		
		
		return true;
	}
	
	
	
	/**
	 * @brief		Register a checked resource record
	 * @param[in]	arg_resource_record	resource record
	 * @return		array
	 */
	static public function registerResourceRecord($arg_resource_record)
	{
		$name = $arg_resource_record['name'];
		
		Broker::$resources_records_array[$name] = $arg_resource_record;
		
		$get_action = \Devapt\Application\ResourceController::$RESOURCES_ACTION_GET;
		
		$access = null;
		
		if ( array_key_exists(AbstractResource::$RESOURCE_ACCESS, $arg_resource_record) )
		{
			$access = $arg_resource_record[AbstractResource::$RESOURCE_ACCESS];
		}
		
		if ( array_key_exists(View::$VIEW_ACCESS_ROLE, $arg_resource_record) )
		{
			$access = $arg_resource_record[View::$VIEW_ACCESS_ROLE];
		}
		
		if ( array_key_exists(Model::$MODEL_ACCESS_ROLE_READ, $arg_resource_record) )
		{
			$access = $arg_resource_record[Model::$MODEL_ACCESS_ROLE_READ];
		}
		
		if ( ! is_null($access) )
		{
			\Devapt\Security\Authorization::registerRoleAccess($name, $get_action, $access);
		}
	}
	
	
	
	/**
	 * @brief		Get a checked a resource record
	 * @param[in]	arg_resource_record	resource record
	 * @return		array
	 */
	static public function getCheckedResourceRecord($arg_resource_record)
	{
		// CHECK ARGS
		if ( ! is_array($arg_resource_record) )
		{
			Debug::dump('Resources\Broker.getCheckedResourceRecord: bad resource record');
			return null;
		}
		
		// CHECK RESOURCE TO CLONE
		if ( array_key_exists('resource_to_clone', $arg_resource_record) )
		{
			// CHECK RESOURCE TO CLONE
			$resource_to_clone_name = $arg_resource_record['resource_to_clone'];
			if ( ! array_key_exists($resource_to_clone_name, $resources_records_array) )
			{
				return null;
			}
			unset( $arg_resource_record['resource_to_clone'] );
			
			// GET RESOURCE TO CLONE
			$resource_to_clone_record = $resources_records_array[$resource_to_clone_name];
			
			// CLONE OPTIONS
			$clone_record = array();
			foreach($resource_to_clone_record as $key=>$value)
			{
				if ( array_key_exists($key, $arg_resource_record) )
				{
					$clone_record[$key] = $arg_resource_record[$key];
				}
				else
				{
					$clone_record[$key] = $value;
				}
			}
			
			$arg_resource_record = $clone_record;
		}
		
		// CHECK REQUIRED ARGS
		foreach(Broker::$attributes_required_list as $attribute_name)
		{
			if ( ! array_key_exists($attribute_name, $arg_resource_record) )
			{
				return null;
			}
		}
		
		return $arg_resource_record;
	}
	
	
	
	/**
	 * @brief		Build a resource object from a resource record
	 * @param[in]	arg_resource_record	resource record
	 * @return		object|null
	 */
	static public function buildResourceObjectFromRecord($arg_resource_record)
	{
		// CHECK ARGS
		if ( ! is_array($arg_resource_record) )
		{
			Debug::dump('Resources\Broker.buildResourceObjectFromRecord: bad resource record');
			return null;
		}
		
		// GET RESOURCE NAME
		$name = $arg_resource_record['name'];
		
		// GET RESOURCE TYPE
		$type = $arg_resource_record['class_type'];
		// Debug::dump('type:'.$type);
		switch($type)
		{
			case 'view':
			{
				// Debug::dump('Resources\Broker.buildResourceObjectFromRecord: view ['.$name.']');
				
				// CHECK REQUIRED ARGS
				foreach(View::$attributes_required_list as $attribute_name)
				{
					if ( ! array_key_exists($attribute_name, $arg_resource_record) )
					{
						Debug::dump('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
						return null;
					}
				}
				$resource_object	= new View($arg_resource_record);
				$resource_name		= $resource_object->getResourceName();
				Broker::$resources_objects_array[$resource_name] = $resource_object;
				return $resource_object;
			}
			
			case 'menubar':
			{
				// Debug::dump('Resources\Broker.buildResourceObjectFromRecord: menubar ['.$name.']');
				
				// CHECK REQUIRED ARGS
				foreach(Menubar::$attributes_required_list as $attribute_name)
				{
					if ( ! array_key_exists($attribute_name, $arg_resource_record) )
					{
						Debug::dump('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
						return null;
					}
				}
				$resource_object	= new Menubar($arg_resource_record);
				$resource_name		= $resource_object->getResourceName();
				Broker::$resources_objects_array[$resource_name] = $resource_object;
				return $resource_object;
			}
			
			case 'menu':
			{
				// Debug::dump('Resources\Broker.buildResourceObjectFromRecord: menu ['.$name.']');
				
				// CHECK REQUIRED ARGS
				foreach(Menu::$attributes_required_list as $attribute_name)
				{
					if ( ! array_key_exists($attribute_name, $arg_resource_record) )
					{
						Debug::dump('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
						return null;
					}
				}
				$resource_object	= new Menu($arg_resource_record);
				$resource_name		= $resource_object->getResourceName();
				Broker::$resources_objects_array[$resource_name] = $resource_object;
				return $resource_object;
			}
			
			case 'model':
			{
				// Debug::dump('Resources\Broker.buildResourceObjectFromRecord: model ['.$name.']');
				
				// CHECK REQUIRED ARGS
				foreach(Model::$attributes_required_list as $attribute_name)
				{
					if ( ! array_key_exists($attribute_name, $arg_resource_record) )
					{
						Debug::dump('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
						return null;
					}
				}
				// print_r('-----------------BROKER::build---------------');
				// print_r($arg_resource_record);
				$resource_object	= new Model($arg_resource_record);
				$resource_name		= $resource_object->getResourceName();
				Broker::$resources_objects_array[$resource_name] = $resource_object;
				return $resource_object;
			}
		}
		
		return false;
	}
}

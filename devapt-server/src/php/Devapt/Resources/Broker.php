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

// ZEND IMPORTS
use Zend\Debug\Debug;
use Zend\Config\Reader\Ini AS IniReader;
use Zend\Json\Json as JsonFormatter;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Application\Application;


final class Broker
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_BROKER					= false;
	
	/// @brief NOT FOUND FLAG
	static public $RESOURCE_NOT_FOUND			= 'resource not found';
	
	
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
		$context = 'Broker::hasResourceObject('.$arg_resource_name. ')';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		// A RESOURCE OBJECT IS CACHED
		if ( array_key_exists($arg_resource_name, Broker::$resources_objects_array) )
		{
			Trace::leave($context, 'resource object found in cache', Broker::$TRACE_BROKER);
			return true;
		}
		
		// A RESOURCE RECORD IS CACHED
		if ( array_key_exists($arg_resource_name, Broker::$resources_records_array) )
		{
			$resource_record	= Broker::$resources_records_array[$arg_resource_name];
			$resource_object	= Broker::buildResourceObjectFromRecord($resource_record);
			
			Trace::leave($context, 'resource record found in cache', Broker::$TRACE_BROKER);
			return ! is_null($resource_object);
		}
		
		// SEARCH RESOURCE IN NOT LOADED PROVIDERS
		if ( Broker::searchResource($arg_resource_name) )
		{
			$resource_object	= Broker::$resources_objects_array[$arg_resource_name];
			
			Trace::leave($context, 'resource found in not loaded providers', Broker::$TRACE_BROKER);
			return ! is_null($resource_object);
		}
		
		return Trace::leaveko($context, '', false, Broker::$TRACE_BROKER);
	}
	
	
	
	/**
	 * @brief		Get a resource object with a given name
	 * @param[in]	arg_resource_name	resource name
	 * @return		object|null
	 */
	static public function getResourceObject($arg_resource_name)
	{
		$context = 'Broker::getResourceObject('.$arg_resource_name. ')';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		// A RESOURCE OBJECT IS CACHED
		if ( Broker::hasResourceObject($arg_resource_name) )
		{
			$resource = Broker::$resources_objects_array[$arg_resource_name];
			return Trace::leaveok($context, 'resource object found in cache', $resource, Broker::$TRACE_BROKER);
		}
		
		return Trace::leaveko($context, '', null, Broker::$TRACE_BROKER);
	}
	
	
	
	/**
	 * @brief		Get a resource JSON declaration with a given name
	 * @param[in]	arg_resource_name	resource name
	 * @return		string|null
	 */
	static public function getResourceJson($arg_resource_name)
	{
		$context = 'Broker::getResourceJson('.$arg_resource_name. ')';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		if ($arg_resource_name === 'application' )
		{
			$resource_record = \Devapt\Application\Application::getInstance()->getConfig()->getAttributesCollection('application');
			$resource_record['connexions'] = "no access";
			$resource_record['security']['autologin'] = "no access";
			
			// FORMAT JSON STRING
			$jsonOptions = null;
			$json_str = JsonFormatter::encode($resource_record, null, $jsonOptions);
			
			return Trace::leaveok($context, 'application.*', $json_str, Broker::$TRACE_BROKER);
		}
		
		// A RESOURCE OBJECT IS CACHED
		if ( ! Broker::hasResourceObject($arg_resource_name) )
		{
			Trace::warning("Resources\Broker.getResourceJson: resource not found [$arg_resource_name]");
			
			return Trace::leaveok($context, 'resource not found', self::$RESOURCE_NOT_FOUND, Broker::$TRACE_BROKER);
		}
		
		// GET RESOURCE RECORDS
		$resource_record = Broker::$resources_records_array[$arg_resource_name];
		
		// LOAD TEMPLATE FILE INTO TEMPLATE STRING FOR JS VIEWS
		$TEMPLATE_FILE_KEY = View::$OPTION_TEMPLATE_FILE_NAME;
		$TEMPLATE_STR_KEY = View::$OPTION_TEMPLATE_STRING;
		if ( array_key_exists($TEMPLATE_FILE_KEY, $resource_record) )
		{
			Trace::step($context, 'resource record has ['.$TEMPLATE_FILE_KEY.']', Broker::$TRACE_BROKER);
			$file_path_name = $resource_record[$TEMPLATE_FILE_KEY];
			
			$app_file_path_name = Application::getInstance()->searchResourceFile($file_path_name);
			
			// PROCESS FILE
			if ( file_exists($app_file_path_name) && is_readable($app_file_path_name) )
			{
				// HTML TEMPLATE FILE
				$html_suffix = "html.template";
				$file_suffix = substr($app_file_path_name, - strlen($html_suffix));
				if ($file_suffix === $html_suffix)
				{
					// OPEN FILE
					$handle = @fopen($app_file_path_name, "r");
					if ($handle)
					{
						// READ FILE
						$content = '';
						while ( ($buffer = fgets($handle, 4096)) !== false)
						{
							$content .= $buffer;
						}
						if ( feof($handle) )
						{
							$resource_record[$TEMPLATE_STR_KEY] = $content;
						}
						
						// CLOSE FILE
						fclose($handle);
					}
				}
			}
		}
		
		// SANITIZE RECORDS
		$resource_type = $resource_record['class_type'];
		switch($resource_type)
		{
			// case 'view': // TODO
			// case 'model':
			
			case 'menubar':
			{
				$menubar_object = Broker::getResourceObject($arg_resource_name);
				if ( ! is_object($menubar_object) )
				{
					Trace::warning("Resources\Broker.getResourceJson: resource object not found [$arg_resource_name]");
					return null;
				}
				$menubar_items = $menubar_object->getMenubarAllItemsNames();
				
				if ( is_string($menubar_items) )
				{
					$menubar_items = explode(',', $menubar_items);
				}
				
				if ( is_array($menubar_items) && count($menubar_items) > 0 )
				{
					$resource_record['items'] = $menubar_object->getMenubarItemsNames();
					$resource_record['items_resources'] = array();
					foreach($menubar_items as $menu_resource_name)
					{
						if ( ! Broker::hasResourceObject($menu_resource_name) )
						{
							Trace::warning("Resources\Broker.getResourceJson: resource not found [$menu_resource_name] for menu bar items [$arg_resource_name]");
							return null;
						}
						$resource_record['items_resources'][$menu_resource_name] = Broker::$resources_records_array[$menu_resource_name];
						// TODO ADD SUB MENUS
					}
				}
				else
				{
					Trace::warning("Resources\Broker.getResourceJson: requested menubar resource has no items [$arg_resource_name]");
				}
				// Debug::dump($resource_record['items_resources']);
				break;
			}
			
			case 'connexion':
			{
				Trace::warning("Resources\Broker.getResourceJson: requested resource is a connexion [$arg_resource_name]");
				return null;
			}
		}
		
		// FORMAT JSON STRING
		$jsonOptions = null;
		$json_str = JsonFormatter::encode($resource_record, null, $jsonOptions);
		
		return Trace::leaveok($context, '', $json_str, Broker::$TRACE_BROKER);
	}
	
	
	
	/**
	 * @brief		Search a resource with a given name
	 * @param[in]	arg_resource_name	resource name
	 * @return		boolean
	 */
	static public function searchResource($arg_resource_name)
	{
		$context = 'Broker::searchResource('.$arg_resource_name.')';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		
		// APPLICATION
		if ($arg_resource_name === 'application')
		{
			return Trace::leaveok($context, 'resource "application"', true, Broker::$TRACE_BROKER);
		}
		
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
				return Trace::leaveok($context, 'resource object found in cache', true, Broker::$TRACE_BROKER);
			}
			
			// A RESOURCE RECORD IS CACHED
			if ( array_key_exists($arg_resource_name, Broker::$resources_records_array) )
			{
				// Debug::dump('A RESOURCE RECORD IS CACHED:'.$arg_resource_name );
				$resource_record	= Broker::$resources_records_array[$arg_resource_name];
				$resource_object	= Broker::buildResourceObjectFromRecord($resource_record);
				$result = ! is_null($resource_object) && array_key_exists($arg_resource_name, Broker::$resources_objects_array);
				Trace::leave($context, 'resource record found in cache ?', Broker::$TRACE_BROKER);
				return $result;
			}
		}
		
		// Debug::dump(Broker::$resources_records_array);
		Trace::warning("Resources\Broker.searchResource: resource [$arg_resource_name] not found");
		Trace::leaveko($context, 'resource not found', false, Broker::$TRACE_BROKER);
	}
	
	
	
	/**
	 * @brief		Add a search file for resources
	 * @param[in]	arg_file_path_name	file path name
	 * @return		boolean
	 */
	static public function addSearchFile($arg_file_path_name)
	{
		$context = 'Broker::addSearchFile('.$arg_file_path_name. ')';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		if ( is_null($arg_file_path_name) || ! file_exists($arg_file_path_name) || ! is_readable($arg_file_path_name) )
		{
			// Debug::dump("Resources\Broker.addSearchFile: bad file path name [$arg_file_path_name]");
			return Trace::leaveko($context, 'bad file path name', false, Broker::$TRACE_BROKER);
		}
		
		Broker::$resources_files_array[] = $arg_file_path_name;
		return Trace::leaveok($context, '', true, Broker::$TRACE_BROKER);
	}
	
	
	
	/**
	 * @brief		Load connexions from an Ini file
	 * @param[in]	arg_file_path_name	file path name
	 * @return		boolean
	 */
	static public function loadResourcesFile($arg_file_path_name)
	{
		$context = 'Broker::loadResourcesFile('.$arg_file_path_name. ')';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		// Debug::dump("Resources\Broker.loadResourcesFile: load file path name [$arg_file_path_name]");
		
		// CHECK FILE PATH NAME
		if ( is_null($arg_file_path_name) || ! file_exists($arg_file_path_name) || ! is_readable($arg_file_path_name) )
		{
			// Debug::dump("Resources\Broker.loadResourcesFile: bad file path name [$arg_file_path_name]");
			return Trace::leaveko($context, 'bad file path name', false, Broker::$TRACE_BROKER);
		}
		
		// CHECK IF LOADED
		if ( array_key_exists($arg_file_path_name, Broker::$loaded_files ) )
		{
			// Debug::dump("Resources\Broker.loadResourcesFile: file already loaded [$arg_file_path_name]");
			return Trace::leaveok($context, '', true, Broker::$TRACE_BROKER);
		}
		
		// GET FILE TYPE
		$file_parts = explode('.', $arg_file_path_name);
		if ( ! is_array($file_parts) || count($file_parts) < 2)
		{
			// Debug::dump("Resources\Broker.loadResourcesFile: bad file type for [$arg_file_path_name]");
			return Trace::leaveko($context, 'bad file path name', false, Broker::$TRACE_BROKER);
		}
		$file_extension = array_pop($file_parts);
		
		// CALL FILE TYPE LOADER
		switch($file_extension)
		{
			case 'ini': return Trace::leaveok($context, '', Broker::loadResourcesIniFile($arg_file_path_name), Broker::$TRACE_BROKER);
		}
		
		// Debug::dump("Resources\Broker.loadResourcesFile: bad file extension for [$arg_file_path_name]");
		return Trace::leaveko($context, 'bad file extension', false, Broker::$TRACE_BROKER);
	}
	
	
	
	/**
	 * @brief		Load resource from an Ini file
	 * @param[in]	arg_file_path_name	file path name
	 * @return		boolean
	 */
	static public function loadResourcesIniFile($arg_file_path_name)
	{
		$context = 'Broker::loadResourcesIniFile('.$arg_file_path_name. ')';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		// CHECK FILE PATH NAME
		if ( is_null($arg_file_path_name) || ! file_exists($arg_file_path_name) || ! is_readable($arg_file_path_name) )
		{
			// Debug::dump("Resources\Broker.loadResourcesIniFile: bad file path name [$arg_file_path_name]");
			return Trace::leaveko($context, 'bad file path name', false, Broker::$TRACE_BROKER);
		}
		
		
		// LOAD INI FILE
		$reader = new IniReader();
		$reader->setNestSeparator('.');
		$records_array = $reader->fromFile($arg_file_path_name);
		// Debug::dump($records_array);
		
		if ( ! self::loadResourcesRecords($records_array) )
		{
			// Debug::dump("Resources\Broker.loadResourcesIniFile: bad file content [$arg_file_path_name]");
			return Trace::leaveko($context, 'bad file content', false, Broker::$TRACE_BROKER);
		}
		
		Broker::$loaded_files[$arg_file_path_name] = 'loaded';
		return Trace::leaveok($context, '', true, Broker::$TRACE_BROKER);
	}
	
	
	
	/**
	 * @brief		Load resource from an array of records
	 * @param[in]	arg_records		array
	 * @return		boolean
	 */
	static public function loadResourcesRecords($arg_records)
	{
		$context = 'Broker::loadResourcesRecords(records)';
		Trace::enter($context, '', Broker::$TRACE_BROKER);
		
		// CHECK ARRAY
		if ( ! is_array($arg_records) || count($arg_records) === 0 )
		{
			// Debug::dump("Resources\Broker.loadResourcesRecords: bad records array");
			return false;
		}
		
		// TODO
		
		// PROCESS application.menusbars.xxx, application.views.xxx, etc
		$application_resources_collection = array();
		if ( is_array($arg_records) && array_key_exists('application', $arg_records) )
		{
			Trace::step($context, 'an application collection exists', Broker::$TRACE_BROKER);
			$app_resources = $arg_records['application'];
			foreach($app_resources as $resource_collection_name => $resource_collection_record)
			{
				Trace::step($context, 'a collection exists [' . $resource_collection_name . ']', Broker::$TRACE_BROKER);
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
						Trace::step($context, 'add collection item resource_name['.$resource_name.']', Broker::$TRACE_BROKER);
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
		
		
		return Trace::leaveok($context, '', true, Broker::$TRACE_BROKER);
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
		
		else if ( array_key_exists(View::$VIEW_ACCESS_ROLE, $arg_resource_record) )
		{
			$access = $arg_resource_record[View::$VIEW_ACCESS_ROLE];
		}
		
		else if ( array_key_exists(Model::$MODEL_ACCESS_ROLE_READ, $arg_resource_record) )
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
			Trace::warning('Resources\Broker.getCheckedResourceRecord: bad resource record');
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
			Trace::warning('Resources\Broker.buildResourceObjectFromRecord: bad resource record');
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
						Trace::warning('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
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
						Trace::warning('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
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
						Trace::warning('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
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
						Trace::warning('Resources\Broker.buildResourceObjectFromRecord: required attributes failed for type:'.$type);
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
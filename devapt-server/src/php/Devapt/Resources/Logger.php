<?php
/**
 * @file        Logger.php
 * @brief       Log resource class
 * @details     ...
 * @see			...
 * @ingroup     RESOURCES
 * @date        2015-03-08
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Resources;

// DEBUG
use Devapt\Core\Trace;

/*
RESOURCES FORMAT :

*/
class Logger extends AbstractResource
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_LOGGER = false;
	
	
	
	// RESOURCE ATTRIBUTES
	
	/// @brief		menu label (string)
	// protected $menu_items_names			= array();
	
	
	
	// RESOURCE STATIC ATTRIBUTES
	
	/// @brief		Logger access method for security traces (string)
	static public $LOGGER_SECURITY		= 'security';
	
	/// @brief		Logger access method for debug traces (string)
	static public $LOGGER_DEBUG			= 'debug';
	
	/// @brief		Logger access method for info traces (string)
	static public $LOGGER_INFO			= 'info';
	
	/// @brief		Logger access method for warning traces (string)
	static public $LOGGER_WARN			= 'warn';
	
	/// @brief		Logger access method for error traces (string)
	static public $LOGGER_ERROR			= 'error';
	
	
	
	/**
	 * @brief		Constructor
	 $ @param[in]	arg_resource_record	resource record
	 * @return		nothing
	 */
	public function __construct($arg_resource_record)
	{
		Trace::step('Menu.Constructor', 'for menu ['.$arg_resource_record[AbstractResource::$RESOURCE_NAME].']', self::$TRACE_LOGGER);
		
		// DEBUG
		Trace::value('Menu.Constructor', 'name', $arg_resource_record[AbstractResource::$RESOURCE_NAME], self::$TRACE_LOGGER);
		Trace::value('Menu.Constructor', 'type', $arg_resource_record[AbstractResource::$RESOURCE_TYPE], self::$TRACE_LOGGER);
		Trace::value('Menu.Constructor', 'access', $arg_resource_record[AbstractResource::$RESOURCE_ACCESS], self::$TRACE_LOGGER);
		
		// SET BASE RESOURCE ATTRIBUTES
		$this->setResourceName($arg_resource_record[AbstractResource::$RESOURCE_NAME]);
		$this->setResourceType($arg_resource_record[AbstractResource::$RESOURCE_TYPE]);
		$this->setResourceAccess($arg_resource_record[AbstractResource::$RESOURCE_ACCESS]);
		Trace::value('Menu.Constructor', 'getResourceName', $this->getResourceName(), self::$TRACE_LOGGER);
		Trace::value('Menu.Constructor', 'getResourceAccess', $this->getResourceAccess(), self::$TRACE_LOGGER);
		
		
		// REGISTER ACCESSES
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), Logger::$LOGGER_SECURITY, $this->getResourceAccess());
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), Logger::$LOGGER_DEBUG, $this->getResourceAccess());
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), Logger::$LOGGER_INFO, $this->getResourceAccess());
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), Logger::$LOGGER_WARN, $this->getResourceAccess());
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), Logger::$LOGGER_ERROR, $this->getResourceAccess());
		
		
		// SET RESOURCE ATTRIBUTES
	}
}
<?php
/**
 * @file        Menu.php
 * @brief       Menu resource class
 * @details     ...
 * @see			...
 * @ingroup     RESOURCES
 * @date        2014-04-26
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

; MENUBAR 1 - MENU 1
application.menus.menu1.label=Menu 1
application.menus.menu1.tooltip=Tooltip Menu 1
application.menus.menu1.icon.url=
application.menus.menu1.icon.alt=
application.menus.menu1.display.url=			(goto url)
application.menus.menu1.display.page=			(goto view resource name page)
application.menus.menu1.display.js=
application.menus.menu1.position=right			(left/right for top menubar)
application.menus.menu1.index					(menu index on depending on position)

*/
class Menu extends AbstractResource
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_MENU = false;
	
	
	
	// RESOURCE ATTRIBUTES
	
	/// @brief		menu label (string)
	protected $menu_label				= null;
	
	/// @brief		menu tooltip (string)
	protected $menu_tooltip				= null;
	
	/// @brief		menu kind of type (string)
	protected $menu_type				= null;
	
	/// @brief		menu icon url (string)
	protected $menu_icon_url			= null;
	
	/// @brief		menu icon alt (string)
	protected $menu_icon_alt			= null;
	
	/// @brief		menu display url (string)
	protected $menu_display_url			= null;
	
	/// @brief		menu display page (string)
	protected $menu_display_page		= null;
	
	/// @brief		menu display js (string)
	protected $menu_display_js			= null;
	
	/// @brief		menu position (string)
	protected $menu_position			= null;
	
	/// @brief		menu index (integer)
	protected $menu_index				= null;
	
	/// @brief		menu sub menus (array)
	protected $menu_items				= null;
	
	/// @brief		menu sub menus names (array)
	protected $menu_items_names			= array();
	
	
	
	// RESOURCE STATIC ATTRIBUTES
	
	/// @brief		Menubar required attributes (array of strings)
	static public $attributes_required_list		= array('name', 'label');
	
	/// @brief		Menu position left (string)
	static public $MENU_ACCESS					= "menu_access";
	
	/// @brief		Menu position left (string)
	static public $MENU_POSITION_LEFT			= "left";
	
	/// @brief		Menu position right (string)
	static public $MENU_POSITION_RIGHT			= "right";
	
	/// @brief		Menu menu item type (string)
	static public $MENU_TYPE_MENU				= "MENU";
	
	/// @brief		Menu separator type (string)
	static public $MENU_TYPE_SEPARATOR			= "SEPARATOR";
	
	/// @brief		Menu label type (string)
	static public $MENU_TYPE_LABEL				= "LABEL";
	
	
	
	/**
	 * @brief		Constructor
	 $ @param[in]	arg_resource_record	resource record
	 * @return		nothing
	 */
	public function __construct($arg_resource_record)
	{
		Trace::step('Menu.Constructor', 'for menu ['.$arg_resource_record[AbstractResource::$RESOURCE_NAME].']', self::$TRACE_MENU);
		
		// SET BASE RESOURCE ATTRIBUTES
		$this->setResourceName($arg_resource_record[AbstractResource::$RESOURCE_NAME]);
		$this->setResourceType($arg_resource_record[AbstractResource::$RESOURCE_TYPE]);
		$this->setResourceAccess($arg_resource_record[AbstractResource::$RESOURCE_ACCESS]);
		
		
		// REGISTER ACCESSES
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), Menu::$MENU_ACCESS, $this->getResourceAccess());
		
		
		// SET RESOURCE ATTRIBUTES
		$this->menu_label		= array_key_exists('label', $arg_resource_record) ? $arg_resource_record['label'] : '';
		$this->menu_tooltip		= array_key_exists('tooltip', $arg_resource_record) ? $arg_resource_record['tooltip'] : '';
		$this->menu_type		= array_key_exists('type', $arg_resource_record) ? $arg_resource_record['type'] : self::$MENU_TYPE_MENU;
		
		$this->menu_icon_url	= array_key_exists('icon.url', $arg_resource_record) ? $arg_resource_record['icon_url'] : '';
		$this->menu_icon_alt	= array_key_exists('icon.alt', $arg_resource_record) ? $arg_resource_record['icon_alt'] : '';
		
		$this->menu_display_url	= array_key_exists('display.url', $arg_resource_record) ? $arg_resource_record['display.url'] : '';
		$this->menu_display_page= array_key_exists('display.page', $arg_resource_record) ? $arg_resource_record['display.page'] : '';
		$this->menu_display_js	= array_key_exists('display.js', $arg_resource_record) ? $arg_resource_record['display.js'] : '';
		if ( array_key_exists('display', $arg_resource_record) )
		{
			$display_record = $arg_resource_record['display'];
			$this->menu_display_url		= array_key_exists('url', $display_record) ? $display_record['url'] : '';
			$this->menu_display_page	= array_key_exists('page', $display_record) ? $display_record['page'] : '';
			$this->menu_display_js		= array_key_exists('js', $display_record) ? $display_record['js'] : '';
		}
		
		$this->menu_position	= array_key_exists('position', $arg_resource_record) ? $arg_resource_record['position'] : '';
		$this->menu_index		= array_key_exists('index', $arg_resource_record) ? $arg_resource_record['index'] : '';
		
		// SET ITEMS
		$items_str = array_key_exists('items', $arg_resource_record) ? $arg_resource_record['items'] : null;
		if ( is_string($items_str) && $items_str != '' )
		{
			$this->menu_items_names = explode(',', $items_str);
		}
	}
	
	
	
	/**
	 * @brief		Get menu label
	 * @return		string
	 */
	public function getMenuLabel()
	{
		return $this->menu_label;
	}
	
	/**
	 * @brief		Get menu tooltip
	 * @return		string
	 */
	public function getMenuTooltip()
	{
		return $this->menu_tooltip;
	}
	
	/**
	 * @brief		Get menu type
	 * @return		string
	 */
	public function getMenuType()
	{
		return $this->menu_type;
	}
	
	/**
	 * @brief		Get menu icon url
	 * @return		string
	 */
	public function getMenuIconUrl()
	{
		return $this->menu_icon_url;
	}
	
	/**
	 * @brief		Get menu icon alt
	 * @return		string
	 */
	public function getMenuIconAlt()
	{
		return $this->menu_icon_alt;
	}
	
	/**
	 * @brief		Get menu display url
	 * @return		string
	 */
	public function getMenuDisplayUrl()
	{
		return $this->menu_display_url;
	}
	
	/**
	 * @brief		Get menu display page
	 * @return		string
	 */
	public function getMenuDisplayPage()
	{
		return $this->menu_display_page;
	}
	
	/**
	 * @brief		Get menu display js
	 * @return		string
	 */
	public function getMenuDisplayJs()
	{
		return $this->menu_display_js;
	}
	
	/**
	 * @brief		Get menu position
	 * @return		string
	 */
	public function getMenuPosition()
	{
		return $this->menu_position;
	}
	
	/**
	 * @brief		Get menu index
	 * @return		string
	 */
	public function getMenuIndex()
	{
		return $this->menu_index;
	}
	
	/**
	 * @brief		Get menu items
	 * @return		string
	 */
	public function getMenuItems()
	{
		if ( is_array($this->menu_items) )
		{
			return $this->menu_items;
		}
		
		foreach($this->menu_items_names as $item_name)
		{
			$item = Broker::getResourceObject($item_name);
			if ( is_object($item) )
			{
				$this->menu_items[] = $item;
			}
		}
		
		return $this->menu_items;
	}
	
	/**
	 * @brief		Has items
	 * @return		boolean
	 */
	public function hasMenuItems()
	{
		return count($this->menu_items_names) > 0 || count($this->menu_items) > 0;
	}
	
	/**
	 * @brief		Get menuitems names
	 * @return		array
	 */
	public function getMenuItemsNames()
	{
		return $this->menu_items_names;
	}
	
	/**
	 * @brief		Get all menu items names (depth search)
	 * @return		array
	 */
	public function getMenuAllItemsNames()
	{
		$all_items = array();
		$items = $this->getMenuItems();
		if ( is_array($items) )
		{
			foreach($items as $item)
			{
				$all_items[] = $item->getResourceName();
				$sub_items = $item->getMenuAllItemsNames();
				$all_items = array_merge($all_items, $sub_items);
			}
		}
		
		return $all_items;
	}
	
	
	/**
	 * @brief		Add a menu resource to this menu
	 $ @param[in]	arg_menu_resource	menu resource (object)
	 * @return		nothing
	 */
/*	public function addMenu($arg_menu_resource)
	{
		// if ($arg_menu_resource instanceof Devapt\Resources\Menu)
		{
			$this->menu_items[] = $arg_menu_resource;
		}
	}*/
}
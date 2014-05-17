<?php
/**
 * @file        Menubar.php
 * @brief       Menubar resource class
 * @details     ...
 * @see			...
 * @ingroup     RESOURCES
 * @date        2014-01-16
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

; MENUBAR 1
application.menubars.menubar1.access=ROLE_AUTH_MENU_MAIN		(role name)
application.menubars.menubar1.label=Welcome menu bar
application.menubars.menubar1.tooltip=
application.menubars.menubar1.format=top						(top/nav)
application.menubars.menubar1.orientation=vertical				(vertical/horizontal for format=nav)
application.menubars.menubar1.template.string="{this}"
application.menubars.menubar1.template.string="{begin_row}{begin_4_cols}{this}{end_cols}{end_row}"
application.menubars.menubar1.items=menu1,menu2

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

; MENUBAR 1 - MENU 2
application.menus.menu2.label=Menu 2
application.menus.menu2.tooltip=Tooltip Menu 2
application.menus.menu2.icon.url=
application.menus.menu2.icon.alt=
application.menus.menu2.display.url=			(goto url)
application.menus.menu2.display.page=			(goto view resource name page)
application.menus.menu2.display.js=
application.menus.menu2.position=right			(left/right for top menubar)
application.menus.menu2.index					(menu index on depending on position)

*/
class Menubar extends AbstractResource
{
	// RESOURCE ATTRIBUTES
	
	/// @brief		menubar label (string)
	protected $menubar_label			= null;
	
	/// @brief		menubar tooltip (string)
	protected $menubar_tooltip			= null;
	
	/// @brief		menubar format (string)
	protected $menubar_format			= null;
	
	/// @brief		menubar orientation (string)
	protected $menubar_orientation		= null;
	
	/// @brief		menubar template string (string)
	protected $menubar_template_string	= null;
	
	/// @brief		menubar menus (array)
	protected $menubar_items			= null;
	
	/// @brief		menubar menus names (array)
	protected $menubar_items_names		= array();
	
	
	
	// RESOURCE STATIC ATTRIBUTES
	
	/// @brief		Menubar required attributes (array of strings)
	static public $attributes_required_list		= array('name', 'label');
	
	
	/// @brief		Menubar format TOP (string)
	static public $MENUBAR_FORMAT_TOP				= "top";
	
	/// @brief		Menubar format NAV (string)
	static public $MENUBAR_FORMAT_NAV				= "nav";
	
	/// @brief		Menubar orientation VERTICAL (string)
	static public $MENUBAR_ORIENTATION_VERTICAL		= "vertical";
	
	/// @brief		Menubar orientation HORIZONTAL (string)
	static public $MENUBAR_ORIENTATION_HORIZONTAL	= "horizontal";
	
	
	
	/**
	 * @brief		Constructor
	 $ @param[in]	arg_resource_record	resource record
	 * @return		nothing
	 */
	public function __construct($arg_resource_record)
	{
		Trace::debug('Constructor for menubar ['.$arg_resource_record[AbstractResource::$RESOURCE_NAME].']');
		
		// SET BASE RESOURCE ATTRIBUTES
		$this->setResourceName($arg_resource_record[AbstractResource::$RESOURCE_NAME]);
		$this->setResourceType($arg_resource_record[AbstractResource::$RESOURCE_TYPE]);
		$this->setResourceAccess($arg_resource_record[AbstractResource::$RESOURCE_ACCESS]);
		
		
		// REGISTER ACCESSES
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'html_view', $this->getResourceAccess());
		
		
		// SET RESOURCE ATTRIBUTES
		$this->menubar_label = array_key_exists('label', $arg_resource_record) ? $arg_resource_record['label'] : '';
		$this->menubar_tooltip = array_key_exists('tooltip', $arg_resource_record) ? $arg_resource_record['tooltip'] : '';
		
		$this->menubar_format = array_key_exists('format', $arg_resource_record) ? strtolower($arg_resource_record['format']) : 'nav';
		$this->menubar_format = ($this->menubar_format == 'nav' || $this->menubar_format == 'top') ? $this->menubar_format : 'nav';
		
		$this->menubar_orientation = array_key_exists('orientation', $arg_resource_record) ? strtolower($arg_resource_record['orientation']) : 'horizontal';
		$this->menubar_orientation = ($this->menubar_orientation == 'horizontal' || $this->menubar_orientation == 'vertical') ? $this->menubar_format : 'horizontal';
		
		$this->menubar_template_string = '';
		if ( array_key_exists('template', $arg_resource_record) )
		{
			if ( array_key_exists('string', $arg_resource_record['template']) )
			{
				$this->menubar_template_string = $arg_resource_record['template']['string'];
			}
		}
		
		// SET ITEMS
		$items_str = array_key_exists('items', $arg_resource_record) ? $arg_resource_record['items'] : null;
		if ( is_string($items_str) && $items_str != '' )
		{
			$this->menubar_items_names = explode(',', $items_str);
		}
	}
	
	
	
	/**
	 * @brief		Get menubar label
	 * @return		string
	 */
	public function getMenubarLabel()
	{
		return $this->menubar_label;
	}
	
	/**
	 * @brief		Get menubar tooltip
	 * @return		string
	 */
	public function getMenubarTooltip()
	{
		return $this->menubar_tooltip;
	}
	
	/**
	 * @brief		Get menubar format
	 * @return		string
	 */
	public function getMenubarFormat()
	{
		return $this->menubar_format;
	}
	
	/**
	 * @brief		Get menubar orientation
	 * @return		string
	 */
	public function getMenubarOrientation()
	{
		return $this->menubar_orientation;
	}
	
	/**
	 * @brief		Get menubar template string
	 * @return		string
	 */
	public function getMenubarTemplateString()
	{
		return $this->menubar_template_string;
	}
	
	/**
	 * @brief		Get menubar items
	 * @return		array
	 */
	public function getMenubarItems()
	{
		if ( is_array($this->menubar_items) )
		{
			return $this->menubar_items;
		}
		
		foreach($this->menubar_items_names as $item_name)
		{
			$item = Broker::getResourceObject($item_name);
			if ( is_object($item) )
			{
				$this->menubar_items[] = $item;
			}
		}
		
		return $this->menubar_items;
	}
	
	/**
	 * @brief		Get menubar items names
	 * @return		array
	 */
	public function getMenubarItemsNames()
	{
		return $this->menubar_items_names;
	}
	
	/**
	 * @brief		Get all menubar items names (depth search)
	 * @return		array
	 */
	public function getMenubarAllItemsNames()
	{
		$all_items = array();
		$items = $this->getMenubarItems();
		foreach($items as $item)
		{
			$all_items[] = $item->getResourceName();
			$sub_items = $item->getMenuAllItemsNames();
			$all_items = array_merge($all_items, $sub_items);
		}
		
		return $all_items;
	}
	
	/**
	 * @brief		Add a menu resource to this menubar
	 $ @param[in]	arg_menu_resource	menu resource (object)
	 * @return		nothing
	 */
/*	public function addMenu($arg_menu_resource)
	{
		if ( ! is_object(arg_menu_resource) )
		{
			Trace::debug('Menubar.addMenu(not an object)');
		}
		
		Trace::debug('Menubar.addMenu('.( $arg_menu_resource->getResourceName() ).')');
		// if ($arg_menu_resource instanceof Devapt\Resources\Menu)
		{
			$this->menubar_items[] = $arg_menu_resource;
		}
	}*/
}

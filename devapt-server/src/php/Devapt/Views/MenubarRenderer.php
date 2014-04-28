<?php
/**
 * @file        MenubarRenderer.php
 * @brief       Manubars renderer
 * @details     ...
 * @see			...
 * @ingroup     VIEWS
 * @date        2014-04-26
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		
 */

namespace Devapt\Views;

use Devapt\Application\Application;
use Devapt\Resources\Menubar;
use Devapt\Resources\Menu;

use Devapt\Security\Authentication;

// DEBUG
use Devapt\Core\Trace;

final class MenubarRenderer
{
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Render the view : call specialized renderer
     * @param[in]	arg_view_resource	resource resource object (View)
     * @param[in]	arg_action_name		action name (string)
     * @param[in]	arg_id				id value (interger|string|null)
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		boolean
	 */
	static public function render($arg_view_resource, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// CHECK ARGS
		if ( is_null($arg_view_resource) )
		{
			Trace::warning('MenubarRenderer::render: resource object is null');
			return false;
		}
		// if ( ! $arg_view_resource instanceof Devapt\Resources\Menubar )
		// {
			// Trace::warning('MenubarRenderer::render: resource object is not a menubar but ['.(is_object($arg_view_resource) ? get_class($arg_view_resource) : 'not an object').']');
			// return false;
		// }
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning('MenubarRenderer::render: action name is not a string');
			return false;
		}
		// if ( is_null($arg_request) )
		// {
			// Trace::warning('MenubarRenderer::render: request object is null');
			// return false;
		// }
		if ( is_null($arg_response) )
		{
			Trace::warning('MenubarRenderer::render: response object is null');
			return false;
		}
		
		// CHECK ID
		if ( ! is_string($arg_id) || $arg_id === '' )
		{
			$arg_id = $arg_view_resource->getResourceName();
		}
		
		
		// GET RENDERED BUFFER
		$buffer = '';
		// $buffer .= "Menubar:";
		$items = $arg_view_resource->getMenubarItems();
		// $buffer .= '('.count($items).')';
		// foreach($items as $item)
		// {
			// $buffer .= $item->getResourceName().',';
		// }
		
		$buffer .= self::enterMenuBar($arg_view_resource);
		
		$menus_bar_format = $arg_view_resource->getMenubarFormat();
		$menus_bar_orientation = $arg_view_resource->getMenubarOrientation();
		
		// FILL MENUS BAR LAYOUT
		$right_menus = array();
		if ($menus_bar_format == Menubar::$MENUBAR_FORMAT_TOP)
		{
			$buffer .= '<ul class="left">';
		}
		foreach($items as $current_menu_0)
		{
			// BUFFER MENU AT RIGHT
			if ($current_menu_0->getMenuPosition() === Menu::$MENU_POSITION_RIGHT)
			{
				$right_menus[] = $current_menu_0;
				continue;
			}
			
			// PROCESS LEFT MENUS
			// TRACE::trace_var($context, "current_menu_0.name at left", $current_menu_0->getName(), self::$TRACE_CONTROLLED_MENUS_BAR);
			if ($menus_bar_format === Menubar::$MENUBAR_FORMAT_TOP)
			{
				$buffer .= self::addTopBarMenu($current_menu_0);
			}
			else
			{
				$buffer .= self::addMenu($current_menu_0);
			}
		}
		if ($menus_bar_format === Menubar::$MENUBAR_FORMAT_TOP)
		{
			$buffer .= '</ul>';
		}
		
		if ($menus_bar_format === Menubar::$MENUBAR_FORMAT_TOP)
		{
			$buffer .= '<ul class="right">';
			foreach($right_menus as $current_menu_0)
			{
				// TRACE::trace_var($context, "current_menu_0.name at right", $current_menu_0->getName(), self::$TRACE_CONTROLLED_MENUS_BAR);
				if ($menus_bar_format == Menubar::$MENUBAR_FORMAT_TOP)
				{
					$buffer .= self::addTopBarMenu($current_menu_0);
				}
				else
				{
					$buffer .= self::addMenu($current_menu_0);
				}
			}
			$buffer .= self::renderTopBarMenuLogout();
			$buffer .= '</ul>';
		}
		
		// LEAVE MENUS BAR LAYOUT
		$buffer .= self::leaveMenuBar($menus_bar_format, $menus_bar_orientation);
		
		
		// CHECK RENDERED BUFFER
		if ( ! is_string($buffer) )
		{
			Trace::warning('MenubarRenderer::render: MenubarRenderer result is not a string');
			$arg_response->setStatusCode($arg_response::STATUS_CODE_500);
			return false;
		}
		
		// UPDATE RESPONSE
		$content = $arg_response->getContent();
		$content .= '<div id="'.$arg_id.'">'.$buffer.'</div>';
		$arg_response->setContent($content);
		
		$arg_response->setStatusCode($arg_response::STATUS_CODE_200);
		return true;
		
		Trace::warning("MenubarRenderer::render: no renderer found to process the view class [$view_class]");
		return false;
	}
	
	
	/**
	 * @brief		Render html for a menu bar begin
     * @param[in]	arg_menubar_resource	resource object (Menubar)
	 * @return		string
	 */
	static public function enterMenuBar($arg_menubar_resource)
	{
		$buffer = '';
		$format = $arg_menubar_resource->getMenubarFormat();
		$app = Application::getInstance();
		$appcfg = $app->getConfig();
		
		// ENTER TOP MENUBAR
		if ($format === Menubar::$MENUBAR_FORMAT_TOP)
		{
			$buffer .= '<nav class="top-bar" data-topbar>';
			$buffer .= '<ul class="title-area">';
				$buffer .= '<li class="name">';
					$buffer .= '<h1>';
						$link = $appcfg->getUrlBase();
						$label = $appcfg->getShortLabel();
						$tooltip = $appcfg->getLongLabel()."-".$appcfg->getVersion();
						if ( $appcfg->getSecurityIsReadOnly() )
						{
							$tooltip .= " (readonly mode)";
						}
						$buffer .= '<a href="'.$link.'" title="'.$tooltip.'">'.$label.'</a>';
					$buffer .= '</h1>';
				$buffer .= '</li>';
				
				$buffer .= '<li class="name">';
					$buffer .= '<a href="#"></a>';
				$buffer .= '</li>';
			$buffer .= '</ul>';
			
			$buffer .= '<section class="top-bar-section">';
			return $buffer;
		}
		
		
		// ENTER NAV Menubar	// NAVIGATION MENUS BAR
		// VERTICAL ORIENTATION
		if ($arg_orientation == MenuBar::$ORIENTATION_VERTICAL)
		{
			return '<ul class="nav-bar vertical">';
		}
		
		// DEFAULT : HORIZONTAL ORIENTATION
		return '<ul class="nav-bar">';
	}
	
	
	/**
	 * @brief		Render html for a new menu (in a menus top bar)
	 * @param[in]	arg_menu_object		menu object
	 * @return		nothing
	 */
	static public function addTopBarMenu($arg_menu_object)
	{
		$buffer = '';
		
		// MENU CHILDS
		$menu_childs		= $arg_menu_object->getMenuItems();
		$menu_childs_count	= count($menu_childs);
		
		// MENU ATTRIBUTES
		$menu_label		= $arg_menu_object->getMenuLabel();
		$menu_label_tag	= $menu_label;
		$menu_icon_url	= $arg_menu_object->getMenuIconUrl();
		$menu_icon_tag	= "";
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= '<img src="'.$menu_icon_url.'" class="libapt_menu_icon"></img>';
			$menu_label_tag	= '<span>'.$menu_icon_tag.$menu_label.'</span>';
		}
		$menu_tooltip	= $arg_menu_object->getMenuTooltip();
		$menu_tooltip_attribute = '';
		if ( ! is_null($menu_tooltip) )
		{
			$menu_tooltip_attribute = ' title="'.$menu_tooltip.'"';
		}
		
		// ENTER MENU
		if ($menu_childs_count === 0)
		{
			$buffer .= '<li>';
			// $buffer .= '<a href="#" class="libapt_i18n" '.$menu_tooltip_attribute.'>'.$menu_label_tag.'</a>';
			$buffer .= self::addMenuChild($arg_menu_object);
			$buffer .= '</li>';
			return $buffer;
		}

		$buffer .= '<li class="has-dropdown">';
		$buffer .= '<a href="#" class="libapt_i18n" '.$menu_tooltip_attribute.'>'.$menu_label_tag.'</a>';
		
		$buffer .= '<ul class="dropdown">';
		$buffer .= self::addTopBarMenuChilds($menu_childs);
		$buffer .= '</ul>';
		
		// LEAVE MENU
		$buffer .= '</li>';
		
		return $buffer;
	}
	
	
	
	/**
	 * @brief		Render html for a menu childs (in a menus top bar)
	 * @param[in]	arg_menu_childs		menus objects array
	 * @return		nothing
	 */
	static public function addTopBarMenuChilds($arg_menu_childs)
	{
		$buffer = '';
		$app = Application::getInstance();
		$appcfg = $app->getConfig();
		
		foreach($arg_menu_childs as $menu_child)
		{
			if ( ! $app->hasAuthentication() || Authorization::checkLogged($menu_child->getResourceName(), Menu::$MENU_ACCESS) )
			{
				if ( $menu_child->hasMenuItems() )
				{
					$menu_label		= $menu_child->getMenuLabel();
					$menu_label_tag	= $menu_label;
					$menu_icon_url	= $menu_child->getMenuIconUrl();
					if ( ! is_null($menu_icon_url) )
					{
						$menu_icon_tag	= '<img src="'.$menu_icon_url.'" class="libapt_menu_icon"></img>';
						$menu_label_tag	= '<span>'.$menu_icon_tag.'<span class="libapt_i18n">'.$menu_label.'</span></span>';
					}
					
					$buffer .= '<li class="has-dropdown">';
						$buffer .= '<a href="#">'.$menu_label_tag.'</a>';
						$buffer .= '<ul class="dropdown">';
						$buffer .= self::addTopBarMenuChilds($menu_child->getMenuItems());
						$buffer .= '</ul>';
					$buffer .= '</li>';
				}
				else
				{
					switch ($menu_child->getMenuType())
					{
						case Menu::$MENU_TYPE_SEPARATOR:
							$buffer .= '<li class="divider" />';
							break;
						case Menu::$MENU_TYPE_LABEL:
							$buffer .= '<li>';
							$buffer .= '<label id="'.$menu_child->getMenuLabel().'" class="libapt_i18n" />';
							$buffer .= '</li>';
							break;
						default :
							$buffer .= '<li>';
							$buffer .= self::addMenuChild($menu_child);
							$buffer .= '</li>';
							break;
					}
				}
			}
		}
		
		return $buffer;
	}
	
	
	/**
	 * @brief		Render html for a new menu
	 * @param[in]	arg_menu_object		menu object
	 * @return		nothing
	 */
	static public function addMenu($arg_menu_object)
	{
		$buffer = '';
		
		// MENU HAS NO CHILDS
		if ( ! $arg_menu_object->hasMenuItems() )
		{
			$buffer .= '<li>';
			$buffer .= self::addMenuChild($arg_menu_object);
			$buffer .= '</li>';
			return $buffer;
		}
		
		// ENTER MENU
		$buffer .= '<li class="has-flyout">';
		
		// MENU HEADER
		$menu_label		= $arg_menu_object->getMenuLabel();
		$menu_label_tag	= $menu_label;
		$menu_icon_url	= $arg_menu_object->getMenuIconUrl();
		$menu_icon_tag	= "";
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= '<img src="'.$menu_icon_url.'" class="libapt_menu_icon"></img>';
			$menu_label_tag	= '<span>'.$menu_icon_tag.'<span class="libapt_i18n">'.$menu_label.'</span></span>';
			$buffer .= '<a href="#" class="main">'.$menu_label_tag.'</a>';
		}
		else
		{
			$buffer .= '<a href="#" class="main libapt_i18n">'.$menu_label_tag.'</a>';
		}
		
		$buffer .= '<a class="flyout-toggle" href="#">';
		$buffer .=		'<span> </span>';
		$buffer .= '</a>';
		
		// MENU CHILDS
		$menu_childs = $arg_menu_object->getMenuItems();
		$buffer .= '<ul class="flyout" style="display: none;">';
		$buffer .= self::addMenuChilds($menu_childs);
		$buffer .= '</ul>';
		
		// LEAVE MENU
		$buffer .= '</li>';
		
		return $buffer;
	}
	
	
	
	/**
	 * @brief		Render html for a menu childs
	 * @param[in]	arg_menu_childs		menus objects array
	 * @return		nothing
	 */
	static public function addMenuChilds($arg_menu_childs)
	{
		$buffer = '';
		
		foreach($arg_menu_childs as $menu_child)
		{
			if ( ! Application::getInstance()->hasAuthentication() || Authorization::checkLogged($menu_child->getName(), Menu::$MENU_ACCESS) )
			{
				if ( $menu_child->hasMenuItems() )
				{
					$menu_label = $menu_child->getMenuLabel();
					$menu_label_tag	= $menu_label;
					$menu_icon_url	= $menu_child->getMenuIconUrl();
					$menu_link_tag	= '';
					if ( ! is_null($menu_icon_url) )
					{
						$menu_icon_tag	= '<img src="'.$menu_icon_url.'" class="libapt_menu_icon"></img>';
						$menu_label_tag	= '<span>'.$menu_icon_tag.'<span class="libapt_i18n">'.$menu_label.'</span></span>';
						$menu_link_tag	= '<a href="#" class="main">'.$menu_label_tag.'</a>';
					}
					else
					{
						$menu_link_tag	= '<a href="#" class="main libapt_i18n">'.$menu_label_tag.'</a>';
					}
					
					$buffer .= '<li class="has-flyout">';
					$buffer .=	'<a class="flyout-toggle" href="#">';
					$buffer .=	'<ul class="flyout" style="display: none;">';
					$buffer .=	self::addMenuChilds($menu_child->getMenuItems());
					$buffer .=	'</ul>';
					$buffer .= '</li>';
				}
				else
				{
					$buffer .= '<li>';
					$buffer .=	self::addMenuChild($menu_child, null);
					$buffer .= '</li>';
				}
			}
		}
		
		return $buffer;
	}
	
	
	
	/**
	 * @brief		Render html for a menu child
	 * @param[in]	arg_menu_child		menu object
	 * @return		nothing
	 */
	static public function addMenuChild($arg_menu_child)
	{
		$buffer = '';
		
		$menu_label		= $arg_menu_child->getMenuLabel();
		
		$display_url	= $arg_menu_child->getMenuDisplayUrl();
		$display_page	= $arg_menu_child->getMenuDisplayPage();
		$display_js		= $arg_menu_child->getMenuDisplayJs();
		
		$icon_url		= $arg_menu_child->getMenuIconUrl();
		$icon_alt		= $arg_menu_child->getMenuIconAlt();
		
		$js = '';
		$link = 'unknow';
		
		// JS ACTION
		if ( ! is_null($display_js) && $display_js !== '' )
		{
			$link = '#';
			$js = ' onclick="'.$display_js.'"';
		}
		
		// LINK ACTION
		if ( ! is_null($display_url) && $display_url !== '' )
		{
			$link = $display_url;
		}
		
		// DISPLAY PAGE ACTION
		else if ( is_string($display_page) && $display_page !== '' )
		{
			$app = Application::getInstance();
			$appcfg = $app->getConfig();
			$app_base = $appcfg->getUrlBase();
			$link = $app_base.'views/'.$display_page.'/html_page';
		}
		
		// HAS ICON
		if ( ! is_null($icon_url) && $icon_url !== '' )
		{
			$menu_icon_tag	= '<img src="'.$icon_url.'" alt="'.( is_null($icon_alt) ? '' : $icon_alt ).'" class="libapt_menu_icon"></img>';
			return '<a href="'.$link.'" style="padding:5px;" '.$js.'>'.$menu_icon_tag.'<span class="libapt_i18n">'.$menu_label.'</span></a>';
		}
		
		// HASN'T ICON
		return '<a href="'.$link.'" class="libapt_i18n" '.$js.'>'.$menu_label.'</a>';
	}
	
	
	
	
	/**
	 * @brief		Render html for a menu bar end
	 * @param[in]	arg_format			layout format of the menu bar (TOP or NAV)
	 * @param[in]	arg_orientation		layout orientation of the menu bar (VERTICAL or HORIZONTAL) (only for NAV format)
	 * @return		string
	 */
	static public function leaveMenuBar($arg_format, $arg_orientation)
	{
		$buffer = '';
		
		// TOP MENUS BAR
		if ($arg_format == Menubar::$MENUBAR_FORMAT_TOP)
		{
			$buffer = '';
			$buffer .= '</section>';
			$buffer .= '</nav>';
			return $buffer;
		}
		
		// NAVIGATION MENUS BAR
		return '</ul>';
	}
	
	
	/**
	 * @brief		Render html logout menu
	 * @return		nothing
	 */
	static public function renderTopBarMenuLogout()
	{
		$buffer = '';
		
		if (Authentication::isEnabled() && ! Application::getInstance()->hasAutoLogin() )
		{
			$buffer .= '<li>';
			if ( Authentication::isLogged() )
			{
				// TODO
				// $logout_img = THEMES::getIconUrl('exit_48');
				$logout_img = 'logout.png';
				
				$tooltip = 'Logout current logged user : '.Authentication::getLogin();
				$buffer .= '<a href="#" class="libapt_i18n" title="'.$tooltip.'"><img id="logout_img" src="'.$logout_img.'" alt="logout" onclick="$(\'#logout_form\').submit();"></img></a>';
			}
			$buffer .= '</li>';
		}
		
		return $buffer;
	}
}
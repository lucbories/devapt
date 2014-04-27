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
				self::addTopBarMenu($current_menu_0);
			}
			else
			{
				// self::addMenu($current_menu_0);
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
					self::addTopBarMenu($current_menu_0);
				}
				else
				{
					// self::addMenu($current_menu_0);
				}
			}
			// self::renderTopBarMenuLogout();
			$buffer .= '</ul>';
		}
		
		// LEAVE MENUS BAR LAYOUT
		self::leaveMenuBar($menus_bar_format, $menus_bar_orientation);
		
		
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
			$buffer .= '<nav class="top-bar">';
			$buffer .= '<ul>';
				$buffer .= '<li>';
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
				
				$buffer .= '<li>';
					$buffer .= '<a href="#"></a>';
				$buffer .= '</li>';
			$buffer .= '</ul>';
			
			$buffer .= '<section>';
			return $buffer;
		}
		
		
		// ENTER NAV Menubar	// NAVIGATION MENUS BAR
		// VERTICAL ORIENTATION
		if ($arg_orientation == MenuBar::$ORIENTATION_VERTICAL)
		{
			$buffer .= '<ul class="nav-bar vertical">';
			return $buffer;
		}
		
		// DEFAULT : HORIZONTAL ORIENTATION
		$buffer .= '<ul class="nav-bar">';
		return $buffer;
	}
	
	
	/**
	 * @brief		Render html for a new menu (in a menus top bar)
	 * @param[in]	arg_menu_object		menu object
	 * @return		nothing
	 */
	static public function addTopBarMenu($arg_menu_object)
	{
		$buffer = '';
		
		// ENTER MENU
		$buffer .= '<li class="has-dropdown">';
		
		// MENU HEADER
		$menu_label		= $arg_menu_object->getMenuLabel();
		$menu_label_tag	= $menu_label;
		$menu_icon_url	= $arg_menu_object->getMenuIconUrl();
		$menu_icon_tag	= "";
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
			$menu_label_tag	= "<span>$menu_icon_tag$menu_label</span>";
		}
		$menu_tooltip	= $arg_menu_object->getMenuTooltip();
		$menu_tooltip_attribute = "";
		if ( ! is_null($menu_tooltip) )
		{
			$menu_tooltip_attribute = " title='$menu_tooltip'";
		}
		
		$buffer .= '<a href="#" class="libapt_i18n" '.$menu_tooltip_attribute.'>'.$menu_label_tag.'</a>\n';
		
		// MENU CHILDS
		$menu_childs		= $arg_menu_object->getMenuItems();
		$menu_childs_count	= count($menu_childs);
		if ($menu_childs_count > 0)
		{
			$buffer .= '<ul class="dropdown">';
				$this->addTopBarMenuChilds($menu_childs);
			$buffer .= '</ul>';
		}
		
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
		// $format = $arg_menubar_resource->getMenubarFormat();
		$app = Application::getInstance();
		$appcfg = $app->getConfig();
		
		foreach($arg_menu_childs as $menu_child)
		{
			if ( ! $app->hasAuthentication() || Authorization::checkLogged($menu_child->getResourceName(), "MENU_DISPLAY") )
			{
				if ( $menu_child->hasChilds() )
				{
					$menu_label = $menu_child->getLabel();
					$menu_label_tag	= $menu_label;
					$menu_icon_url	= $menu_child->getIconUrl();
					if ( ! is_null($menu_icon_url) )
					{
						$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
						$menu_label_tag	= "<span>$menu_icon_tag<span class='libapt_i18n'>$menu_label</span></span>";
					}
					
					$buffer .= '<li class="has-dropdown">';
						$buffer .= '<a href="#">'.$menu_label_tag.'</a>\n';
						$buffer .= '<ul class="dropdown">';
							$this->addTopBarMenuChilds($menu_child->getMenuItems());
						$buffer .= '</ul>';
					$buffer .= '</li>';
				}
				else
				{
					switch ($menu_child->getType())
					{
						case Menu::$MENU_TYPE_SEPARATOR:
							$buffer .= '<li class="divider" />';
							break;
						case Menu::$MENU_TYPE_LABEL:
							$buffer .= '<li>';
							$buffer .= '<label id="'.$menu_child->getLabel().'" class="libapt_i18n" />';
							$buffer .= '</li>';
							break;
						default :
							$buffer .= '<li>';
							// $this->addMenuChild($menu_child, null);
							$buffer .= '</li>';
							break;
					}
				}
			}
		}
	}
	
	
	
	
	
	
	/**
	 * @brief		Render html for a new menu
	 * @param[in]	arg_menu_object		menu object
	 * @return		nothing
	 */
	static public function addMenu($arg_menu_object)
	{
		// MENU HAS NO CHILDS
		if ( ! $arg_menu_object->hasChilds() )
		{
			HTML::enterLI();
			$this->addMenuChild($arg_menu_object);
			HTML::leaveLI();
			return;
		}
		
		// ENTER MENU
		HTML::enterLI(null, "has-flyout");
		
		// MENU HEADER
		$menu_label		= $arg_menu_object->getLabel();
		$menu_label_tag	= $menu_label;
		$menu_icon_url	= $arg_menu_object->getIconUrl();
		$menu_icon_tag	= "";
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
			$menu_label_tag	= "<span>$menu_icon_tag<span class='libapt_i18n'>$menu_label</span></span>";
			HTML::addBufferLine("<a href='#' class='main'>".$menu_label_tag."</a>\n");
		}
		else
		{
			HTML::addBufferLine("<a href='#' class='main libapt_i18n'>".$menu_label_tag."</a>\n");
		}
		
		HTML::addBufferLine("<a class='flyout-toggle' href='#'>");
			HTML::addBufferLine("<span> </span>");
		HTML::addBufferLine("</a>\n");
		
		// MENU CHILDS
		$menu_childs = $arg_menu_object->getChilds();
		HTML::enterUL(null, "flyout", "style='display: none;'");
			$this->addMenuChilds($menu_childs);
		HTML::leaveUL();
		
		// LEAVE MENU
		HTML::leaveLI();
	}
	
	
	
	/**
	 * @brief		Render html for a menu childs
	 * @param[in]	arg_menu_childs		menus objects array
	 * @return		nothing
	 */
	static public function addMenuChilds($arg_menu_childs)
	{
		foreach($arg_menu_childs as $menu_child)
		{
			if ( ! Application::getInstance()->hasAuthentication() || Authorization::checkLogged($menu_child->getName(), "MENU_DISPLAY") )
			{
				if ( $menu_child->hasChilds() )
				{
					$menu_label = $menu_child->getLabel();
					$menu_label_tag	= $menu_label;
					$menu_icon_url	= $menu_child->getIconUrl();
					$menu_link_tag	= "";
					if ( ! is_null($menu_icon_url) )
					{
						$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
						$menu_label_tag	= "<span>$menu_icon_tag<span class='libapt_i18n'>$menu_label</span></span>";
						$menu_link_tag	= "<a href='#' class='main'>".$menu_label_tag."</a>\n";
					}
					else
					{
						$menu_link_tag	= "<a href='#' class='main libapt_i18n'>".$menu_label_tag."</a>\n";
					}
					
					HTML::enterLI(null, "has-flyout");
						HTML::addBufferLine();
						HTML::addBufferLine("<a class='flyout-toggle' href='#'>");
						HTML::enterUL(null, "flyout", "style='display: none;'");
							$this->addMenuChilds($menu_child->getChilds());
						HTML::leaveUL();
					HTML::leaveLI();
				}
				else
				{
					HTML::enterLI();
					$this->addMenuChild($menu_child, null);
					HTML::leaveLI();
				}
			}
		}
	}
	
	
	
	/**
	 * @brief		Render html for a menu child
	 * @param[in]	arg_menu_child		menu object
	 * @return		nothing
	 */
	static public function addMenuChild($arg_menu_child)
	{
		$menu_label			= $arg_menu_child->getLabel();
		$action_view		= $arg_menu_child->getActionView();
		$action_model		= $arg_menu_child->getActionModel();
		$action_json		= $arg_menu_child->getActionJson();
		$action_view_opds	= $arg_menu_child->getActionViewOperands();
		$action_model_opds	= $arg_menu_child->getActionModelOperands();
		$action_js			= $arg_menu_child->getActionJS();
		
		$js = "";
		$link = "";
		
		// JS ACTION
		if ( $arg_menu_child->hasActionJS() )
		{
			$link = "#";
			$js = " onclick='$action_js'";
		}
		
		// LINK
		if ( $arg_menu_child->hasLinkUrl() )
		{
			$link = $arg_menu_child->getLinkUrl();
		}
		else
		{
			$opds_str = "";
			if ( ! is_null($action_view_opds) && $action_view_opds != "" )
			{
				$opds_str = $action_view_opds;
			}
			if ( ! is_null($action_model_opds) )
			{
				$opds_str .= ($opds_str == "" ? "" : "&") . $action_model_opds;
			}
			if ( ! ( is_null($action_view) && is_null($action_model) ) )
			{
				$link = Urls::getActionUrl($action_model, $action_view, $opds_str);
			}
			if ( ! is_null($action_json) && $action_json != "" )
			{
				$link .= ($link == "" ? "?" : "&") . "jsonAction=$action_json";
			}
		}
		
		$menu_icon_url	= $arg_menu_child->getIconUrl();
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
			$menu_label_tag	= "<a href='$link' style='padding:5px;'	$js>$menu_icon_tag<span class='libapt_i18n'>$menu_label</span></a>";
			HTML::addBufferLine($menu_label_tag);
		}
		else
		{
			$menu_label_tag	= "<a href='$link' class='libapt_i18n' $js>$menu_label</a>\n";
			HTML::addBufferLine($menu_label_tag);
		}
	}
	
	
	
	
	/**
	 * @brief		Render html for a menu bar end
	 * @param[in]	arg_format			layout format of the menu bar (TOP or NAV)
	 * @param[in]	arg_orientation		layout orientation of the menu bar (VERTICAL or HORIZONTAL) (only for NAV format)
	 * @return		string
	 */
	static public function leaveMenuBar($arg_format, $arg_orientation)
	{
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
		if (Authentication::isEnabled() && ! Application::getInstance()->hasAutoLogin() )
		{
			HTML::enterLI();
			if ( Authentication::isLogged() )
			{
				$logout_img = THEMES::getIconUrl('exit_48');
				$tooltip = "Logout current logged user : ".Authentication::getLogin();
				HTML::addBufferLine("<a href='#' class='libapt_i18n' title='$tooltip'><img id='logout_img' src=\"$logout_img\" alt=\"logout\" onclick=\"$('#logout_form').submit();\"></img></a>");
			}
			HTML::leaveLI();
		}
	}
}
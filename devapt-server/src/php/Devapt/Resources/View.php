<?php
/**
 * @file        View.php
 * @brief       View resource class
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

class View extends AbstractResource
{
	// ALL VIEW ATTRIBUTES
	
	/// @brief		view class name (string)
	protected $view_class_name	= null;
	
	/// @brief		view parent name (string)
	protected $view_parent_name	= null;
	
	/// @brief		view required attributes (array of strings)
	static public $attributes_required_list		= array('name', 'class_type', 'class_name');
	
	/// @brief		view attributes (array)
	protected $view_attributes	= null;
	
	
	/// @brief		View access role (string) (should be a valid role name)
	static public $VIEW_ACCESS_ROLE		= "role_display";
	
	/// @brief		View class name (string) (should be a valid PHP class or JSView or JSModelView)
	static public $VIEW_CLASS_NAME		= "class_name";
	
	/// @brief		View parent name (string) (should be a valid view resource name)
	static public $VIEW_PARENT_NAME		= "parent_view_name";
	
	
	
	// INCLUDE VIEW RESOURCE ATTRIBUTES
	
	/// @brief		include file path name (string)
	protected $include_view_file_path_name	= null;
	
	/// @brief		include inline HTML (string)
	protected $include_view_inline_html		= null;
	
	/// @brief		include inline PHP (string)
	protected $include_view_inline_php		= null;
	
	/// @brief		include inline JS (string)
	protected $include_view_inline_js		= null;
	
	
	/// @brief		Include view file path name (string) (should be a valid file path name)
	static public $INCLUDE_VIEW_FILE_PATH_NAME	= "include_file_path_name";
	
	/// @brief		Include view inline HTML (string)
	static public $INCLUDE_VIEW_INLINE_HTML		= "include_inline_html";
	
	/// @brief		Include view inline PHP (string)
	static public $INCLUDE_VIEW_INLINE_PHP		= "include_inline_html";
	
	/// @brief		Include view inline JS (string)
	static public $INCLUDE_VIEW_INLINE_JS		= "include_inline_js";
	
	
	
	// TEMPLATE VIEW RESOURCE ATTRIBUTES
	
	/// @brief		template  (string)
	protected $template_view_is_enabled		= null;
	
	/// @brief		template  (string)
	protected $template_view_string			= null;
	
	/// @brief		template  (string)
	protected $template_view_file_name		= null;
	
	/// @brief		template  (string)
	protected $template_view_bindings		= null;
	
	/// @brief		template  (string)
	protected $template_view_tags			= null;
	
	
	// / @brief		Options : get template content from a string constant
	static public $OPTION_TEMPLATE_ENABLED		= "template_enabled";
	
	/// @brief		Options : get template content from a string constant
	static public $OPTION_TEMPLATE_STRING		= "template_string";
	
	/// @brief		Options : get template content from a text file
	static public $OPTION_TEMPLATE_FILE_NAME	= "template_file_name";
	
	/// @brief		Options : get template bindings from a string constant
	static public $OPTION_TEMPLATE_BINDINGS		= "template_bindings";
	
	/// @brief		Options : get template tags from a string constant
	static public $OPTION_TEMPLATE_TAGS			= "template_tags";
	
	
	// / @brief		Options : model name
	static public $OPTION_MODEL_NAME			= "model_name";
	
	
	
	
	/**
	 * @brief		Constructor
	 $ @param[in]	arg_resource_record	resource record
	 * @return		nothing
	 */
	public function __construct($arg_resource_record)
	{
		// Trace::debug('Constructor for view ['.$arg_resource_record[AbstractResource::$RESOURCE_NAME].']');
		
		// VIEW ATTRIBUTES
		$this->view_attributes = $arg_resource_record;
		
		
		// SET BASE RESOURCE ATTRIBUTES
		$this->setResourceName($arg_resource_record[AbstractResource::$RESOURCE_NAME]);
		$this->setResourceType($arg_resource_record[AbstractResource::$RESOURCE_TYPE]);
		$this->setResourceAccess($arg_resource_record[View::$VIEW_ACCESS_ROLE]);
		
		// REGISTER ACCESSES
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'read', $this->getResourceAccess());
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'html_view', $this->getResourceAccess());
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'html_page', $this->getResourceAccess());
		
		
		// SET VIEW RESOURCE ATTRIBUTES
		$this->setViewClass($arg_resource_record[View::$VIEW_CLASS_NAME]);
		if ( array_key_exists(View::$VIEW_PARENT_NAME, $arg_resource_record) )
		{
			$this->setViewParentName($arg_resource_record[View::$VIEW_PARENT_NAME]);
		}
		
		
		// SET INCLUDE ATTRIBUTES
		if ( array_key_exists(View::$INCLUDE_VIEW_FILE_PATH_NAME, $arg_resource_record) )
		{
			$this->setIncludeFilePathName($arg_resource_record[View::$INCLUDE_VIEW_FILE_PATH_NAME]);
		}
		if ( array_key_exists(View::$INCLUDE_VIEW_INLINE_HTML, $arg_resource_record) )
		{
			$this->setIncludeInlineHTML($arg_resource_record[View::$INCLUDE_VIEW_INLINE_HTML]);
		}
		if ( array_key_exists(View::$INCLUDE_VIEW_INLINE_PHP, $arg_resource_record) )
		{
			$this->setIncludeInlinePHP($arg_resource_record[View::$INCLUDE_VIEW_INLINE_PHP]);
		}
		if ( array_key_exists(View::$INCLUDE_VIEW_INLINE_JS, $arg_resource_record) )
		{
			$this->setIncludeInlineJS($arg_resource_record[View::$INCLUDE_VIEW_INLINE_JS]);
		}
		
		
		// SET TEMPLATE ATTRIBUTES
		if ( array_key_exists(View::$OPTION_TEMPLATE_ENABLED, $arg_resource_record) )
		{
			$this->setTemplateIsEnabled($arg_resource_record[View::$OPTION_TEMPLATE_ENABLED]);
		}
		if ( array_key_exists(View::$OPTION_TEMPLATE_STRING, $arg_resource_record) )
		{
			$this->setTemplateString($arg_resource_record[View::$OPTION_TEMPLATE_STRING]);
		}
		if ( array_key_exists(View::$OPTION_TEMPLATE_FILE_NAME, $arg_resource_record) )
		{
			$this->setTemplateFileName($arg_resource_record[View::$OPTION_TEMPLATE_FILE_NAME]);
		}
		if ( array_key_exists(View::$OPTION_TEMPLATE_BINDINGS, $arg_resource_record) )
		{
			$this->setTemplateBindings($arg_resource_record[View::$OPTION_TEMPLATE_BINDINGS]);
		}
		if ( array_key_exists(View::$OPTION_TEMPLATE_TAGS, $arg_resource_record) )
		{
			$this->setTemplateTags($arg_resource_record[View::$OPTION_TEMPLATE_TAGS]);
		}
	}
	
	
	
	/**
	 * @brief		Get view class name
	 * @return		string
	 */
	public function getViewClass()
	{
		return $this->view_class_name;
	}
	
	/**
	 * @brief		Set view class name
	 * @param[in]	arg_view_class	view class name
	 * @return		nothing
	 */
	public function setViewClass($arg_view_class)
	{
		$this->view_class_name = $arg_view_class;
	}
	
	
	
	/**
	 * @brief		Get view parent name
	 * @return		string
	 */
	public function getViewParentName()
	{
		return $this->view_parent_name;
	}
	
	/**
	 * @brief		Set view parent name
	 * @param[in]	arg_view_parent	view parent name
	 * @return		nothing
	 */
	public function setViewParentName($arg_view_parent)
	{
		$this->view_parent_name = $arg_view_parent;
	}
	
	
	
	/**
	 * @brief		Get include view file path name
	 * @return		string
	 */
	public function getIncludeFilePathName()
	{
		return $this->include_view_file_path_name;
	}
	
	/**
	 * @brief		Set include view file path name
	 * @param[in]	arg_file_path_name	file path name
	 * @return		nothing
	 */
	public function setIncludeFilePathName($arg_file_path_name)
	{
		$this->include_view_file_path_name = $arg_file_path_name;
	}
	
	/**
	 * @brief		Get include view inline HTML code
	 * @return		string
	 */
	public function getIncludeInlineHTML()
	{
		return $this->include_view_inline_html;
	}
	
	/**
	 * @brief		Set include view inline HTML code
	 * @param[in]	arg_inline_code		inline code (string)
	 * @return		nothing
	 */
	public function setIncludeInlineHTML($arg_inline_code)
	{
		if ( is_string($arg_inline_code) )
		{
			$this->include_view_inline_html = $arg_inline_code;
		}
	}
	
	/**
	 * @brief		Get include view inline PHP code
	 * @return		string
	 */
	public function getIncludeInlinePHP()
	{
		return $this->include_view_inline_php;
	}
	
	/**
	 * @brief		Set include view inline PHP code
	 * @param[in]	arg_inline_code		inline code (string)
	 * @return		nothing
	 */
	public function setIncludeInlinePHP($arg_inline_code)
	{
		if ( is_string($arg_inline_code) )
		{
			$this->include_view_inline_php = $arg_inline_code;
		}
	}
	
	/**
	 * @brief		Get include view inline JS code
	 * @return		string
	 */
	public function getIncludeInlineJS()
	{
		return $this->include_view_inline_js;
	}
	
	/**
	 * @brief		Set include view inline JS code
	 * @param[in]	arg_inline_code		inline code (string)
	 * @return		nothing
	 */
	public function setIncludeInlineJS($arg_inline_code)
	{
		if ( is_string($arg_inline_code) )
		{
			$this->include_view_inline_js = $arg_inline_code;
		}
	}
	
	
	
	/**
	 * @brief		Is template enabled
	 * @return		boolean
	 */
	public function getTemplateIsEnabled()
	{
		// if ( is_bool($this->template_view_is_enabled) && ! $this->template_view_is_enabled )
		// {
			// return 'false';
		// }
		return $this->template_view_is_enabled;
	}
	
	/**
	 * @brief		Set template enabled
	 * @param[in]	arg_template_is_enabled
	 * @return		boolean
	 */
	public function setTemplateIsEnabled($arg_template_is_enabled)
	{
		$this->template_view_is_enabled = $arg_template_is_enabled;
		// if ($this->template_view_is_enabled === '')
		// {
			// $this->template_view_is_enabled = false;
		// }
	}
	
	
	
	/**
	 * @brief		Get template string
	 * @return		string
	 */
	public function getTemplateString()
	{
		return $this->template_view_string;
	}
	
	/**
	 * @brief		Set template string
	 * @param[in]	arg_template_string
	 * @return		nothing
	 */
	public function setTemplateString($arg_template_string)
	{
		return $this->template_view_string = $arg_template_string;
	}
	
	
	
	/**
	 * @brief		Get template file name
	 * @return		string
	 */
	public function getTemplateFileName()
	{
		return $this->template_view_file_name;
	}
	
	/**
	 * @brief		Set template file name
	 * @param[in]	arg_template_file_path_name
	 * @return		nothing
	 */
	public function setTemplateFileName($arg_template_file_path_name)
	{
		return $this->template_view_file_name = $arg_template_file_path_name;
	}
	
	
	
	/**
	 * @brief		Get template bindings
	 * @return		string
	 */
	public function getTemplateBindings()
	{
		return $this->template_view_bindings;
	}
	
	/**
	 * @brief		Set template bindings
	 * @param[in]	arg_template_bindings
	 * @return		nothing
	 */
	public function setTemplateBindings($arg_template_bindings)
	{
		return $this->template_view_bindings = $arg_template_bindings;
	}
	
	
	
	/**
	 * @brief		Get template tags
	 * @return		string
	 */
	public function getTemplateTags()
	{
		return $this->template_view_tags;
	}
	
	/**
	 * @brief		Set template tags
	 * @param[in]	arg_template_bindings
	 * @return		nothing
	 */
	public function setTemplateTags($arg_template_tags)
	{
		return $this->template_view_tags = $arg_template_tags;
	}
	
	
	
	/**
	 * @brief		Get model name
	 * @return		string|null
	 */
	public function getModelName()
	{
		return array_key_exists(View::$OPTION_MODEL_NAME, $this->view_attributes) ? $this->view_attributes[View::$OPTION_MODEL_NAME] : null;
	}
	
	
	
	/**
	 * @brief		Test if the view has a model name
	 * @return		boolean
	 */
	public function hasModelName()
	{
		return is_string( $this->getModelName() );
	}
	
	
	
	/**
	 * @brief		Get view attribute
	 * @param[in]	arg_attribute_name
	 * @return		string|null
	 */
	public function getAttributeName($arg_attribute_name)
	{
		return array_key_exists($arg_attribute_name, $this->view_attributes) ? $this->view_attributes[$arg_attribute_name] : null;
	}
}

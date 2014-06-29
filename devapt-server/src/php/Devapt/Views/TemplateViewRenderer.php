<?php
/**
 * @file        TemplateViewRenderer.php
 * @brief       Template views renderer
 * @details     ...
 * @see			...
 * @ingroup     VIEWS
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		
 */

namespace Devapt\Views;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Application\Application;
// use Devapt\Security\Authentication;
use Devapt\Security\Authorization;

final class TemplateViewRenderer
{
	// STATIC ATTRIBUTES
	static public $TRACE_TEMPLATE_VIEW_RENDERER		= false;
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Render an include view
     * @param[in]	arg_view_resource	view resource object (View)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		string
	 */
	static public function render($arg_view_resource, $arg_response)
	{
		// CHECK ARGS
		if ( is_null($arg_view_resource) )
		{
			Trace::warning('TemplateViewRenderer::render: resource object is null');
			return null;
		}
		
		// TEMPLATE FILE
		$file_path_name = $arg_view_resource->getTemplateFilePathName();
		if ( is_string($file_path_name) && $file_path_name !== '' )
		{
			return self::render_file($file_path_name, $arg_response);
		}
		
		// TEMPLATE STRING
		$template_string = $arg_view_resource->getTemplateString();
		if ( is_string($template_string) && $template_string !== '' )
		{
			return self::render_string($template_string, $arg_response);
		}
		
		Trace::warning("TemplateViewRenderer::render: bad view configuration for resource [$arg_view_resource]");
		return null;
	}
	
	
	
	/**
	 * @brief		Render a template view from a string
     * @param[in]	arg_template_string		template string (string)
     * @param[in]	arg_response			response object (ResponseInterface)
	 * @return		string
	 */
	static public function render_string($arg_template_string, $arg_response)
	{
		// CHECK ARGS
		if ( ! is_string($arg_template_string) )
		{
			Trace::warning('TemplateViewRenderer::render_string: template arg is not a string');
			return null;
		}
		
		// INIT BUFFER
		$buffer = $arg_template_string;
		
		// SEARCH TAGS
		$tags = array();
		$result = preg_match_all('/\{\{[a-z\.\_\-0-9A-Z]+\}\}/', $buffer, $tags, PREG_PATTERN_ORDER, 0);
		if ( $result === 0 )
		{
			Trace::info("TemplateViewRenderer::render_string: template render success (no tags)", self::$TRACE_TEMPLATE_VIEW_RENDERER);
			return $buffer;
		}
		if ( $result === FALSE )
		{
			Trace::warning('TemplateViewRenderer::render_string: template string is not a valid template string');
			return null;
		}
		$tags = $tags[0];
		
		
		// SET TAGS MAP
		$replaces = array();
		foreach($tags as $tag)
		{
			// CHECK TAG
			if ( strlen($tag) <= 4 )
			{
				Trace::warning('TemplateViewRenderer::render_string: bad template tag ['.$tag.']');
				$replaces[] = '<!-- bad template tag -->';
				continue;
			}
			
			// GET TAG LABEL
			$tag_label = substr($tag, 2, strlen($tag) - 4);
			
			// GET TAG VALUE
			$replaces[] = self::process_tag($tag_label, $arg_response);
		}
		
		
		// REPLACE TAGS
		$buffer = str_replace($tags, $replaces, $buffer);
		
		Trace::info("TemplateViewRenderer::render_string: template render success with [$result] tags", self::$TRACE_TEMPLATE_VIEW_RENDERER);
		return $buffer;
	}
	
	
	
	/**
	 * @brief		Get a tag value from a tag label
     * @param[in]	arg_tag_label		tag label (string)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		string
	 */
	static protected function process_tag($arg_tag_label, $arg_response)
	{
		// SEARCH TAG VALUE IN APPLICATION CONFIGURATION
		if ( Application::getInstance()->getConfig()->hasAttribute($arg_tag_label) )
		{
			return Application::getInstance()->getConfig()->getAttribute($arg_tag_label, '<!-- bad configuration value for tag ['.$arg_tag_label.'] -->');
		}
		
		
		// SEARCH TAG VALUE IN APPLICATION RESOURCES
		if ( \Devapt\Resources\Broker::hasResourceObject($arg_tag_label) )
		{
			$resource_object = \Devapt\Resources\Broker::getResourceObject($arg_tag_label);
			$resource_type = $resource_object->getResourceType();
			$resource_name = $resource_object->getResourceName();
			Trace::debug('TemplateViewRenderer::render_string: get resource ['.$resource_name.'] of type ['.$resource_type.']', self::$TRACE_TEMPLATE_VIEW_RENDERER);
			
			// CHECK ACCESS
			if ( Authorization::isEnabled() )
			{
				if ( ! \Devapt\Security\Authorization::checkLogged($resource_name, 'html_view') )
				{
					Trace::warning('TemplateViewRenderer::render_string: no authorization to display resource ['.$resource_name.']');
					return '<!-- bad resource authorization "html_view" for tag ['.$arg_tag_label.'] -->';
				}
			}
			
			// DISPLAY RESOURCE
			switch($resource_type)
			{
				case 'view':
				{
					// SAVE RESPONSE CONTENT
					$response_content = $arg_response->getContent();
					$arg_response->setContent('');
					
					// RENDER VIEW
					$result = ViewRenderer::render($resource_object, 'html_view', $resource_name, null, $arg_response);
					if (! $result)
					{
						Trace::warning('TemplateViewRenderer: Render view failed ['.$resource_name.']');
						return '<!-- render view failed for resource tag ['.$arg_tag_label.'] -->';
					}
					
					// RESTORE RESPONSE CONTENT
					$view_content = $arg_response->getContent();
					$arg_response->setContent($response_content);
					return $view_content;
				}
				
				case 'menubar':
				{
					// SAVE RESPONSE CONTENT
					$response_content = $arg_response->getContent();
					$arg_response->setContent('');
					
					// RENDER VIEW
					$result = MenubarRenderer::render($resource_object, 'menubar', $resource_name, null, $arg_response);
					if (! $result)
					{
						Trace::warning('TemplateViewRenderer: Render menubar failed ['.$resource_name.']');
						return '<!-- render menubar failed for resource tag ['.$arg_tag_label.'] -->';
					}
					
					// RESTORE RESPONSE CONTENT
					$menubar_content = $arg_response->getContent();
					$arg_response->setContent($response_content);
					return $menubar_content;
				}
			}
		}
		
		// UNKNOW TAG
		Trace::warning('TemplateViewRenderer::render_string: unknow template tag ['.$arg_tag_label.']');
		return '<!-- unknow template tag ['.$arg_tag_label.'] -->';
	}
	
	
	
	/**
	 * @brief		Render a template view from a string
     * @param[in]	arg_file_path_name		template file path name (string)
     * @param[in]	arg_response			response object (ResponseInterface)
	 * @return		string
	 */
	static public function render_file($arg_file_path_name, $arg_response)
	{
		// CHECK ARGS
		if ( ! is_string($arg_file_path_name) || $arg_file_path_name === '' )
		{
			Trace::warning('TemplateViewRenderer::render_file: template arg is not a valid string');
			return null;
		}
		
		
		// SEARCH THE FILE IN APPLICATION AND MODULES
		$file_path_name = Application::getInstance()->searchResourceFile($arg_file_path_name);
		
		
		
		// CHECK FILE
		if ( ! file_exists($file_path_name) )
		{
			Trace::warning("TemplateViewRenderer::render_file: file path name [$file_path_name] not found");
			return null;
		}
		if ( ! is_readable($file_path_name) )
		{
			Trace::warning("TemplateViewRenderer::render_file: file path name [$file_path_name] is not readable");
			return null;
		}
		
		
		// PHP TEMPLATE FILE
		$php_suffix = "php.template";
		$file_suffix = substr($file_path_name, - strlen($php_suffix));
		if ($file_suffix === $php_suffix)
		{
			ob_start();
			require $file_path_name;
			$buffer = ob_get_clean();
			
			Trace::info("TemplateViewRenderer::render_file: PHP file template success [$file_path_name]", self::$TRACE_TEMPLATE_VIEW_RENDERER);
			return self::render_string($buffer, $arg_response);
		}
		
		
		// HTML TEMPLATE FILE
		$html_suffix = "html.template";
		$file_suffix = substr($file_path_name, - strlen($html_suffix));
		if ($file_suffix === $html_suffix)
		{
			// OPEN FILE
			$handle = @fopen($file_path_name, "r");
			if ( $handle === FALSE )
			{
				Trace::warning("TemplateViewRenderer::render_file: file path name [$file_path_name] opening failed");
				return null;
			}
			
			// READ FILE
			$content = '';
			while ( ($buffer = fgets($handle, 4096)) !== false)
			{
				$content .= $buffer;
			}
			if ( ! feof($handle) )
			{
				Trace::warning("TemplateViewRenderer::render_file: file path name [$file_path_name] reading ending with error");
				return null;
			}
			
			// CLOSE FILE
			fclose($handle);
			
			Trace::info("TemplateViewRenderer::render_file: HTML file template success [$file_path_name]", self::$TRACE_TEMPLATE_VIEW_RENDERER);
			return self::render_string($content, $arg_response);
		}
		
		Trace::warning("TemplateViewRenderer::render_file: bad template view configuration for resource [$arg_view_resource]");
		return null;
	}
}

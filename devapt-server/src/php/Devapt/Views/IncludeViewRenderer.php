<?php
/**
 * @file        IncludeViewRenderer.php
 * @brief       Include views renderer
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

// DEBUG
use Devapt\Core\Trace;

final class IncludeViewRenderer
{
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
			Trace::warning('IncludeViewRenderer::render: resource object is null');
			return null;
		}
		
		// RENDER INLINE HTML
		$inline_code = $arg_view_resource->getIncludeInlineHTML();
		if ( is_string($inline_code) && $inline_code != '')
		{
			Trace::info('IncludeViewRenderer::render: Inline HTML code is valid');
			return $inline_code;
		}
		
		// RENDER INLINE PHP
		$inline_code = $arg_view_resource->getIncludeInlinePHP();
		if ( is_string($inline_code) && $inline_code != '')
		{
			Trace::info('IncludeViewRenderer::render: Inline PHP code is valid');
			return eval($inline_code);
		}
		
		// RENDER INLINE JS
		$inline_code = $arg_view_resource->getIncludeInlineJS();
		if ( is_string($inline_code) && $inline_code != '')
		{
			Trace::info('IncludeViewRenderer::render: Inline JS code is valid');
			return '<script type="text/javascript">'.$inline_code.'\n</script>';
		}
		
		// CHECK INCLUDE FILE
		$file_path_name = $arg_view_resource->getIncludeFilePathName();
		if ( ! is_string($file_path_name) || $file_path_name === '' )
		{
			Trace::warning("IncludeViewRenderer::render: file path name [$file_path_name] not a valid string in application [$app_file_path_name] and modules [$modules_file_path_name]");
			return null;
		}
		
		// SEARCH INCLUDE FILE
		if ( ! file_exists($file_path_name) )
		{
			$app_file_path_name = DEVAPT_APP_PRIVATE_ROOT.$file_path_name;
			
			if ( ! file_exists($app_file_path_name) )
			{
				$modules_file_path_name = DEVAPT_MODULES_ROOT.$file_path_name;
				
				if ( ! file_exists($modules_file_path_name) )
				{
					Trace::warning("IncludeViewRenderer::render: file path name [$file_path_name] not found in application [$app_file_path_name] and modules [$modules_file_path_name]");
					return null;
				}
				else
				{
					$file_path_name = $modules_file_path_name;
				}
			}
			else
			{
				$file_path_name = $app_file_path_name;
			}
		}
		if ( ! file_exists($file_path_name) )
		{
			Trace::warning("IncludeViewRenderer::render: file path name [$file_path_name] not found");
			return null;
		}
		if ( ! is_readable($file_path_name) )
		{
			Trace::warning("IncludeViewRenderer::render: file path name [$file_path_name] is not readable");
			return null;
		}
		
		
		// PHP INCLUDE FILE
		$php_suffix = "php.include";
		$file_suffix = substr($file_path_name, - strlen($php_suffix));
		if ($file_suffix === $php_suffix)
		{
			ob_start();
			require $file_path_name;
			$buffer = ob_get_clean();
			
			Trace::info("IncludeViewRenderer::render: PHP file success [$file_path_name]");
			return $buffer;
		}
		
		
		// HTML INCLUDE FILE
		$html_suffix = "html.include";
		$file_suffix = substr($file_path_name, - strlen($html_suffix));
		if ($file_suffix === $html_suffix)
		{
			// OPEN FILE
			$handle = @fopen($file_path_name, "r");
			if ( $handle === FALSE )
			{
				Trace::warning("IncludeViewRenderer::render: file path name [$file_path_name] opening failed");
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
				Trace::warning("IncludeViewRenderer::render: file path name [$file_path_name] reading ending with error");
				return null;
			}
			
			// CLOSE FILE
			fclose($handle);
			
			Trace::info("IncludeViewRenderer::render: HTML file success [$file_path_name]");
			return $content;
		}
		
		Trace::warning("IncludeViewRenderer::render: bad view configuration for resource [$arg_view_resource]");
		return null;
	}
}

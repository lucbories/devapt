<?php
/**
 * @file        ViewController.php
 * @brief       Controller implementation for resources of type View
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2014-01-18
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 */

namespace Devapt\Application;

// DEBUG
// use Zend\Debug\Debug;
use Devapt\Core\Trace;

// RESOURCES
use Devapt\Resources\Broker as ResourcesBroker;
use Devapt\Resources\View as ViewResource;
use Devapt\Views\ViewRenderer;
use Devapt\Views\PageHeaderViewRenderer;
use Devapt\Views\PageFooterViewRenderer;

class ViewController extends AbstractController
{
    /**
     * Constructor
     */
    public function __construct()
    {
		$this->has_action_attribute = true;
    }
	
	
	
	public function doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// CHECK ACTION NAME
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning("ViewController: Controller has no action name for resource [$arg_resource_name]");
			return false;
		}
		
		// CHECK AUTORIZATION
		if ( ! $this->authorization_is_cheched && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
		{
			Trace::warning("ViewController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
			return false;
		}
		
		// GET VIEW RESOURCE OBJECT
		$view_resource = ResourcesBroker::getResourceObject($arg_resource_name);
		if ( is_null($view_resource) )
		{
			Trace::warning('ViewController: Resource not found ['.$arg_resource_name.']');
			return false;
		}
		
		// PAGE HEADER
		if ($arg_action_name === 'html_page')
		{
			$page_header_content = PageHeaderViewRenderer::render('default', $arg_response);
			$arg_response->setContent($page_header_content);
		}
		
		// RENDER VIEW
		$result = ViewRenderer::render($view_resource, $arg_action_name, $arg_id, $arg_request, $arg_response);
		if (! $result)
		{
			Trace::warning('ViewController: Render view failed ['.$arg_resource_name.']');
			return false;
		}
		
		// RENDER JS
		JsWrapper::initJsViewsResources($arg_response);
		if ($arg_action_name === 'html_page')
		{
			JsWrapper::initJsPageResources($arg_response);
		}
		
		// PAGE FOOTER
		if ($arg_action_name === 'html_page')
		{
			$content = $arg_response->getContent();
			$page_footer_content = PageFooterViewRenderer::render('default', $arg_response);
			$arg_response->setContent($content.$page_footer_content);
		}
		
		// SEND RENDERED VIEW
		$arg_response->send();
		
		Trace::info('ViewController: Render view success ['.$arg_resource_name.']');
		return true;
	}
}
/*
JSON RESPONSE

        $response->setContent($result);
        $headers = $response->getHeaders();

        if ($this->renderer->hasJsonpCallback()) {
            $contentType = 'application/javascript';
        } else {
            $contentType = 'application/json';
        }

        $contentType .= '; charset=' . $this->charset;
        $headers->addHeaderLine('content-type', $contentType);

        if (in_array(strtoupper($this->charset), $this->multibyteCharsets)) {
            $headers->addHeaderLine('content-transfer-encoding', 'BINARY');
        }
	*/
/* use Zend\Json\Json as JsonFormatter;
	public function __invoke($data, array $jsonOptions = array())
    {
        $data = JsonFormatter::encode($data, null, $jsonOptions);

        if ($this->response instanceof Response) {
            $headers = $this->response->getHeaders();
            $headers->addHeaderLine('Content-Type', 'application/json');
        }

        return $data;
    }
*/
/*
FEED RESPONSE
 $feedType = ('rss' == $feedType)
                  ? 'application/rss+xml'
                  : 'application/atom+xml';

        $model   = $e->getModel();
        $charset = '';

        if ($model instanceof Model\FeedModel) {

            $feed = $model->getFeed();

            $charset = '; charset=' . $feed->getEncoding() . ';';
        }

        // Populate response
        $response = $e->getResponse();
        $response->setContent($result);
        $headers = $response->getHeaders();
        $headers->addHeaderLine('content-type', $feedType . $charset);
*/
/* $encodedResult = json_encode(
                $valueToEncode,
                JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
            );
*/
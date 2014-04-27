<?php
/**
 * @file        ModelController.php
 * @brief       Controller implementation for resources of type Model
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
use Devapt\Resources\Model as ModelResource;
use Devapt\Models\ModelRenderer;
use Devapt\Models\PageHeaderModelRenderer;
use Devapt\Models\PageFooterModelRenderer;

use Zend\Json\Json as JsonFormatter;

class ModelController extends AbstractController
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
			Trace::warning("ModelController: Controller has no action name for resource [$arg_resource_name]");
			return false;
		}
		
		// CHECK AUTORIZATION
		if ( ! $this->authorization_is_cheched && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
		{
			Trace::warning("ModelController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
			return false;
		}
		
		// GET VIEW RESOURCE OBJECT
		$model_resource = ResourcesBroker::getResourceObject($arg_resource_name);
		if ( is_null($model_resource) )
		{
			Trace::warning('ModelController: Resource not found ['.$arg_resource_name.']');
			return false;
		}
		
		// PAGE HEADER
		if ($arg_action_name === 'read')
		{
			// GET READ OPTIONS
			$response_format	= 'json'; // json/jsonp
			$select_mode		= 'select';
			$fields				= null;
			$filters			= '';
			$orders_by			= '';
			$slice_offset		= 0;
			$slice_length		= 1000;
			$charset			= 'utf-8';
			$contentType		= 'application/json';
			// $contentType	= 'application/javascript';
			$contentType		.= '; charset=' . $charset;
			$multibyteCharsets	= array(); // ???
			
			// GET DATAS
			// $result = array('a', 'b', 'c');
			$result = $model_resource->read($arg_id, $arg_request);
			
			// JSON RESPONSE
			$jsonOptions = null;
			$result_string = JsonFormatter::encode($result, null, $jsonOptions);
			$arg_response->setContent($result_string);
			$headers = $arg_response->getHeaders();
			$headers->addHeaderLine('content-type', $contentType);
			
			if ( in_array(strtoupper($charset), $multibyteCharsets) )
			{
				$headers->addHeaderLine('content-transfer-encoding', 'BINARY');
			}
			
			$arg_response->send();
			
			// print_r( $model_resource->getModelCrudTableName() );
			// print_r( $model_resource->getModelConnexionName() );
		}
		
		Trace::info('ModelController: Render model success ['.$arg_resource_name.']');
		return true;
	}
}
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
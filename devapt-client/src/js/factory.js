/**
 * @file        factory.js
 * @desc        Devapt factory
 * @ingroup     DEVAPT_CORE
 * @date        2014-06-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['core/traces', 'core/types'],
function(DevaptTraces, DevaptTypes)
{
	/**
	 * @memberof	DevaptFactory
	 * @public
	 * @class
	 * @desc		Devapt factory container
	 */
	var DevaptFactory = function() {};
	
	
	/**
	 * @memberof	DevaptFactory
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptFactory.factory_trace = false;
	
	
	
	/**
	 * @memberof				DevaptFactory
	 * @public
	 * @static
	 * @method					DevaptFactory.get_class_require(arg_class_name)
	 * @desc					Get resource dependencies
	 * @param {string}			arg_class_name		resource class name
	 * @param {string}			arg_backend_path	backend relative path
	 * @return {array}			array of require file paths
	 */
	DevaptFactory.get_class_require = function(arg_class_name, arg_backend_path)
	{
		var context = 'DevaptFactory.get_class_require(class name,path)';
		DevaptTraces.trace_enter(context, '', DevaptFactory.factory_trace);
		
		
		// INIT DEPENDANCIES ARRAY
		var view_requires = [];
		
		// CHECK CLASS NAME
		if ( ! DevaptTypes.is_not_empty_str(arg_class_name) )
		{
			DevaptTraces.trace_var(context, 'resource bad class name', arg_class_name, DevaptFactory.factory_trace);
			DevaptTraces.trace_leave(context, 'resource bad class name', DevaptFactory.factory_trace);
			return view_requires;
		}
		
		// SWITCH CLASS NAME
		switch(arg_class_name)
		{
			// DATAS
			case 'ResultSet':
			case 'DevaptResultSet':
			{
				view_requires = ['datas/storage/resultset'];
				break;
			}
			
			case 'StorageJson':
			case 'DevaptStorageJson':
			{
				view_requires = ['datas/storage/storage-json'];
				break;
			}
			
			case 'StorageArray':
			case 'DevaptStorageArray':
			{
				view_requires = ['datas/storage/storage-array'];
				break;
			}
			
			case 'model':
			case 'Model':
			case 'DevaptModel':
			{
				view_requires = ['datas/model/model'];
				break;
			}
			
			case 'ViewModel':
			case 'DevaptViewModel':
			{
				view_requires = ['datas/model/view_model'];
				break;
			}
			
			case 'RecordSet':
			case 'DevaptRecordSet':
			{
				view_requires = ['datas/model/recordset'];
				break;
			}
			
			
			case 'timer':
			case 'Timer':
			case 'DevaptTimer':
			{
				view_requires = ['worker/timer'];
				break;
			}
			
			
			// CORE CLASSES
			
			case 'View':
			case 'DevaptView':
			{
				view_requires = ['views/view'];
				break;
			}
			
			case 'IncludeView':
			case 'DevaptIncludeView':
			case 'TemplateView':
			case 'DevaptTemplateView':
			{
				view_requires = ['views/remote'];
				break;
			}
			
			case 'Select':
			case 'DevaptSelect':
			{
				view_requires = ['views/select'];
				break;
			}
			
			case 'Input':
			case 'DevaptInput':
			{
				view_requires = ['views/input'];
				break;
			}
		}
		
		// NO BACKEND PATH
		if (! arg_backend_path || arg_backend_path.length === 0)
		{
			if (view_requires && view_requires.length > 0)
			{
				DevaptTraces.trace_leave(context, 'resource class found', DevaptFactory.factory_trace);
				return view_requires;
			}
			
			DevaptTraces.trace_leave(context, 'resource type not found', DevaptFactory.factory_trace);
			return view_requires;
		}
		
		
		// LOOKUP VIEW CLASS IN BACKEND
		
		// SWITCH CLASS NAME
		switch(arg_class_name)
		{	
			case 'Label':
			case 'DevaptLabel':
			{
				view_requires = [arg_backend_path + '/views/label'];
				break;
			}
			
			case 'Button':
			case 'DevaptButton':
			{
				view_requires = [arg_backend_path + '/views/button'];
				break;
			}
			
			case 'ButtonGroup':
			case 'DevaptButtonGroup':
			{
				view_requires = [arg_backend_path + '/views/button-group'];
				break;
			}
			
			case 'ButtonBar':
			case 'DevaptButtonBar':
			{
				view_requires = [arg_backend_path + '/views/button-bar'];
				break;
			}
			
			case 'Image':
			case 'DevaptImage':
			{
				view_requires = [arg_backend_path + '/views/image'];
				break;
			}
			
			case 'Breadcrumbs':
			case 'DevaptBreadcrumbs':
			{
				view_requires = [arg_backend_path + '/views/breadcrumbs'];
				break;
			}
			
			case 'Panel':
			case 'DevaptPanel':
			{
				view_requires = [arg_backend_path + '/views/panel'];
				break;
			}
			
			case 'menubar':
			case 'Menubar':
			case 'DevaptMenubar':
			{
				view_requires = [arg_backend_path + '/views/menubar'];
				break;
			}
			
			case 'Pagination':
			case 'DevaptPagination':
			{
				view_requires = [arg_backend_path + '/views/pagination'];
				break;
			}
			
			
			// BACKEND CONTAINER CLASSES
			
			case 'Row':
			case 'DevaptRow':
			{
				view_requires = [arg_backend_path + '/containers/row'];
				break;
			}
			
			case 'List':
			case 'DevaptList':
			{
				view_requires = [arg_backend_path + '/containers/list'];
				break;
			}
			
			case 'NavMenu':
			case 'DevaptNavMenu':
			{
				view_requires = [arg_backend_path + '/containers/navmenu'];
				break;
			}
			
			
			case 'Dropdown':
			case 'DevaptDropdown':
			{
				view_requires = [arg_backend_path + '/containers/dropdown'];
				break;
			}
			
			case 'Tabs':
			case 'DevaptTabs':
			{
				view_requires = [arg_backend_path + '/containers/tabs'];
				break;
			}
			
			case 'Accordion':
			case 'DevaptAccordion':
			{
				view_requires = [arg_backend_path + '/containers/accordion'];
				break;
			}
			
			case 'Table':
			case 'DevaptTable':
			{
				view_requires = [arg_backend_path + '/containers/table'];
				break;
			}
			
			case 'HBox':
			case 'DevaptHBox':
			{
				view_requires = [arg_backend_path + '/containers/hbox'];
				break;
			}
			
			case 'VBox':
			case 'DevaptVBox':
			{
				view_requires = [arg_backend_path + '/containers/vbox'];
				break;
			}
			
			case 'PGrid':
			case 'DevaptPGrid':
			{
				view_requires = [arg_backend_path + '/containers/pgrid'];
				break;
			}
			
			case 'RCGrid':
			case 'DevaptRCGrid':
			{
				view_requires = [arg_backend_path + '/containers/rcgrid'];
				break;
			}
			
			
			default:
			{
				DevaptTraces.trace_leave(context, 'resource type not found', DevaptFactory.factory_trace);
				return view_requires;
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'resource class found', DevaptFactory.factory_trace);
		return view_requires;
	}
	
	
	return DevaptFactory;
} );
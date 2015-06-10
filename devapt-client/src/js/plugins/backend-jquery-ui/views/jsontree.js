/**
 * @file        plugins/backend-jquery-ui/views/jsontree.js
 * @desc        JQuery UI JSON tree class
 * @ingroup     DEVAPT_JQUERY_UI
 * @date        2015-05-27
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/view', 'jquery-ui'/*, '../lib/jsontree/jsontree'*/],
function(Devapt, DevaptTypes, DevaptClass, DevaptView, undefined)
{
	/**
	 * @public
	 * @class				DevaptJsonTree
	 * @desc				Label view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	
	function Tree(el, arg_root_name)
	{
		var context = 'DevaptJsonTree.Tree';
		var root_name = arg_root_name ? arg_root_name : 'root node';
		
		var $el = $(el);
		$el.addClass('tree-cont');
		$el.on('click', '.tree-obj-caption',
			function(e)
			{
				$(e.currentTarget).parent().toggleClass('tree-expand');
			}
		);
		
		var deep = 0;
		
		var beginNode = function(name, id)
		{
			return '<div id="' + id + '">' +
					'<div class="tree-obj-caption">' + 
						'<span class="tree-closed"><span class="tree-bullet"><span>\u25B9</span></span>' +
							name + ': ' + '</span>' +
							'<span class="tree-opened"><span class="tree-bullet"><span>\u25BF</span></span>' +
						name + '</span></div>' +
					'<div class="tree-children tree-opened">';
		};
		
		var endNode = function(name, id)
		{
			return '</div></div>';
		};
		
		var toTree = function(name, obj, id)
		{
			console.log(obj, context + ':render tree node deep=[' + deep + '] name=[' + name + '] id=[' + id + ']');
			deep++;
			
			// WATCHDOG
			if (deep > 10)
			{
				console.error('too many calls', context);
				return;
			}
			
			// debugger;
			
			var node_str = '';
			
			if ( DevaptTypes.is_null(obj) )
			{
				node_str = 'null';
			}
			else if ( DevaptTypes.is_string(obj) )
			{
				node_str = obj;
			}
			else if ( DevaptTypes.is_number(obj) )
			{
				node_str = obj;
			}
			else if ( DevaptTypes.is_boolean(obj) )
			{
				node_str = (obj ? 'true' : 'false');
			}
			else if ( DevaptTypes.is_function(obj) )
			{
				node_str = 'function';
			}
			else if ( DevaptTypes.is_array(obj) && obj.length === 0)
			{
				node_str = '[]';
			}
			else if ( DevaptTypes.is_plain_object(obj) && obj.length === 0)
			{
				node_str = '{}';
			}
			else if (typeof(obj) === 'object')
			{
				id += '_' + name;
				
				var res = beginNode(name, id);
				
				// RENDER A DEVAPT OBJECT
				if ( ('_class' in obj) &&  DevaptTypes.is_object(obj._class) && DevaptTypes.is_string(obj.class_name) )
				{
					console.log('Devapt object', context + ':render tree node deep=[' + deep + '] name=[' + name + '] id=[' + id + ']');
					
					res += '<div class="tree-child">' + 'object name:' + obj.name + '</div>';
					res += '<div class="tree-child">' + 'class name:' + obj.class_name + '</div>';
					
					// RENDER PROPERTIES
					res += beginNode('properties', id + '_properties');
					var properties_records = obj._class.properties.all_map;
					for(var property_name in properties_records)
					{
						// var property_record = properties_records[property_name];
						var obj_attribute = property_name in obj ? obj[property_name] : 'undefined';
						obj_attribute = (obj_attribute === null) ? 'null' : obj_attribute;
						
						res += '<div class="tree-child">';
						res += toTree(property_name, obj_attribute, id);
						res += '</div>';
					}
					res += endNode('properties', id + '_properties');
					
					// RENDER METHODS
					res += beginNode('methods', id + '_methods');
					var methods_records = obj._class.methods.all_map;
					for(var property_name in methods_records)
					{
						res += '<div class="tree-child">';
						res += property_name;
						res += '</div>';
					}
					res += endNode('methods', id + '_methods');
				}
				
				// RENDER A CLASS OBJECT
				else if ( obj.is_class && DevaptTypes.is_object(obj.infos) && DevaptTypes.is_boolean(obj.is_build) )
				{
					console.log('DevaptClass object', context + ':render tree node deep=[' + deep + '] name=[' + name + '] id=[' + id + ']');
					
					res += toTree('class.infos', obj.infos.class_name, id);
				}
				
				// RENDER A CLASS OBJECT
				else if ( DevaptTypes.is_array(obj) )
				{
					console.log('Array object', context + ':render tree node deep=[' + deep + '] name=[' + name + '] id=[' + id + ']');
					
					if (obj.length === 0)
					{
						res += '[]';
					}
					else
					{
						for(var index = 0 ; index < obj.length ; index++)
						{
							res += toTree('[' + index + ']', obj[index], id);
						}
					}
				}
				
				// RENDER A PLAIN OBJECT
				else if ( DevaptTypes.is_plain_object(obj) )
				{
					console.log('plain object', context + ':render tree node deep=[' + deep + '] name=[' + name + '] id=[' + id + ']');
					
					$.each(obj, function(key, val)
						{
							res += '<div class="tree-child">' + toTree(key, val, id) + '</div>';
						}
					);
				}
				
				// RENDER AN UNKNOW OBJECT
				else
				{
					res += '<div class="tree-child">' + 'undefined node type' + '</div>';
					console.error(obj, context + ':obj is an undefined node');
				}
				
				res += endNode(name, id);
				deep--;
				return res;
			}
			else
			{
				node_str = obj;
			}
			
			deep--;
			return '<div class="tree-simple">' + name + ': ' + node_str + '</div>';
		};

		this.set = function(obj)
		{
			deep = 0;
			var expanded = $el.find('.tree-expand').toArray().map(function(el) { return el.getAttribute('id'); });
			$el.html(toTree(root_name, obj, self.name + '_nodes_'));
			$(expanded.map(function(e) { return '#' + e }).join(', ')).addClass('tree-expand');
		}
	};

	
	/**
	 * @public
	 * @memberof			DevaptJsonTree
	 * @desc				Render view
	 * @param {object}		arg_tree_datas		hierchycal object
	 * @return {boolean}
	 */
	var cb_set_tree_datas = function(arg_tree_datas)
	{
		var self = this;
		var context = 'set_tree_datas(tree datas)';
		self.enter(context, '');
		
		
		self.tree.set(arg_tree_datas);
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptJsonTree
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
		// self.trace=true;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		// SET TREE STYLE
		var style_jqo = $('<style>\
			.tree-cont{cursor: default;}\
			.tree-obj-caption {cursor: pointer;}\
			.tree-opened {display: none;}\
			.tree-expand > .tree-opened {display: block;}\
			.tree-expand > .tree-closed {display: none;}\
			.tree-children {margin-left: 10px;}\
			.tree-bullet {position: relative;}\
			.tree-bullet > span {position: absolute;left: -0.7em;}\
			</style>');
		$('head').append(style_jqo);
		
		// CREATE TREE CONTAINER
		var id = self.name + '_view_id';
		self.content_jqo = $('<div>');
		self.content_jqo.attr('id', id);
		self.parent_jqo.append(self.content_jqo);
		
		// CREATE TREE OBJECT
		self.tree = new Tree('#' + id, self.root_name);
		
		// DEBUG
		// self.set_tree_datas(self);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return Devapt.promise_resolved();
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-05-27',
			'updated':'2015-06-10',
			'description':'A JSON tree view class.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptJsonTreeClass = new DevaptClass('DevaptJsonTree', parent_class, class_settings);
	
	// METHODS
	DevaptJsonTreeClass.add_public_method('set_tree_datas', {}, cb_set_tree_datas);
	DevaptJsonTreeClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	// DevaptJsonTreeClass.add_public_str_property('content',	'',		null, false, false, []);
	DevaptJsonTreeClass.add_public_str_property('root_name',	'',		null, false, false, []);
	
	
	return DevaptJsonTreeClass;
} );
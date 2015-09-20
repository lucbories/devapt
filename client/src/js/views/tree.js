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
	 * @class				DevaptTree
	 * @desc				Tree view class
	 */
	
	var $ = window.$;
	
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Map of renderer function: aaa_renderer(node label, node value)
	 */
	// var node_renderers = {};
	
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Max rendering calls stack size
	 */
	// var max_deep_rendering = 10;
	
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Current rendering calls stack size
	 */
	// var current_deep_rendering = 10;
	
	
	var begin_node = function(self, name, id)
	{
		return '<div id="' + id + '">' +
					'<div id="' + id + '_caption" class="tree-obj-caption">' + 
						'<span id="' + id + '_caption_closed" class="tree-closed"> <span class="tree-bullet"> <span>\u25B9</span> </span>' + name + '</span>' +
						'<span id="' + id + '_caption_opened" class="tree-opened"> <span class="tree-bullet"> <span>\u25BF</span> </span>' + name + '</span>' +
					'</div>' +
					'<div class="tree-children tree-opened">';
		/*return '<div id="' + id + '">' +
					'<div class="tree-obj-caption">' + 
						'<span class="tree-opened"> <span class="tree-bullet"> <span>\u25B9</span> </span>' + name + '</span>' +
					'</div>' +
					'<div class="tree-children tree-opened">';*/
	};
	
	var end_node = function(self, name, id)
	{
		return '</div></div>';
	};
	
	
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a text value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var text_renderer = function(self, arg_name, arg_value)
	{
		return '<div class="tree-simple">' + arg_name + ': ' + arg_value + '</div>';
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render an unknow value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var unknow_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, 'unknow node');
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a null value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var null_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, 'null');
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render an undefined value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var undefined_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, 'undefined');
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a numeric value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var number_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, arg_value);
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a boolean value
	 * @param {string}		arg_name	node name
	 * @param {boolean}	arg_value	node value
	 * @return {string}		node html content
	 */
	var boolean_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, (arg_value ? 'true' : 'false'));
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a date value
	 * @param {string}		arg_name	node name
	 * @param {date}		arg_value	node value
	 * @return {string}		node html content
	 */
	var date_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, arg_value.toString());
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a regexp value
	 * @param {string}		arg_name	node name
	 * @param {date}		arg_value	node value
	 * @return {string}		node html content
	 */
	var regexp_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, arg_value.toString());
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a function value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var function_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, 'function[' + arg_value.name + ']');
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render an empty array value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var empty_array_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, '[]');
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render an array value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var array_renderer = function(self, arg_name, arg_value)
	{
		var id =  self.name + '_node_' + Devapt.uid();
		
		var res = '';
		
		res += begin_node(self, arg_name, id);
		
		if (arg_value.length === 0)
		{
			res += '[]';
		}
		else
		{
			for(var index = 0 ; index < arg_value.length ; index++)
			{
				res += branch_renderer(self, '[' + index + ']', arg_value[index], id);
			}
		}
		
		res += end_node(self, arg_name, id);
		
		return res;
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render an empty plain object value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var empty_plain_object_renderer = function(self, arg_name, arg_value)
	{
		return text_renderer(self, arg_name, '{}');
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a plain object value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var plain_object_renderer = function(self, arg_name, arg_value)
	{
		var id =  self.name + '_node_' + Devapt.uid();
		
		var res = '';
		
		res += begin_node(self, arg_name, id);
		
		$.each(arg_value, function(key, val)
			{
				res += '<div class="tree-child">' + branch_renderer(self, key, val, id) + '</div>';
			}
		);
		
		res += end_node(self, arg_name, id);
		
		return res;
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a Devapt class object value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var class_object_renderer = function(self, arg_name, arg_value)
	{
		var id =  self.name + '_node_' + Devapt.uid();
		
		var res = '';
		
		res += begin_node(self, arg_name, id);
		
		res += branch_renderer(self, 'class.infos', arg_value.infos.class_name, id);
		
		res += end_node(self, arg_name, id);
		
		return res;
	};
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a Devapt object value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var devapt_object_renderer = function(self, arg_name, arg_value)
	{
		var res = '';
		
		var id =  self.name + '_node_' + Devapt.uid();
		
		res += begin_node(self, arg_name, id);
		
		res += '<div class="tree-child">' + 'object name:' + arg_value.name + '</div>';
		res += '<div class="tree-child">' + 'class name:' + arg_value.class_name + '</div>';
		
		// RENDER PROPERTIES
		res += begin_node(self, 'properties', id + '_properties');
		var properties_records = arg_value._class.properties.all_map;
		for(var property_name in properties_records)
		{
			// var property_record = properties_records[property_name];
			var obj_attribute = property_name in arg_value ? arg_value[property_name] : 'undefined';
			obj_attribute = (obj_attribute === null) ? 'null' : obj_attribute;
			
			res += '<div class="tree-child">';
			res += branch_renderer(self, property_name, obj_attribute, id);
			res += '</div>';
		}
		res += end_node(self, 'properties', id + '_properties');
		
		// RENDER METHODS
		res += begin_node(self, 'methods', id + '_methods');
		var methods_records = arg_value._class.methods.all_map;
		for(var property_name in methods_records)
		{
			res += '<div class="tree-child">';
			res += property_name;
			res += '</div>';
		}
		res += end_node(self, 'methods', id + '_methods');
		
		res += end_node(self, arg_name, id);
		
		return res;
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptTree
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
		// self.trace=true;
		
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// SET OBJECT TYPE
		self.is_tree_view = true;
		
		
		// REGISTER RENDERES
		self.node_renderers['begin_node'] = begin_node;
		self.node_renderers['end_node'] = begin_node;
		self.node_renderers['string'] = text_renderer;
		self.node_renderers['unknow'] = unknow_renderer;
		self.node_renderers['undefined'] = undefined_renderer;
		self.node_renderers['null'] = null_renderer;
		self.node_renderers['number'] = number_renderer;
		self.node_renderers['boolean'] = boolean_renderer;
		self.node_renderers['date'] = date_renderer;
		self.node_renderers['regexp'] = regexp_renderer;
		self.node_renderers['function'] = function_renderer;
		self.node_renderers['empty_array'] = empty_array_renderer;
		self.node_renderers['array'] = array_renderer;
		self.node_renderers['empty_plain_object'] = empty_plain_object_renderer;
		self.node_renderers['plain_object'] = plain_object_renderer;
		self.node_renderers['class'] = class_object_renderer;
		self.node_renderers['devapt'] = devapt_object_renderer;
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	
	
	
	/**
	 * @private
	 * @memberof			DevaptTree
	 * @desc				Render a Devapt object value
	 * @param {string}		arg_name	node name
	 * @param {anything}	arg_value	node value
	 * @return {string}		node html content
	 */
	var branch_renderer = function(self, arg_name, arg_value, arg_id)
	{
		var context = 'DevaptTree.branch_renderer(name,value,id)';
		// console.log(arg_value, context + ':render tree node deep=[' + self.current_deep_rendering + '] name=[' + arg_name + '] id=[' + arg_id + ']');
		
		
		// EENTER BRANCH
		self.current_deep_rendering++;
		
		// WATCHDOG
		if (self.current_deep_rendering > self.max_deep_rendering)
		{
			console.error('too many calls', context);
			return;
		}
		
		// GET VALUE TYPE
		var type = DevaptTypes.type_of(arg_value);
		var obj = arg_value;// TODO
		var renderer = null;
		
		// PROCESS OBJECT TYPE
		if (type === 'object')
		{
			// RENDER A DEVAPT OBJECT
			if ( ('_class' in obj) &&  DevaptTypes.is_object(obj._class) && DevaptTypes.is_string(obj.class_name) )
			{
				console.log('Devapt object', context + ':render tree node deep=[' + self.current_deep_rendering + '] name=[' + arg_name + '] id=[' + arg_id + ']');
				renderer = self.node_renderers['devapt'];
			}
			
			// RENDER A CLASS OBJECT
			else if ( obj.is_class && DevaptTypes.is_object(obj.infos) && DevaptTypes.is_boolean(obj.is_build) )
			{
				// console.log('DevaptClass object', context + ':render tree node deep=[' + self.current_deep_rendering + '] name=[' + arg_name + '] id=[' + id + ']');
				renderer = self.node_renderers['class'];
			}
			
			// RENDER A PLAIN OBJECT
			else if ( DevaptTypes.is_plain_object(obj) )
			{
				// console.log('plain object', context + ':render tree node deep=[' + self.current_deep_rendering + '] name=[' + arg_name + '] id=[' + id + ']');
				renderer = arg_value.length === 0 ? self.node_renderers['empty_plain_object'] : self.node_renderers['plain_object'];
			}
			
			// RENDER AN OTHER OBJECT
			else if ( obj.promise )
			{
				// console.log('defer object', context + ':render tree node deep=[' + self.current_deep_rendering + '] name=[' + arg_name + '] id=[' + id + ']');
				renderer = self.node_renderers['string'];
				arg_value = 'defer';
			}
		}
		
		// PROCESS ARRAY TYPE
		else if (type === 'array')
		{
			// console.log('Array object', context + ':render tree node deep=[' + self.current_deep_rendering + '] name=[' + arg_name + '] id=[' + id + ']');
			renderer = arg_value.length === 0 ? self.node_renderers['empty_array'] : self.node_renderers['array'];
		}
		
		// OTHERS TYPE
		else
		{
			renderer = self.node_renderers[type];
		}
		
		// CHECK RENDERER
		if (! renderer)
		{
			console.log(arg_value, context + ':renderer not found for type[' + type + ']');
		}
		// console.log(renderer, context + ':renderer for type[' + type + ']');
		renderer = renderer ? renderer : self.node_renderers['unknow'];
		// console.log(renderer, context + ':renderer for type[' + type + ']');
		
		self.current_deep_rendering--;
		return renderer(self, arg_name, arg_value);
	};
	
			
	
	/**
	 * @private
	 * @class				DevaptTree.Tree
	 * @desc				Tree class
	 * @param {string}		arg_root_id			root node tag id
	 * @param {string}		arg_root_label		root node label
	 * @return {nothing}
	 */
	function Tree(arg_root_id, arg_root_label)
	{
		// var context = 'DevaptTree.Tree(id,label)';
		var root_name = arg_root_label ? arg_root_label : 'root node';
		
		var $el = $(arg_root_id);
		$el.addClass('tree-cont');
		$el.on('click', '.tree-obj-caption',
			function(e)
			{
				var id = $(e.currentTarget).attr('id');
				$('#' + id + '_closed').toggle();
				$('#' + id + '_opened').toggle();
				$(e.currentTarget).parent().toggleClass('tree-expand');
			}
		);

		this.set = function(self, obj)
		{
			self.current_deep_rendering = 0;
			var expanded = $el.find('.tree-expand').toArray().map(function(el) { return el.getAttribute('id'); });
			
			$el.html(
				branch_renderer(self, root_name, obj, self.name + '_nodes_')
			);
			
			$(
				expanded.map(
					function(e) { return '#' + e; }
				).join(', ')
			).addClass('tree-expand');
		};
	};

	
	/**
	 * @public
	 * @memberof			DevaptTree
	 * @desc				Render view
	 * @param {object}		arg_tree_datas		hierchycal object
	 * @return {boolean}
	 */
	var cb_set_tree_datas = function(arg_tree_datas)
	{
		var self = this;
		var context = 'set_tree_datas(tree datas)';
		self.enter(context, '');
		
		
		// DEBUG
		console.log(arg_tree_datas, context + ':value');
		// debugger;
		
		// CHECK ARGS
		self.assert_object(context, 'arg_tree_datas', arg_tree_datas);
		
		// A RECORD IS GIVEN
		if (('is_record' in arg_tree_datas) && arg_tree_datas.is_record)
		{
			var record = arg_tree_datas;
			console.log(record, context + ':record');
			
			if (record.recordset.model.engine_object.provider.name === 'ResourcesProvider')
			{
				console.log(context + 'resources provider is found');
				
				var promise = record.datas.get_instance();
				promise.then(
					function(arg_instance)
					{
						console.log(arg_instance, context + 'resources instance is found');
						self.tree.set(self, arg_instance);
					}
				);
				
				self.leave(context, Devapt.msg_success);
				return true;			
			}
			
			arg_tree_datas = record.datas;
		}
		
		self.tree.set(self, arg_tree_datas);
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptTree
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
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
		// debugger;
		// self.set_tree_datas(self);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return Devapt.promise_resolved();
	};
	
	
	
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
	var DevaptTreeClass = new DevaptClass('DevaptTree', parent_class, class_settings);
	
	// METHODS
	DevaptTreeClass.infos.ctor = cb_constructor;
	DevaptTreeClass.add_public_method('set_tree_datas', {}, cb_set_tree_datas);
	DevaptTreeClass.add_public_method('render_self', {}, cb_render_self);
	DevaptTreeClass.add_public_method('set_value', {}, cb_set_tree_datas);
	
	// PROPERTIES
	// DevaptTreeClass.add_public_str_property('content',	'',		null, false, false, []);
	DevaptTreeClass.add_public_str_property('root_name',	'',		null, false, false, []);
	
	DevaptTreeClass.add_public_int_property('current_deep_rendering',	'',		0, false, false, []);
	DevaptTreeClass.add_public_int_property('max_deep_rendering',		'',		10, false, false, []);
	
	DevaptTreeClass.add_public_object_property('node_renderers',		'',		{}, false, false, []);
	
	
	return DevaptTreeClass;
} );
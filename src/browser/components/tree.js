
import T from 'typr'
import assert from 'assert'

import Component from './component'


const context = 'browser/components/tree'



/**
 * @file UI Tree component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Tree extends Component
{
	
	/**
	 * Creates an instance of Component.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_state, log_context)
		
		this.is_tree_component = true
		
		this.init()
	}
	
	
	
	/**
	 * Get container items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_get_count()
	{
	}
	
	
	
	/**
	 * Erase container items.
	 * 
	 * @returns {nothing}
	 */
	ui_items_clear()
	{
	}
	
	
	
	/**
	 * Append rows to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * 
	 * @returns {nothing}
	 */
	ui_items_append(/*arg_items_array*/)
	{
	}
	
	
	
	/**
	 * Prepend a row.
	 * 
	 * @param {array} arg_items_array - rows array.
	 * 
	 * @returns {nothing}
	 */
	ui_items_prepend(/*arg_items_array*/)
	{
	}
	
	
	
	/**
	 * Remove a row at given position.
	 * 
	 * @param {number} arg_index - row index.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_at_index(arg_index)
	{
		assert( T.isNumber(arg_index), context + ':ui_items_remove_at_index:bad index number' )
		
	}
	
	
	
	/**
	 * Remove a row at first position.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_first()
	{
	}
	
	
	
	/**
	 * Remove a row at last position.
	 * 
	 * @param {integer} arg_count - items count to remove.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_last(/*arg_count*/)
	{
		// console.log(context + ':ui_items_remove_last:arg_count', arg_count)
		
	}
	
	
	
	/**
	 * Init view.
	 * 
	 * @returns {nothing}
	 */
	init()
	{
		// this.mode = this.get_initial_state()['mode']
		// this.svc = this.get_initial_state()['service']
		// this.runtime.register_service(this.svc)
		
		// console.log(context + ':init:mode %s, svc %s', this.mode, this.svc)
		// console.log(context + ':init')
	}
	
	
	
	/**
	 * Update tree.
	 * 
	 * @param {object} arg_tree - tree nodes.
	 * 
	 * @returns {nothing}
	 */
	update_tree(arg_tree)
	{
		const tree_id = this.get_dom_id()
		// console.log('update_tree:id=%s', tree_id, arg_tree)
		
		var MAX_DEPTH = 15


		function render_safe_string(arg_value)
		{
			arg_value = arg_value.replace('<script>', 'AscriptB').replace('A/scriptB', '\A/script\B')
			if (arg_value.indexOf('<') > -1)
			{
				return '<code>' + arg_value + '</code>'
			}
			
			return arg_value ? arg_value.toString().replace('<li>', '!lia!').replace('</li>', '!lib!').replace('<ul>', '!ula!').replace('</ul>', '!ulb!').replace('<', '!aaa!').replace('>', '!bbb!') : arg_value
		}


		function render_expandable_node(arg_label, arg_content)
		{
			var str = '<div class="node"><a class="node_a">'
			str += '<span class="node_closed">\u25B9</span><span class="node_opened">\u25BF</span>'
			str += '<b>' + render_safe_string(arg_label) + '</b>'
			str += '</a><div class="node_content">'
			str += render_safe_string(arg_content)
			return str + '</div></div>'
		}


		function render_node(arg_value, arg_depth, arg_label)
		{
			var str = ''

			arg_depth = arg_depth ? arg_depth : 1
			arg_label = arg_label == 0 ? '0' : arg_label
			arg_label = arg_label ? arg_label : 'no name'
			
			if (arg_depth > MAX_DEPTH)
			{
				console.log('MAX DEPTH ' + MAX_DEPTH + ' is reached')
				return '<p>MAX DEPTH ' + MAX_DEPTH + ' is reached</p>'
			}
			
			if (T.isString(arg_value))
			{
				arg_value = render_safe_string(arg_label) + '=' + render_safe_string(arg_value)
				return '<span>' + arg_value + '</span>'
			}
			
			if (T.isNumber(arg_value))
			{
				return render_safe_string(arg_label) + '=' + '<span>' + arg_value + '</span>'
			}
			
			if (T.isBoolean(arg_value))
			{
				var value = arg_value ? 'true' : 'false'
				return render_safe_string(arg_label) + '=' + '<span>' + value + '</span>'
			}
			
			if (T.isArray(arg_value))
			{
				if (arg_value.length == 0)
				{
					return render_safe_string(arg_label) + '=' + '[]'
				}
				
				if (arg_value.length == 1)
				{
					return render_safe_string(arg_label) + '=' + '[' + render_node(arg_value[0], arg_depth + 1, '0') + ']'
				}
				
				try
				{
					arg_value.forEach(
						function(value, index) {
							str += '<div>' + render_node(value, arg_depth + 1, index) + '</div>'
						}
					)
				}
				catch(e)
				{
					// NOTHING TO DO
				}
				return render_expandable_node(arg_label, str)
			}
			
			if (T.isObject(arg_value))
			{
				try
				{
					Object.keys(arg_value).forEach(
						function(key)
						{
							str += '<div>' + render_node(arg_value[key], arg_depth + 1, key) + '</div>'
						}
					)
				}
				catch(e)
				{
					// NOTHING TO DO
				}
				return render_expandable_node(arg_label, str)
			}
			
			if ( T.isNull(arg_value))
			{
				return ''
			}

			console.error(arg_value, 'value is unknow')
			return '<p>unknow node of type [' + (typeof arg_value) + ']</p>'
		}

		var html = render_node(arg_tree, 1, this.initial_state.label)
		// console.log('update_tree', html)
		
		$('#' + tree_id).html(html)
		$('.node_closed').hide()
		$('a.node_a').click(
			function(ev)
			{
				var node = $(ev.currentTarget).parent()
				
				$('div.node_content', node).toggle()
				$('span.node_opened', node).toggle()
				$('span.node_closed', node).toggle()
			}
		)
	}
	
	

	/**
	 * On bindings refresh.
	 * 
	 * @param {object} arg_operands - operands plain object.
	 * 
	 * @returns {nothing}
	 */
	on_refresh(arg_operands)
	{
		// console.log('new state', arg_operands)
		this.update_tree(arg_operands.datas)
	}
}

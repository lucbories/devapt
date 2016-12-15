// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// BROWSER IMPORTS
import Component from '../base/component'


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
		if (arg_tree.datas)
		{
			arg_tree = arg_tree.datas
		}

		console.log('tree.update_tree', arg_tree)

		const tree_id = this.get_dom_id()
		this.max_depth = this.get_state_value('max_depth', 20)
		this.max_depth = T.isNumber(this.max_depth) ? this.max_depth : 20

		var collapsed = this.get_state_value('collapsed', false)

		var html = ''
		// html = '<table><tbody>'
		html += this.render_node(arg_tree, 1, this.get_state_value('label') )
		// html += '</tbody></table>'
		// console.log('update_tree', html)
		
		var tree_jqo = $('#' + tree_id)
		tree_jqo.html(html)
		if (collapsed)
		{
			$('div.node_content', tree_jqo).hide()
			$('span.node_opened', tree_jqo).hide()
			$('span.node_closed', tree_jqo).show()
		} else {
			$('div.node_content', tree_jqo).show()
			$('span.node_opened', tree_jqo).show()
			$('.node_closed', tree_jqo).hide()
		}
		
		$('a.node_a', tree_jqo).click(
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
	 * 
	 */
	render_safe_string(arg_value)
	{
		// console.log('tree.render_safe_string', arg_value)
		
		// arg_value = arg_value.replace('<script>', 'AscriptB').replace('A/scriptB', '\A/script\B')
		// if (arg_value.indexOf('<') > -1)
		// {
		// 	// console.log('Tree:render_safe_string: value=%s', arg_value)
		// 	return '<code>' + arg_value + '</code>'
		// }

		var translations = {
			'<script>' :'!scripta!',
			'</script>':'!scriptb!',
			'<div>' :'!diva!',
			'</div>':'!divb!',
			'<li>'  :'!lia!',
			'</li>' :'!lib!',
			'<ul>'  :'!ula!',
			'</ul>' :'!ulb!',
			'<'     :'!aaa!',
			'>'     :'!bbb!'
		}
		// arg_value = arg_value ? arg_value.toString().replace('<div>', '!diva!').replace('</div>', '!divb!') : arg_value
		// return arg_value ? arg_value.toString().replace('<li>', '!lia!').replace('</li>', '!lib!').replace('<ul>', '!ula!').replace('</ul>', '!ulb!').replace('<', '!aaa!').replace('>', '!bbb!') : arg_value
		
		if ( T.isString(arg_value) )
		{
			var tr = ''
			Object.keys(translations).forEach(
				function(key)
				{
					tr = translations[key]
					arg_value = arg_value.replace(key, tr)
				}
			)
		} else {
			console.error('tree.render_safe_string: value is not a string', arg_value)
		}

		return arg_value
	}



	/**
	 * 
	 */
	render_expandable_node(arg_label, arg_content, arg_content_is_safe)
	{
		arg_content_is_safe = T.isBoolean(arg_content_is_safe) ? arg_content_is_safe : false
		// console.log('tree.render_expandable_node', arg_label, arg_content_is_safe)

		var str = ''
		str += '<div class="node">'
		str += '<a class="node_a">'
		str += '<span class="node_closed">\u25B9</span>'
		str += '<span class="node_opened">\u25BF</span>'
		str += '<b>' + arg_label + '</b>'
		str += '</a>'
		str += '<div class="node_content">'
		str += arg_content_is_safe ? arg_content : this.render_safe_string(arg_content)
		str += '</div>'
		str += '</div>'

		return str
	}



	/**
	 * 
	 */
	render_node(arg_value, arg_depth, arg_label)
	{
		// console.log('tree.render_node', arg_label)

		var self = this
		var str = ''

		arg_depth = arg_depth ? arg_depth : 1
		arg_label = arg_label == 0 ? '0' : arg_label
		arg_label = arg_label ? arg_label : 'no name'
		
		if (arg_depth > this.max_depth)
		{
			console.log('MAX DEPTH ' + this.max_depth + ' is reached')
			return '<p>MAX DEPTH ' + this.max_depth + ' is reached</p>'
		}
		
		if (T.isString(arg_value))
		{
			// console.log('tree.render_node with string content', arg_label)
			arg_value = this.render_safe_string(arg_label) + '=' + this.render_safe_string(arg_value)
			return '<span>' + arg_value + '</span>'
		}
		
		if (T.isNumber(arg_value))
		{
			// console.log('tree.render_node with number content', arg_label)
			return '<span>' + this.render_safe_string(arg_label) + '=' + arg_value + '</span>'
		}
		
		if (T.isBoolean(arg_value))
		{
			// console.log('tree.render_node with boolean content', arg_label)
			var value = arg_value ? 'true' : 'false'
			return '<span>' + this.render_safe_string(arg_label) + '=' + value + '</span>'
		}
		
		if (T.isArray(arg_value))
		{
			// console.log('tree.render_node with array content', arg_label)

			if (arg_value.length == 0)
			{
				return '<span>' + this.render_safe_string(arg_label) + '=' + '[]' + '</span>'
			}
			
			if (arg_value.length == 1)
			{
				return '<span>' + this.render_safe_string(arg_label) + '=' + '[' + '</span>' + this.render_node(arg_value[0], arg_depth + 1, '0') + ']'
			}
			
			try
			{
				arg_value.forEach(
					function(value, index) {
						str += self.render_node(value, arg_depth + 1, index)
					}
				)
			}
			catch(e)
			{
				// NOTHING TO DO
				console.error(e)
			}
			return this.render_expandable_node(arg_label, str, true)
		}
		
		if (T.isObject(arg_value))
		{
			// console.log('tree.render_node with object content', arg_label)

			try
			{
				Object.keys(arg_value).forEach(
					function(key)
					{
						str += self.render_node(arg_value[key], arg_depth + 1, key)
					}
				)
			}
			catch(e)
			{
				// NOTHING TO DO
				console.error(e)
			}
			return this.render_expandable_node(arg_label, str, true)
		}
		
		if ( T.isNull(arg_value))
		{
			// console.log('tree.render_node with null content', arg_label)
			return ''
		}

		console.error(arg_value, 'value is unknow')
		return '<p>unknow node of type [' + (typeof arg_value) + ']</p>'
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

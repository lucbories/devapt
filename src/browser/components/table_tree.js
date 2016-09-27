
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import uid from '../../common/utils/uid'
import Component from './component'


const context = 'browser/components/table_tree'



/**
 * @file UI Tree component class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TableTree extends Component
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
		
		this.is_table_tree_component = true
		
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
		let styles = '<style type="text/css">\n'
		styles += '#content      { margin-left: 50px; }\n'
		styles += '.node_branch  { cursor: default; font-size: 0.8em; line-height:1em; }\n'
		styles += '.node_a       { position: relative; cursor: pointer; }\n'
		styles += '.node_content { cursor: default; margin-left: 10px; font-site:0,1em; font-size: 0.8em; line-height:1em; }\n'
		styles += '</style>\n'
		$('head').append(styles)
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
		var self = this

		if (! arg_tree)
		{
			arg_tree = this.get_state_value('tree', {})
		}
		if (arg_tree.datas)
		{
			arg_tree = arg_tree.datas
		}

		console.log('tree.update_tree', arg_tree)

		const pollers = this.get_state_value(['bindings', 'services', 0, 'options', 'method', 'pollers'], undefined)
		const svc_name = this.get_state_value(['bindings', 'services', 0, 'service'], undefined)
		const method_name = this.get_state_value(['bindings', 'services', 0, 'method'], undefined)
		if ( ! pollers && svc_name && method_name && this.unbind && this.unbind[svc_name] && this.unbind[svc_name][method_name] )
		{
			this.unbind[svc_name][method_name]()
		}

		const tree_id = this.get_dom_id()
		
		if (! this.tree_jqo)
		{
			this.tree_jqo = $('#' + tree_id)
			this.tbody_jqo = $('tbody', this.tree_jqo)
		} else {
			$('tr', this.tbody_jqo).remove()
		}

		this.max_depth = this.get_state_value('max_depth', 20)
		this.max_depth = T.isNumber(this.max_depth) ? this.max_depth : 20

		var collapsed = this.get_state_value('collapsed', false)

		const key = this.get_state_value(['bindings', 'services', 0, 'transform', 'fields', 0, 'name'], undefined)
		const sub_tree = key ? arg_tree[key] : arg_tree
		if (! sub_tree)
		{
			return
		}
		this.render_node(sub_tree, 1, this.initial_state.label, ! collapsed)

		if (collapsed)
		{
			$('.node_branch', this.tree_jqo).hide()
			$('.node_content', this.tree_jqo).hide()
			$('span.node_opened', this.tree_jqo).hide()
			$('span.node_closed', this.tree_jqo).show()
			
			$('tr').removeClass('expanded').addClass('collapsed').hide()

			$('tr').filter(
				function () {
					return $(this).data('depth') == 1
				}
			).show()
		} else {
			$('.node_branch', this.tree_jqo).show()
			$('.node_content', this.tree_jqo).show()
			$('span.node_opened', this.tree_jqo).show()
			$('span.node_closed', this.tree_jqo).hide()
			
			$('tr').removeClass('collapsed').addClass('expanded').show()
		}
		
		$('a.node_a', this.tbody_jqo).click(
			function(ev)
			{
				// var el = $(ev.currentTarget)
				// var tr = el.closest('tr')
				var tr = $(ev.currentTarget).parent().parent()
				
				var children = self.find_children(tr)
				// console.log('a.click:children=', children)


				if ( tr.hasClass('collapsed') )
				{
					// BECOME EXPANDED
					$('span.node_closed', tr).hide()
					$('span.node_opened', tr).show()
					tr.removeClass('collapsed').addClass('expanded')
					children.removeClass('collapsed').addClass('expanded').show()
					$('span.node_closed', children).hide()
					$('span.node_opened', children).show()
				} else {
					// BECOME COLLAPSED
					$('span.node_closed', tr).show()
					$('span.node_opened', tr).hide()
					tr.removeClass('expanded').addClass('collapsed')
					children.removeClass('expanded').addClass('collapsed').hide()
					$('span.node_closed', children).show()
					$('span.node_opened', children).hide()
				}
			}
		)
	}



	/**
	 * 
	 */
	find_children(arg_tr)
	{
		var depth = arg_tr.data('depth')

		return arg_tr.nextUntil(
			$('tr').filter(
				function () {
					return $(this).data('depth') <= depth
				}
			)
		)
	}



	/**
	 * Append a table row
	 */
	append_row(arg_key, arg_content, arg_depth, arg_expanded)
	{
		var id = 'tr_' + uid()
		var style = 'padding-left:' + arg_depth * 20 + 'px'
		// var style = ''
		var class_expanded = arg_expanded ? 'expanded' : 'collapsed'

		var html_row = '<tr id="' + id + '" class="node_content ' + class_expanded + '" data-depth="' + arg_depth + '">'
		html_row += '<td style="' + style + '">' + arg_key + '</td>'
		html_row += '<td>' + arg_content + '</td>'
		html_row += '</tr>'
		
		this.tbody_jqo.append(html_row)
	}



	/**
	 * 
	 */
	render_expandable_node(arg_label, arg_depth, arg_expanded)
	{
		var id = 'tr_' + uid()
		var style = 'padding-left:' + arg_depth * 20 + 'px'
		var class_expanded = arg_expanded ? 'expanded' : 'collapsed'

		var str = ''
		str += '<tr id="' + id + '" class="node_branch ' + class_expanded + '" data-depth="' + arg_depth + '"><td style="' + style + '">'
		str += '<a class="node_a">'
		str += '<span class="node_closed">\u25B9</span>'
		str += '<span class="node_opened">\u25BF</span>'
		str += '<b>' + arg_label + '</b>'
		str += '</a>'
		str += '</td><td></td></tr>'

		this.tbody_jqo.append(str)
	}



	/**
	 * 
	 */
	render_safe_string(arg_value)
	{
		// console.log('tree.render_safe_string', arg_value)
		
		// arg_value = arg_value.replace('<script>', 'AscriptB').replace('A/scriptB', '\A/script\B')
		if ( T.isString(arg_value) && arg_value.indexOf('<') > -1)
		{
			// console.log('Tree:render_safe_string: value=%s', arg_value)
			return '<code>' + arg_value.replace('<', '&lt;').replace('>', '&gt;') + '</code>'
		}

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
	render_node(arg_value, arg_depth, arg_label, arg_expanded)
	{
		// console.log('tree.render_node', arg_label)

		var self = this

		arg_depth = arg_depth ? arg_depth : 1
		arg_label = arg_label == 0 ? '0' : arg_label
		arg_label = arg_label ? arg_label : 'no name'
		arg_label = '' + arg_label
		
		if (arg_depth > this.max_depth)
		{
			console.log('MAX DEPTH ' + this.max_depth + ' is reached')
			return
		}
		
		if (T.isString(arg_value))
		{
			// console.log('tree.render_node with string content', arg_label)
			this.append_row(this.render_safe_string(arg_label), this.render_safe_string(arg_value), arg_depth, arg_expanded)
			return
		}
		
		if (T.isNumber(arg_value))
		{
			// console.log('tree.render_node with number content', arg_label)
			this.append_row(this.render_safe_string(arg_label), arg_value, arg_depth, arg_expanded)
			return
		}
		
		if (T.isBoolean(arg_value))
		{
			// console.log('tree.render_node with boolean content', arg_label)
			this.append_row(this.render_safe_string(arg_label), (arg_value ? 'true' : 'false'), arg_depth, arg_expanded)
			return
		}
		
		if (T.isArray(arg_value))
		{
			// console.log('tree.render_node with array content', arg_label)

			if (arg_value.length == 0)
			{
				this.append_row(this.render_safe_string(arg_label), '[]', arg_depth, arg_expanded)
				return
			}
			
			this.render_expandable_node(arg_label, arg_depth, arg_expanded)
			
			try
			{
				arg_value.forEach(
					function(value, index) {
						self.render_node(value, arg_depth + 1, index, arg_expanded)
					}
				)
			}
			catch(e)
			{
				// NOTHING TO DO
				console.error(e)
			}

			return
		}
		
		if (T.isObject(arg_value))
		{
			// console.log('tree.render_node with object content', arg_label)

			this.render_expandable_node(arg_label, arg_depth, arg_expanded)

			try
			{
				Object.keys(arg_value).forEach(
					function(key)
					{
						self.render_node(arg_value[key], arg_depth + 1, key, arg_expanded)
					}
				)
			}
			catch(e)
			{
				// NOTHING TO DO
				console.error(e)
			}

			return
		}
		
		if ( T.isNull(arg_value))
		{
			// console.log('tree.render_node with null content', arg_label)
			return
		}

		console.error(arg_value, 'value is unknow, unknow node of type [' + (typeof arg_value) + ']')
		return
	}



	/**
	 * On bindings refresh.
	 * 
	 * @returns {nothing}
	 */
	do_refresh()
	{
		// console.log('new state', arg_operands)
		// this.update_tree(arg_operands.datas)
		this.load()
	}
}

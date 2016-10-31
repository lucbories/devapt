// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import is_browser from '../utils/is_browser'
import Task from './task'


let context = 'common/tasks/command_task'



/**
 * @file CommandTask base class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class CommandTask extends Task
{
	/**
	 * Create a CommandTask instance.
	 * 
	 * @param {object} arg_settings - task settings.
	 * 
     * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':constructor:bad settings object')
		assert( T.isObject(arg_settings.command) && arg_settings.command.is_topology_define_command, context + ':constructor:bad settings.command object')

		super(arg_settings)

		this.is_task_command = true

		this._init_with_command(arg_settings.command)
	}



	/**
	 * Init task with a Command instance.
	 * 
	 * @param {TopologyDefineCommand} arg_command - Command instance.
	 * 
	 * @returns {nothing}
	 */
	_init_with_command(arg_command)
	{
		this._process_cb = (...args)=>{
			if ( is_browser() )
			{
				if (arg_command.command_type == "display")
				{
					const url = arg_command.command_url
					const url_target = arg_command.command_url_target
					const view = arg_command.command_view
					const menubar = arg_command.command_menubar

					if ( T.isString(view) || T.isString(menubar) )
					{
						window.document.devapt().runtime().router().display_content(view, menubar)
						return
					}

					if ( T.isString(url) && T.isString(url_target) )
					{
						$.get(url).then(
							(html)=>{
								if (url_target == 'body')
								{
									$(document.body).html(html)
									return
								}

								$(url_target).html(html)
							}
						)
					}
				}
			}
		}
	}
}


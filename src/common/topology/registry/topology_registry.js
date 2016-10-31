// NPM IMPORTS
import {fromJS } from 'immutable'

// COMMON IMPORTS
import RegistryStore from './registry_store'
import load_config from './loaders/load_config'


const context = 'common/topology/registry/topology_registry'



const TRACE = false // TODO configure from runtime settings

/**
 * @file TopologyRegistryStore class, a RegistryStore loading topology.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyRegistry extends RegistryStore
{
	/**
	 * Create a TopologyStore instance.
	 * @extends RegistryStore
	 * 
	 * @returns {nothing}
	 */
	constructor()
	{
		const default_config = load_config({}, undefined, undefined, TRACE)
		super(default_config.config, context, undefined)

		this.error = undefined
		this.initial_config = undefined
	}
	


	/**
	 * Load a topology configuration.
	 * 
	 * @param {object} arg_config - object configuration.
	 * @param {string} arg_base_dir - project base directory.
	 * @param {string} arg_topology_dir - topology settings base directory.
	 * 
	 * @returns {nothing}
	 */
	load(arg_config, arg_base_dir, arg_topology_dir)
	{
		this.initial_config = arg_config

		// LOAD AND CHECK CONFIG
		let checked_config = load_config({}, arg_config, arg_base_dir, arg_topology_dir, TRACE)
		if (checked_config.config.error)
		{
			this.error = checked_config.config.error
			// console.error(context + ':load:error', this.format_error(checked_config.config.error))
			return false
		}
		
		// DEBUG
		// console.log(checked_config.config.resources.by_name['default_menubar'], 'store.checked_config.config default_menubar')
		
		const immutable_config = fromJS(checked_config.config)
		this.root = immutable_config
		
		return true
	}
	
	
	
	/**
	 * Get potential error.
	 * 
	 * @returns {object} - error record.
	 */
	get_error()
	{
		return this.error
	}
	
	
	
	/**
	 * Format an error record.
	 * 
	 * @param {object} arg_error - error record.
	 * 
	 * @returns {string} - human readable error.
	 */
	format_error(arg_error)
	{
		let str = '\n'
		str += '*****************************************************************************************\n'
		
		// FORMAT MAIN ERROR
		str += '\n\nError:\n'
		str += '* context:   ' + arg_error.context + '\n'
		str += '* exception: ' + arg_error.exception + '\n'
		str += '* message:   ' + arg_error.error_msg + '\n'
		
		// FORMAT SUB ERRORS
		if ('suberrors' in arg_error)
		{
			str += '\nsub errors:\n'
			arg_error.suberrors.map(
				(suberror) => {
					str += '------------------------------------------------------------------------\n'
					str += '* context: ' + suberror.context + '\n'
					str += '* message: ' + suberror.error_msg + '\n'
				}
			)
		}
		
		str += '\n*****************************************************************************************\n'
		
		return str
	}
}

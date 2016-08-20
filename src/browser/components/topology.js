
import T from 'typr'
import assert from 'assert'

import Component from './component'


const context = 'browser/components/topology'



/**
 * @file UI Topology component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Topology extends Component
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
		
		this.is_topology_component = true
		
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
		this.mode = this.get_initial_state()['mode']
		this.svc = this.get_initial_state()['service']
		this.runtime.register_service(this.svc)
		
		// console.log(context + ':init:mode %s, svc %s', this.mode, this.svc)
	}
	
	
	
	/**
	 * Update topology graph with physical or logical elements.
	 * 
	 * @param {object} arg_values - service response values.
	 * 
	 * @returns {nothing}
	 */
	
	update_topology(arg_values)
	{
		const topology_id = this.get_dom_id()
		// console.log(arg_values, 'topo.update_topology for %s', topology_id)
		
		
		var cy = this.cy
		cy.reset()
		// var h = $('#' + topology_id).css('height')
		$('#' + topology_id).css('margin-top', '100px')
		$('#' + topology_id).css('height', '300px')
		// console.log($('#' + topology_id).css('top'), 'top')
		
		var els = []
		if (this.mode == 'physical')
		{
			els = this.get_physical_els(arg_values)
		}
		else if (this.mode == 'logical')
		{
			els = this.get_logical_els(arg_values)
		}
		
		cy.add(els)
		cy.layout( { name:'dagre' } )
		cy.resize()
	}
	
	
	
	/**
	 * Get physical topology elements.
	 * 
	 * @param {object} arg_values - service response values.
	 * 
	 * @returns {array} - cytoscape graph elements array.
	 */
	get_physical_els(arg_values)
	{
		const topology_id = this.get_dom_id()
		var els = [
			{
				data: { id:'world', label:'World' }
			}
		]
		const nodes = arg_values.datas.nodes
		const nodes_names = Object.keys(nodes)
		nodes_names.forEach(
			function(node_name)
			{
				const node = nodes[node_name]
				const node_id = topology_id + '_node_' + node_name
				els.push(
					{
						data: { id:node_id, label:node_name }
					},
					{
						data: { source:'world', target:node_id }
					}
				)
				
				const servers = node.servers
				const servers_names = Object.keys(servers)
				servers_names.forEach(
					function(server_name)
					{
						// const server = servers[server_name]
						const server_id = topology_id + '_server_' + server_name
						els.push(
							{
								data: { id:server_id, label:server_name }
							},
							{
								data: { source:node_id, target:server_id }
							}
						)
					}
				)
			}
		)
		
		return els
	}
	
	
	
	/**
	 * Get logical topology elements.
	 * 
	 * @param {object} arg_values - service response values.
	 * 
	 * @returns {array} - cytoscape graph elements array.
	 */
	get_logical_els(arg_values)
	{
		const topology_id = this.get_dom_id()
		var els = [
			{
				data: { id:'world', label:'World' }
			}
		]
		const apps = arg_values.datas.applications
		const apps_names = Object.keys(apps)
		apps_names.forEach(
			function(app_name)
			{
				const app = apps[app_name]
				const app_id = topology_id + '_app_' + app_name
				els.push(
					{
						data: { id:app_id, label:app_name }
					},
					{
						data: { source:'world', target:app_id }
					}
				)
				
				// ADD PROVIDED SERVICES
				const provided_services = app.provided_services
				const provided_services_names = Object.keys(provided_services)
				provided_services_names.forEach(
					function(provided_service_name)
					{
						// const svc = provided_services[provided_service_name]
						const svc_id = topology_id + '_provided_svc_' + provided_service_name
						els.push(
							{
								data: { id:svc_id, label:provided_service_name }
							},
							{
								data: { source:app_id, target:svc_id }
							}
						)
					}
				)
			}
		)
		
		return els
	}
}

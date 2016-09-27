// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import forge from 'node-forge'

// COMMON IMPORTS
import Instance from '../../base/instance'
import registry from '../registry'



let context = 'common/topology/runtime/topology_runtime_item'



/**
 * @file TopologyRuntimeItem class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyRuntimeItem extends Instance
{
	/**
	 * Create a topology item instance.
	 * @extends Instance
	 * 
	 * A Topology item is a runtime dynamic object corresponding to a static topology registry item.
	 * Each item has a name, a tenant, a package, a version and initial settings.
	 * Item sub class instances can have collections of children items.
	 * 
	 * Topology registry is shared and synchronized between all topology nodes with a master node to acknoledge changes.
	 * Topology runtime is the dynamic corresponding part of a topology registry and is instancied on each node.
	 * 
	 * API:
	 * 		->load():nothing - load Topology item settings.
	 * 		->get_topology_info(arg_deep=true, arg_visited={}):object - get topology item informations.
	 * 		->get_children():object - gt topology children items.
	 * 		
	 * 		->get_topology_type():string     - get resource topology type.
	 * 		->get_topology_tenant():string   - get resource topology tenant.
	 * 		->get_topology_package():string  - get resource topology package.
	 * 		->get_topology_version():string  - get resource topology version.
	 * 		->get_topology_uid_desc():string - get resource topology uid description.
	 * 		->get_topology_uid():string      - get resource topology uid.
	 * 		->get_topology_security():object - get resource topology security.
	 * 
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_class - class name.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_class, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		assert( T.isObject(arg_settings), log_context + ':bad settings object')
		
		super('resources', arg_class ? arg_class : 'TopologyRuntimeItem', arg_name, arg_settings, log_context)
		
		this.is_resource = true

		// DEFINE DEFAULT ATTRIBUTES VALUES
		this.DEFAULT_TYPE = 'item'
		this.DEFAULT_TENANT = 'all'
		this.DEFAULT_PACKAGE = 'default'
		this.DEFAULT_VERSION = '0.0.0'
		this.DEFAULT_SECURITY = {}

		// SET ATTRIBUTES VALUES
		this.topology_type = this.get_setting('type', this.DEFAULT_TYPE)
		this.topology_tenant = this.get_setting('tenant', this.DEFAULT_TENANT)
		this.topology_package = this.get_setting('package', this.DEFAULT_PACKAGE)
		this.topology_version = this.get_setting('version', this.DEFAULT_VERSION)

		this.topology_uid_desc = 'uid:' + this.topology_tenant + '/' + this.topology_package + '/' + this.get_name() + '/' + this.topology_version
		
		const md = forge.md.sha1.create()
		md.update(this.topology_uid_desc)
		this.topology_uid = md.digest().toHex()

		this.topology_security = this.get_setting('security', this.DEFAULT_SECURITY)
		
		this.topology_children = {}
	}
	
	

	/**
	 * Load Topology item settings.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		super.load()
	}



	/**
	 * Get topology item informations.
	 * 
	 * @param {boolean} arg_deep - get deep sub items information on true (default:true).
	 * @param {object} arg_visited - visited items plain object map (default:{}).
	 * 
	 * @returns {object} - topology informations (plain object).
	 */
	get_topology_info(arg_deep=true, arg_visited={})
	{
		const info = {
			name:this.get_name(),
			uid_desc:this.topology_uid_desc,
			uid:this.topology_uid,

			tenant:this.topology_tenant,
			package:this.topology_package,
			version:this.topology_version,
			
			type:this.topology_type,
			security:this.topology_security,
			
			children:Object.keys(this.topology_children)
		}

		if ( arg_visited && (this.topology_uid in arg_visited) )
		{
			return Object.assign(info, { note:'already dumped' } )
		}

		arg_visited[this.topology_uid] = info

		if (arg_deep)
		{
			const children_names = info.children
			info.children = []
			children_names.forEach(
				(child_name) => {
					let child = this.topology_children[child_name]
					if (! child)
					{
						child = registry.get(child_name)
					} else {
						console.error(context + ':get_topology_info:child not found [' + child_name + '] for item [' + info.name + ']')
					}
					if ( child && T.isFunction(child.get_topology_info) )
					{
						info.children.push( child.get_topology_info(arg_deep, arg_visited) )
					}
				}
			)
		}

		return info
	}



	/**
	 * Get resource topology type.
	 */
	get_topology_type()
	{
		return this.topology_type
	}



	/**
	 * Get resource topology tenant.
	 */
	get_topology_tenant()
	{
		return this.topology_tenant
	}



	/**
	 * Get resource topology package.
	 */
	get_topology_package()
	{
		return this.topology_package
	}



	/**
	 * Get resource topology version.
	 */
	get_topology_version()
	{
		return this.topology_version
	}



	/**
	 * Get resource topology uid description.
	 */
	get_topology_uid_desc()
	{
		return this.topology_uid_desc
	}



	/**
	 * Get resource topology uid.
	 */
	get_topology_uid()
	{
		return this.topology_uid
	}



	/**
	 * Get resource topology security.
	 */
	get_topology_security()
	{
		return this.topology_security
	}



	/**
	 * Get topology children items.
	 * 
	 * @returns {object} - map of children items.
	 */
	get_children()
	{
		return this.topology_children
	}
}

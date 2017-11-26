// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import {is_browser} from '../../utils/is_browser'

let  forge = undefined
if ( is_browser() )
{
	forge = require('forge-browser').forge
} else {
	forge = require('node-forge')
}

// COMMON IMPORTS
import Collection from '../../base/collection'
import DistributedInstance from '../../base/distributed_instance'
import registry from '../registry'


let context = 'common/topology/deploy/topology_deploy_item'



/**
 * @file TopologyDeployItem class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDeployItem extends DistributedInstance
{
	/**
	 * Create a topology deploy item instance.
	 * @extends DistributedInstance
	 * 
	 * A deployment item is a runtime dynamic object corresponding to a deployed topology definition item.
	 * Each deployment item has one corresponding definition item.
	 * One definition item could have many deployment items.
	 * 
	 * API:
	 * 		->load():nothing - load Topology item settings.
	 * 
	 * 		->get_owner():TopologyDeployItem - deployment container
	 * 		->get_topology_define_item():object - get topology definition item.
	 * 		
	 * 		->deploy():Promise(boolean) - .
	 * 		->undeploy():Promise(boolean) - .
	 * 
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {TopologyDefineItem} arg_definition_item - topology definition item.
	 * @param {object} arg_deploy_settings - deployment settings map.
	 * @param {class} arg_topology_class - item TopologyDefineItem child class.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_definition_item, arg_deploy_settings, arg_topology_class, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		assert( T.isObject(arg_deploy_settings), log_context + ':bad settings object')
		
		super('deployed_topology', arg_topology_class ? arg_topology_class : 'TopologyDeployItem', arg_name, arg_deploy_settings, log_context)
		
		this.is_topology_deploy_item = true

		// TOPOLOGY INFORMATIONS
		this.topology_definition_item = arg_definition_item
		this.topology_children = {}
		this.topology_owner = undefined

		this.enable_trace()
	}



	/**
	 * Get topology definition item.
	 * 
	 * return {TopologyDefineItem}
	 */
	get_topology_definition_item()
	{
		return this.topology_definition_item
	}



	/**
	 * Get topology owner.
	 * 
	 * returns {TopologyDeployItem}
	 */
	get_topology_owner()
	{
		return this.topology_owner
	}
	
	

	/**
	 * Load Topology item settings.
	 * 
	 * @returns {Promise} - Promise(boolean): true=success, false=failure
	 */
	load()
	{
		this.enter_group('load')
		
		super.load()
		
		const promises = []
		const children_names = Object.keys(this.topology_children)
		children_names.forEach(
			(child_name)=>{
				const child_collection = this.topology_children[child_name]
				const child_promise = this.load_collection(child_collection.plural, child_collection, child_collection.item_class, child_collection.item_init)
				promises.push(child_promise)
			}
		)
		
		this.leave_group('load:async wait')
		return Promise.all(promises).then(
			(result)=>{
				this.leave_group('load:async is resolved with ' + (result ? 'success' : 'failure'))
				return result
			}
		)
	}
	


	/**
	 * Check functional format.
	 * 
	 * @returns {boolean}
	 */
	is_valid()
	{
		return true
	}



	/**
	 * Load a collection of topology items.
	 * 
	 * @param {string} arg_plural_name - plural name of the collection.
	 * @param {string} arg_single_name - single name of the collection item.
	 * @param {class} arg_topology_class - item TopologyDeployItem child class.
	 * @param {function} arg_init_cb - optional callback to complete item loading:(name,settings)=>Promise(boolean).
	 * 
	 * @returns {nothing}
	 */
	declare_collection(arg_plural_name, arg_single_name, arg_topology_class, arg_init_cb)
	{
		this.enter_group('declare_collection of ' + arg_plural_name)

		// CHECK ARGS
		assert( T.isString(arg_plural_name) && arg_plural_name.length > 0, context + ':declare_collection:bad plural name for plural=' + arg_plural_name + ',single=' + arg_single_name)
		assert( T.isString(arg_single_name) && arg_single_name.length > 0, context + ':declare_collection:bad single string for plural=' + arg_plural_name + ',single=' + arg_single_name)
		assert( T.isFunction(arg_topology_class), context + ':declare_collection:bad class object for plural=' + arg_plural_name + ',single=' + arg_single_name)
		
		// DECLARE COLLECTION
		this.topology_children[arg_plural_name] = {
			// TODO : create a VersionnedCollection class
			is_versionned_collection: true,
			plural:arg_plural_name,
			single:arg_single_name,
			item_class:arg_topology_class,
			item_init:arg_init_cb,

			latest:new Collection(),   // KEY is name@latest
			versions:new Collection(), // KEY is name@version
			
			has:(arg_name, arg_version)=>{
				if (arg_version == 'latest')
				{
					return this.topology_children[arg_plural_name].latest.has(arg_name + '@latest')
				}
				return this.topology_children[arg_plural_name].versions.has(arg_name + '@' + arg_version)
			},
			get:(arg_name, arg_version)=>{
				if (arg_version == 'latest')
				{
					return this.topology_children[arg_plural_name].latest.find_by_name(arg_name + '@latest')
				}
				return this.topology_children[arg_plural_name].versions.find_by_name(arg_name + '@' + arg_version)
			},
			add:(arg_item)=>{
				if ( T.isObject(arg_item) && arg_item.is_topology_deploy_item )
				{
					const name = arg_item.get_name()
					if ( this.topology_children[arg_plural_name].latest.has(name) )
					{
						const latest = this.topology_children[arg_plural_name].latest.get(name)
						if ( latest.get_topology_version() < arg_item.get_topology_version() )
						{
							this.topology_children[arg_plural_name].latest.remove(latest)
							this.topology_children[arg_plural_name].latest.add(arg_item)
						}
					} else {
						this.topology_children[arg_plural_name].latest.add(arg_item)
					}
					this.topology_children[arg_plural_name].versions.add(arg_item)
				}
			},
			remove:(arg_item)=>{
				if ( T.isObject(arg_item) && arg_item.is_topology_item )
				{
					const name = arg_item.get_name()
					if ( this.topology_children[arg_plural_name].latest.has(name) )
					{
						this.topology_children[arg_plural_name].latest.remove(arg_item)
					}
					if ( this.topology_children[arg_plural_name].versions.has(name) )
					{
						this.topology_children[arg_plural_name].versions.remove(arg_item)
					}
				}
			}
		}

		// DECLARE ACCESSORS
		this[arg_plural_name] = ()=>{
			return this.topology_children[arg_plural_name]
		}

		this[arg_single_name] = (arg_name, arg_version='latest')=>{
			if (arg_version == 'latest')
			{
				return this.topology_children[arg_plural_name].latest.find_by_name(arg_name + '@latest')
			}
			return this.topology_children[arg_plural_name].versions.find_by_name(arg_name + '@' + arg_version)
		}

		this.leave_group('declare_collection of ' + arg_plural_name)
	}



	/**
	 * Load a collection of topology items.
	 * 
	 * @param {string} arg_collection_name - name of the collection in the item settings.
	 * @param {object} arg_collection - child collection of items.
	 * @param {class} arg_topology_class - item TopologyDeployItem child class.
	 * @param {function} arg_init_cb - optional callback to complete item loading:(name,settings)=>Promise(boolean).
	 * 
	 * @returns {Promise} - Promise(boolean): true=success, false=failure.
	 */
	load_collection(arg_collection_name, arg_collection, arg_topology_class, arg_init_cb)
	{
		this.enter_group('load_collection of ' + arg_collection_name)
		
		const promises = []
		const collection_settings = this.get_setting(arg_collection_name, undeployd)
		if (collection_settings)
		{
			const all_map = collection_settings.toMap()
			all_map.forEach(
				(settings, name) => {
					this.info('Processing ' + arg_collection_name + ' item creation of:' + name)
					// console.log(settings, 'settings')
					// console.log(name, 'name')
					if (! settings.has('tenant'))
					{
						settings.set('tenant', this.get_topology_tenant)
					}
					if (! settings.has('package'))
					{
						settings.set('package', this.get_topology_package)
					}
					
					const item = new arg_topology_class(name, settings)
					item.topology_owner = this

					arg_collection.add(item)

					let load_promise = item.load()

					if ( T.isFunction(arg_init_cb) )
					{
						load_promise = load_promise.then(
							(result)=>{
								if (result)
								{
									return arg_init_cb(name, settings)
								}
								return false
							}
						)
					}

					load_promise = load_promise.then(
						(result)=>{
							return result && item.is_valid()
						}
					)

					promises.push(load_promise)
				}
			)
		}
		
		this.leave_group('load_collection of ' + arg_collection_name + ':async wait')
		return Promise.all(promises).then(
			(result)=>{
				this.leave_group('load_collection of ' + arg_collection_name + ':async is resolved with ' + (result ? 'success' : 'failure'))
				return result
			}
		)
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
			
			children:this.get_children_names()
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

					// CHILD IS NOT FOUND
					if (! child)
					{
						console.error(context + ':get_topology_info:child not found [' + child_name + '] for item [' + info.name + ']')
						return
					}

					// CHILD IS A TOPOLOGY DEFINE ITEM
					if ( child && T.isFunction(child.get_topology_info) )
					{
						info.children.push( child.get_topology_info(arg_deep, arg_visited) )
						return
					}

					// CHILD IS A VERSIONNED COLLECTION
					if ( T.isObject(child) && child.is_versionned_collection)
					{
						const all_versions = child.versions.forEach(
							(item)=>{
								info.children.push( item.get_topology_info() )
							}
						)
					}
				}
			)
		}

		return info
	}



	/**
	 * Dump topology item informations.
	 * 
	 * @param {object} arg_info - topology info object.
	 * 
	 * @returns {nothing}
	 */
	dump_topology_info(arg_info, arg_tabs=' ', arg_eol='\n', arg_write = console.info)
	{
		arg_write(arg_tabs + '-------------------------------------' + arg_eol)
		arg_write(arg_tabs + 'name:'		+ arg_info.name + arg_eol)
		arg_write(arg_tabs + 'uid_desc:'	+ arg_info.uid_desc + arg_eol)
		arg_write(arg_tabs + 'uid:'			+ arg_info.uid + arg_eol)
		arg_write(arg_tabs + 'tenant:'		+ arg_info.tenant + arg_eol)
		arg_write(arg_tabs + 'package:'		+ arg_info.package + arg_eol)
		arg_write(arg_tabs + 'version:'		+ arg_info.version + arg_eol)
		arg_write(arg_tabs + 'type:'		+ arg_info.type + arg_eol)
		arg_write(arg_tabs + 'security:'	+ arg_info.security + arg_eol)
		
		arg_write(arg_tabs + 'children: [' + arg_eol)
		arg_info.children.forEach(
			(child_info)=>{
				this.dump_topology_info(child_info, arg_tabs + ' ', arg_eol, arg_write)
			}
		)
		arg_write(arg_tabs + ']' + arg_eol)
	}



	/**
	 * Get children names
	 */
	get_children_names()
	{
		return Object.keys(this.topology_children)
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

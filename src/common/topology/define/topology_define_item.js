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
// import Collection from '../../base/collection'
import CollectionVersion from '../../base/collection_version'
import Instance from '../../base/instance'
import registry from '../registry'


let context = 'common/topology/define/topology_define_item'




/**
 * @file TopologyDefineItem class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefineItem extends Instance
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
		
		// DECORATE STATE WITH A VERSION
		if ( (! arg_settings.get) && arg_settings && arg_settings.state && !arg_settings.state.state_version)
		{
			arg_settings.state.state_version = 0
		} else if ( arg_settings.setIn && arg_settings.has('state') && ! arg_settings.hasIn(['state', 'state_version']) )
		{
			arg_settings = arg_settings.setIn(['state', 'state_version'], 0)
		}

		super('defined_topology', arg_class ? arg_class : 'TopologyDefineItem', arg_name, arg_settings, log_context)
		
		this.is_topology_define_item = true

		// DEFINE DEFAULT ATTRIBUTES VALUES
		this.DEFAULT_TYPE = 'item'
		this.DEFAULT_TENANT = 'default'
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
		this.topology_owner = undefined

		// console.log((arg_class ? arg_class : 'TopologyDefineItem') + ':' + arg_name, this.is_trace_enabled ? 'trace enabled' : 'trace disabled')
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
				this.debug('load:child=' + child_name)
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
	 * Compare two versions.
	 * @TODO: use node-semver
	 * 
	 * @param {string} arg_op - comparison operator (<, <=, =, >=, >).
	 * @param {string} arg_version1 - left version.
	 * @param {string} arg_version2 - right version.
	 * 
	 * @returns {boolean}
	 */
	compare_versions(arg_op, arg_version1, arg_version2)
	{
		switch(arg_op)
		{
			case '<':	return arg_version1 <  arg_version2
			case '<=':	return arg_version1 <= arg_version2
			case '>':	return arg_version1 >  arg_version2
			case '>=':	return arg_version1 >= arg_version2
			case '=':	return arg_version1 == arg_version2
		}
		return false
	}



	/**
	 * Load a collection of topology items.
	 * 
	 * @param {string} arg_plural_name - plural name of the collection.
	 * @param {string} arg_single_name - single name of the collection item.
	 * @param {class} arg_topology_class - item TopologyDefineItem child class.
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
		const filter_version = (arg_name, arg_version)=>{
			return (arg_item)=>{
				return arg_item.get_name() == arg_name && arg_item.get_topology_version() == arg_version
			}
		}
		this.topology_children[arg_plural_name] = {
			is_versionned_collection: true,
			plural:arg_plural_name,
			single:arg_single_name,
			item_class:arg_topology_class,
			item_init:arg_init_cb,

			collection:new CollectionVersion(),
			
			has:(arg_name, arg_version)=>{
				if (arg_version == 'latest')
				{
					return this.topology_children[arg_plural_name].collection.has(arg_name)
				}
				return this.topology_children[arg_plural_name].collection.has_version(arg_name, arg_version)
			},
			get:(arg_name, arg_version)=>{
				if (arg_version == 'latest')
				{
					return this.topology_children[arg_plural_name].collection.get_latest_item(arg_name)
				}
				return this.topology_children[arg_plural_name].collection.get_item_of_version(arg_name, arg_version)
			},
			add:(arg_item)=>{
				this.debug('collection[' + arg_plural_name + '].add item[' + arg_item.get_name() + ']')
				this.topology_children[arg_plural_name].collection.add(arg_item)
			},
			remove:(arg_item)=>{
				this.debug('collection[' + arg_plural_name + '].remove item[' + arg_item.get_name() + ']')
				this.topology_children[arg_plural_name].collection.remove(arg_item)
			}
		}

		// DECLARE ACCESSORS
		this[arg_plural_name] = ()=>{
			return this.topology_children[arg_plural_name].collection
		}

		this[arg_single_name] = (arg_name, arg_version='latest')=>{
			// console.log('find item [' + arg_name + '] of version [' + arg_version + '] of collection [' + arg_plural_name + ']')
			if (arg_version == 'latest')
			{
				return this.topology_children[arg_plural_name].collection.get_latest_item(arg_name)
			}
			return this.topology_children[arg_plural_name].collection.get_item_of_version(arg_name, arg_version)
		}

		this.leave_group('declare_collection of ' + arg_plural_name)
	}



	/**
	 * Load a collection of topology items.
	 * 
	 * @param {string} arg_collection_name - name of the collection in the item settings.
	 * @param {object} arg_collection - child collection of items.
	 * @param {class} arg_topology_class - item TopologyDefineItem child class.
	 * @param {function} arg_init_cb - optional callback to complete item loading:(name,settings)=>Promise(boolean).
	 * 
	 * @returns {Promise} - Promise(boolean): true=success, false=failure.
	 */
	load_collection(arg_collection_name, arg_collection, arg_topology_class, arg_init_cb)
	{
		this.enter_group('load_collection of ' + arg_collection_name)
		// console.info('load_collection of ' + arg_collection_name)
		
		const promises = []
		// TODO ???
		const collection_settings = this.get_setting(arg_collection_name, this.get_setting(['resources_by_type', arg_collection_name], undefined))
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
						settings.set('tenant', this.get_topology_tenant())
					}
					if (! settings.has('package'))
					{
						settings.set('package', this.get_topology_package())
					}

					settings.set('name', name)
					
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
									return arg_init_cb(item)
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
	 * Get exporting settings.
	 * 
	 * @returns {object} - exported settings for browser without sensitive values.
	 */
	export_settings()
	{
		return this.get_settings_js()
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



	/**
	 * Get topology owner.
	 */
	get_topology_owner()
	{
		return this.topology_owner
	}
}

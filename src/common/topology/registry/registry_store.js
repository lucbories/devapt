// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import MapStore from '../../state_store/map_store'


const context = 'common/topology/resgistry/registry_store'



/**
 * @file Registry class to deal with state storing and mutations.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class RegistryStore extends MapStore
{
	/**
	 * Create RegistryStore instance.
	 * 
	 * @param {object} arg_initial_state - initial state to populate registry.
	 * @param {string} arg_log_context - trace context.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_initial_state, arg_log_context, arg_logger_manager)
	{
		const my_context = arg_log_context ? arg_log_context : context
		super(arg_initial_state, my_context, arg_logger_manager)
		
		
		this.collections = ['nodes', 'servers', 'applications', 'modules', 'plugins',
			'resources', 'security', 'views', 'models', 'menubars', 'menus', 'loggers',
			'services', 'transactions', 'connexions']

		this.register_collection('nodes', 'node')
		this.register_collection('servers', 'server')
		this.register_collection('applications', 'application')
		this.register_collection('modules', 'module')
		this.register_collection('plugins', 'plugin')

		// this.register_collection('resources', 'resource')

		this.register_resources_collection('views', 'view')
		this.register_resources_collection('models', 'model')
		this.register_resources_collection('menubars', 'menubar')
		this.register_resources_collection('menus', 'menu')
		this.register_resources_collection('loggers', 'logger')
		this.register_resources_collection('services', 'service')
		this.register_resources_collection('transactions', 'transaction')
		this.register_resources_collection('connexions', 'connexion')
	}
	
	
	
	get_path_array(arg_path)
	{
		if ( T.isString(arg_path) )
		{
			arg_path = arg_path.split('.')
		}

		if ( T.isArray(arg_path) )
		{
			return arg_path.length > 0 ? arg_path : null
		}

		return null
	}
	


	set_item(arg_path, arg_item)
	{
		const path = this.get_path_array(arg_path)
		if (path)
		{
			this.root = this.root.setIn(path, arg_item)
		}
	}
	
	

	has_collection(arg_name)
	{
		return this.collections.indexOf(arg_name) > -1
	}



	// DEFINE CONFIG COLLECTIONS ACCESSORS
	get_collection(arg_name)
	{
		return this.root.has(arg_name) ? this.root.get(arg_name).toMap() : new Map()
	}
	


	get_collection_names(arg_name)
	{
		return this.root.has(arg_name) ? this.root.get(arg_name).toMap().keySeq().toArray() : [] 
	}
	


	get_collection_item(arg_name, arg_item_name)
	{
		if ( ! this.root.hasIn( [arg_name, arg_item_name] ) )
		{
			return null
		}
		
		const r= this.root.getIn( [arg_name, arg_item_name] )
		
		return r ? r.toMap() : null
	}
	


	has_collection_item(arg_name, arg_item_name)
	{
		return this.root.hasIn( [arg_name, arg_item_name] )
	}



	/**
	 * Register collection methods.
	 * 
	 * @param {string} arg_collection_name - valid collection name.
	 * 
	 * @returns {nothing}
	 */
	register_collection(arg_collection_name, arg_item_name)
	{
		assert( T.isString(arg_collection_name) && arg_collection_name.length > 0, context + ':register_collection:bad collection name string')
		assert( T.isString(arg_item_name) && arg_item_name.length > 0, context + ':register_collection:bad item name string')
		assert( this.collections.indexOf(arg_collection_name) > -1, context + ':register_collection:collection name not found in collections list:' + arg_collection_name)
		
		this['get_' + arg_collection_name] = () => {
			return this.root.getIn( [arg_collection_name] ).toMap().keySeq().toArray()
		}
		
		this['has_' + arg_item_name] = (arg_name) => {
			return this.root.hasIn( [arg_collection_name, arg_name] )
		}
		
		this['get_' + arg_item_name] = (arg_name) => {
			return this.root.getIn( [arg_collection_name, arg_name] ).toMap().toJS()
		}
		
		this['get_' + arg_item_name + '_js'] = (arg_name) => {
			return this.root.getIn( [arg_collection_name, arg_name] ).toJS()
		}
	}



	/**
	 * Register resources collection methods.
	 * 
	 * @param {string} arg_collection_name - valid collection name (plural form).
	 * @param {string} arg_item_name - valid collection name (single form).
	 * 
	 * @returns {nothing}
	 */
	register_resources_collection(arg_collection_name, arg_item_name)
	{
		assert( T.isString(arg_collection_name) && arg_collection_name.length > 0, context + ':register_collection:bad collection name')
		assert( T.isString(arg_item_name) && arg_item_name.length > 0, context + ':register_collection:bad item name')
		assert( this.collections.indexOf(arg_collection_name) > -1, context + ':register_collection:collection name not found in collections list')
		
		this['get_' + arg_collection_name] = () => {
			return this.root.getIn( ['resources', 'by_type', arg_collection_name] ).toMap().keySeq().toArray()
		}
		
		this['has_' + arg_item_name] = (arg_name) => {
			return this.has_resource_by_type(arg_collection_name, arg_name)
		}
		
		this['get_' + arg_item_name] = (arg_name) => {
			return this.get_resource_of_type(arg_collection_name, arg_name)
		}
	}

	

	// CONFIG: GET RESOURCES LIST
	get_resources(arg_set_name)
	{
		let path = ['resources', 'by_name']
		if (arg_set_name)
		{
			path = ['resources', 'by_type', arg_set_name]
		}
		return this.root.getIn(path).toMap().keySeq().toArray()
	}



	// CONFIG: HAS A RESOURCE
	has_resource(arg_name) { return this.root.hasIn( ['resources', 'by_name',  arg_name] ) }
	
	has_resource_by_type(arg_type, arg_name)
	{
		let name = this.root.getIn( ['resources', 'by_type', arg_type, arg_name] )
		return name ? this.has_resource(name) : null
	}



	// CONFIG: GET A RESOURCE
	get_resource(arg_name)
	{
		if ( this.root.hasIn( ['resources', 'by_name', arg_name] ) )
		{
			return this.root.getIn( ['resources', 'by_name', arg_name] ).toMap().toJS()
		}
		return undefined
	}
	
	get_resource_of_type(arg_type, arg_name)
	{
		if ( this.has_resource_by_type(arg_type, arg_name) )
		{
			return this.get_resource(arg_name)
		}
		return undefined
	}
	
	get_resource_by_type(arg_type, arg_name)
	{
		let name = this.root.getIn( ['resources', 'by_type', arg_type, arg_name] )
		return name ? this.get_resource(name) : undefined
	}
}

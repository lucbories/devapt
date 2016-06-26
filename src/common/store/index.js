
import T from 'typr'
import {fromJS, Map} from 'Immutable'

import rt from '../base/runtime'
import load_config from './config/loaders/load_config'


// const context = 'common/store/index'
const TRACE = false


class Store
{
	constructor()
	{
		this.root = new Map()
		
		this.collections = ['nodes', 'servers', 'applications', 'modules', 'plugins', 'resources', 'security', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
		// this.root_collections  = ['nodes', 'servers', 'applications', 'modules', 'plugins', 'security', 'services']
		// this.runtime_collections = ['nodes', 'servers', 'applications', 'views', 'models', 'menubars', 'menus', 'loggers', 'services', 'transactions']
		
		// INIT STORE WITH DEFAULT CONFIG
		const default_config = load_config({}, undefined, undefined, TRACE)
		this.set( fromJS( default_config.config ) )
	}
	
	load(arg_config)
	{
		const base_dir = rt && rt.get_setting ? rt.get_setting('base_dir', null) : undefined
			
		let checked_config = load_config({}, arg_config, base_dir,TRACE)
		
		if (checked_config.config.error)
		{
			this.error = checked_config.config.error
			// console.error(context + ':load:error', this.format_error(checked_config.config.error))
			return false
		}
		
		// console.log(checked_config.config.resources.by_name['default_menubar'], 'store.checked_config.config default_menubar')
		
		const immutable_config = fromJS(checked_config.config)
		
		this.root = immutable_config
		
		// console.log(this.root.getIn(['resources', 'by_name', 'default_menubar']), 'store.root default_menubar')
		
		return true
	}
	
	
	
	get_error()
	{
		return this.error
	}
	
	
	
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
	
	
	
	get()
	{
		return this.root
	}
	
	
	set(arg_config)
	{
		return this.root = arg_config
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
	
	// has_collection(arg_name)
	// {
	// 	return this.root_collections.indexOf(arg_name) > -1 && this.root.has(arg_name)
	// }

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



	// CONFIG: GET APPLICATIONS
	get_applications()
	{
		return this.root.getIn( ['applications'] ).toMap().keySeq().toArray()
	}
	
	has_application(arg_name)
	{
		return this.root.hasIn( ['applications', arg_name] )
	}
	
	get_application(arg_name)
	{
		return this.root.getIn( ['applications', arg_name] ).toMap().toJS()
	}



	// CONFIG: GET PLUGINS SETS
	get_plugins()
	{
		return this.root.getIn( ['plugins'] ).toMap().keySeq().toArray()
	}
	
	has_plugins_set(arg_name)
	{
		return this.root.hasIn( ['plugins', arg_name] )
	}
	
	get_plugins_set(arg_name)
	{
		const set = this.root.getIn( ['plugins', arg_name] )
		return set ? set.toJS() : []
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
	
	get_views()
	{
		return this.root.getIn( ['resources', 'by_type', 'views'     ] ).toMap().keySeq().toArray()
	}
	
	get_models()
	{
		return this.root.getIn( ['resources', 'by_type', 'models'    ] ).toMap().keySeq().toArray()
	}
	
	get_menubars()
	{
		return this.root.getIn( ['resources', 'by_type', 'menubars'  ] ).toMap().keySeq().toArray()
	}
	
	get_menus()
	{
		return this.root.getIn( ['resources', 'by_type', 'menus'     ] ).toMap().keySeq().toArray()
	}
	
	get_connexions()
	{
		return this.root.getIn( ['resources', 'by_type', 'connexions'] ).toMap().keySeq().toArray()
	}
	
	get_loggers()
	{
		return this.root.getIn( ['resources', 'by_type', 'loggers'   ] ).toMap().keySeq().toArray()
	}


	// CONFIG: HAS A RESOURCE
	has_resource(arg_name) { return this.root.hasIn( ['resources', 'by_name',  arg_name] ) }
	
	has_resource_by_type(arg_type, arg_name)
	{
		let name = this.root.getIn( ['resources', 'by_type', arg_type, arg_name] )
		return name ? this.has_resource(name) : null
	}
	
	has_view(arg_name)      { return this.has_resource_by_type('views',      arg_name) }
	has_model(arg_name)     { return this.has_resource_by_type('models',     arg_name) }
	has_menubar(arg_name)   { return this.has_resource_by_type('menubars',   arg_name) }
	has_menu(arg_name)      { return this.has_resource_by_type('menus',      arg_name) }
	has_connexion(arg_name) { return this.has_resource_by_type('connexions', arg_name) }
	has_logger(arg_name)    { return this.has_resource_by_type('loggers',    arg_name) }


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
	
	get_view(arg_name)      { return this.get_resource_of_type('views',      arg_name) }
	get_model(arg_name)     { return this.get_resource_of_type('models',     arg_name) }
	get_menubar(arg_name)   { return this.get_resource_of_type('menubars',   arg_name) }
	get_menu(arg_name)      { return this.get_resource_of_type('menus',      arg_name) }
	get_connexion(arg_name) { return this.get_resource_of_type('connexions', arg_name) }
	get_logger(arg_name)    { return this.get_resource_of_type('loggers',    arg_name) }
}


// CREATE DEFAULT RUNTIME STORE
export const store = new Store()

export function config() { return store.root }

// export default store
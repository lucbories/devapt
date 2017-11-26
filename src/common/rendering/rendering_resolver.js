// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'


// const context = 'common/rendering/rendering_resolver'



/**
 * Rendering resource and function resolver class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
class RenderingResolver
{
	/**
	 * RenderingResolver constructor.
	 * 
	 * @param {string} arg_name - trace name.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name='no name')
	{
		this._name = arg_name
		this._find_resource = undefined
		this._find_function = undefined
	}



	/**
	 * Get name (only for tracing).
	 * 
	 * returns {string}
	 */
	get_name()
	{
		return this._name
	}



	/**
	 * Find a resource description.
	 * 
	 * @param {string} arg_name - resource name.
	 * 
	 * @returns {object|undefined} - resource description or undefined if not found.
	 */
	find_resource_description(arg_name)
	{
		return T.isFunction(this._find_resource) ? this._find_resource(arg_name) : undefined
	}



	/**
	 * Find a rendering function.
	 * 
	 * @param {string} arg_type - resource type.
	 * 
	 * @returns {function|undefined} - resource rendering function or undefined if not found.
	 */
	find_rendering_function(arg_name)
	{
		return T.isFunction(this._find_function) ? this._find_function(arg_name) : undefined
	}
}



export default class RenderingResolverBuilder
{
	/**
	 * Instance building static method from Topology define application instance.
	 * @static
	 * 
	 * @param {string} arg_name - trace name.
	 * @param {TopologyDefinedApplication} arg_app - Topology define application instance.
	 * 
	 * @returns {RenderingResolver} - new RenderingResolver instance
	 */
	static from_topology(arg_name, arg_app)
	{
		const resolver = new RenderingResolver(arg_name)

		if ( T.isObject(arg_app) && arg_app.is_topology_define_application)
		{
			resolver._find_resource = (name)=>{
				// console.log('RenderingResolver:find_rendering_function:name=' + name)

				const r = arg_app.find_resource(name)
				return r ? r.get_settings_js() : undefined
			}
			resolver._find_function = (type)=>{
				// console.log('RenderingResolver:find_rendering_function:type=' + type)

				return arg_app.find_rendering_function(type)
			}
		}

		return resolver
	}



	/**
	 * Instance building static method from renring resolver functions.
	 * @static
	 * 
	 * @param {string} arg_name - trace name.
	 * @param {Function} arg_resource_resolver - resource description resolver function.
	 * @param {Function} arg_function_resolver - rendering function resolver function.
	 * 
	 * @returns {RenderingResolver} - new RenderingResolver instance
	 */
	static from_resolvers(arg_name, arg_resource_resolver, arg_function_resolver)
	{
		const resolver = new RenderingResolver(arg_name)

		if ( T.isFunction(arg_resource_resolver) )
		{
			resolver._find_resource = (name)=>arg_resource_resolver(name)
		}

		if ( T.isFunction(arg_function_resolver) )
		{
			resolver._find_function = (type)=>arg_function_resolver(type)
		}

		return resolver
	}
}

import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import { store, config } from '../common/store/index'

import check_security_for_resources from './check_security_for_resources'
import Transaction from './transaction'
import ExecutableHttpGetResource from './executable_http_get_ressource'


let context = 'common/services/transaction'
let debug = debug_fn(context)



export function add_get_set_resource_route(arg_server, arg_set_name)
{
  debug('loading routes get for resource in set [%s]', arg_set_name);
  
  
  // CHECK ARGS
  assert( T.isObject(arg_server), context + ':bad server object')
  assert( T.isString(arg_set_name), context + ':bad collection name string')
  var set_is_valid = arg_set_name in {'views':0, 'models':0, 'menubars':0, 'menus':0/*, 'connexions':0*/};
  assert(  set_is_valid, context + ':not found collection name [%s], arg_set_name')
  
  
  
  // GET RESOURCE ACCESS ROLE
  let role = null
  if ( this.store_config().hasIn( ['security', 'authorization', 'roles', arg_set_name, 'get_resource'] ) )
  {
    role = this.store_config().getIn( ['security', 'authorization', 'roles', arg_set_name, 'get_resource'] )
  }
  else
  {
    role = this.store_config().getIn( ['security', 'authorization', 'roles', '*', 'get_resource'] )
  }
  
  
  // DEFINE MIDDLEWARES
  let check_security_mw = check_security_for_resources(null, role, 'get')
  let get_resources_mw = function (req, res, next)
  {
    let exec = new ExecutableHttpGetResource()
    let tx = new Transaction('app_name', 'svc_name', 'add_get_set_resource_route', {}, [exec])
    
    tx.prepare( { store_config:config } )
    let bool_result = tx.execute( { collection:arg_set_name } )
    tx.finish()
    
    // DISPLAY TRANSACTION METRICS
    debug(tx.get_metrics())
    
    // PROCESS ERROR
    if (! bool_result)
    {
      let e = tx.get_first_error()
      return e.error_msg
    }
    
    // PROCESS SUCCESS
    let result = tx.get_first_result()
    return result.value
  }
  
  
  // ADD ROUTE
  arg_server.get('/resources/' + arg_set_name + '/:name', check_security_mw, get_resources_mw);
}



export function add_get_resource_route(arg_server)
{
  debug('loading routes get for resource');
  
  
  // CHECK ARGS
  assert( T.isObject(arg_server), context + ':bad server object')
  
  
  // GET RESOURCE ACCESS ROLE
  let role = this.store_config().getIn( ['security', 'authorization', 'roles', '*', 'get_resource'] )
  
  
  // DEFINE MIDDLEWARES
  let check_security_mw = check_security_for_resources(null, role, 'get')
  let get_resources_mw = function (req, res, next)
  {
    let exec = new ExecutableHttpGetResource()
    let tx = new Transaction('app_name', 'svc_name', 'add_get_resource_route', {}, [exec])
    
    tx.prepare( { store_config:config } )
    let bool_result = tx.execute( { collection:'*' } )
    tx.finish()
    
    // DISPLAY TRANSACTION METRICS
    debug(tx.get_metrics())
    
    // PROCESS ERROR
    if (! bool_result)
    {
      let e = tx.get_first_error()
      return e.error_msg
    }
    
    // PROCESS SUCCESS
    let result = tx.get_first_result()
    return result.value
  }
  
  
  // ADD ROUTE
  arg_server.get('/resources/:name', check_security_mw, get_resources_mw);
}



/*
      // WRAP CONNEXIONS ATTRIBUTES
      if (arg_set_name === 'connexions')
      {
        resource_def.host = 'host';
        resource_def.port = 'port';
        resource_def.user_name = 'user';
        resource_def.user_pwd = '******';
      }
      
  // const roles = {
  //   views:'role_display',
  //   menubars:'access_role',
  //   menus:'role_display',
  //   models:'role_read'
  // }
  // let role_setting_name = roles[arg_set_name]
  // let role = this.store_config.get_resource_by_type(arg_set_name, resource_name).get(role_setting_name)
  
*/
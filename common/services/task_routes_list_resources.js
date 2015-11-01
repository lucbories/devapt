
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import { store, config } from '../common/store/index'

import check_securtity_for_resources from './check_securtity_for_resources'
import Transaction from './transaction'
import ExecutableHttpListResources from './executable_http_list_ressources'


let context = 'common/services/transaction'
let debug = debug_fn(context)



export function add_list_resources_route(arg_server, arg_set_name)
{
  arg_set_name = arg_set_name ? arg_set_name : '*'
  debug('loading routes list for resources set [%s]', arg_set_name);
  
  
  // CHECK ARGS
  assert( T.isObject(arg_server), context + ':bad server object')
  assert( T.isString(arg_set_name), context + ':bad collection name string')
  var set_is_valid = arg_set_name in {'*':0, 'views':0, 'models':0, 'menubars':0, 'menus':0, 'connexions':0};
  assert(  set_is_valid, context + ':not found collection name [%s], arg_set_name')
  
  
  // GET MIDDLEWARES
  let role = this.store_config().getIn(['security', 'authorization', 'roles', 'list_resources'])
  let check_security_mw = check_securtity_for_resources(arg_set_name, role, 'list')
  let list_resources_mw = function (req, res, next)
  {
    let exec = new ExecutableHttpListResources()
    let tx = new Transaction('app_name', 'svc_name', 'add_list_resources_route', {}, [exec])
    
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
  arg_server.get('/resources/' + arg_set_name, check_security_mw, list_resources_mw);
}

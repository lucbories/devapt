
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import { store, config } from '../common/store/index'

import check_securtity_for_resources from './check_securtity_for_resources'
import Transaction from './transaction'
import ExecutableHttpListResources from './executable_http_list_ressources'


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
  
  
  // GET MIDDLEWARES
  let check_security_mw = check_securtity_for_resources(arg_set_name, 'ROLE_AUTH_USER_READ', 'get')
  let get_resources_mw = function (req, res, next)
  {
    let exec = new ExecutableHttpListResources()
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
  
  
  // GET MIDDLEWARES
  let check_security_mw = check_securtity_for_resources('*', 'ROLE_AUTH_USER_READ', 'get')
  let get_resources_mw = function (req, res, next)
  {
    let exec = new ExecutableHttpListResources()
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
      
      // WRAP INCLUDED FILE
      if ( (typeof resource_def.include_file_path_name) === 'string' )
      {
        console.log('resource_def.include_file_path_name', resource_def.include_file_path_name);
        
        var file_path = path.join(__dirname, '../../apps/private/', resource_def.include_file_path_name);
        console.log('file_path', file_path);
        
        fs.readFile(file_path, {encoding: 'utf-8'},
          function(err, data)
          {
            if (err)
            {
              var error_msg = 'resource include file not found [%s] for resource [%s]';
              console.error(error_msg, resource_name, file_path);
              var error = new NotFoundError(error_msg, resource_name, file_path);
              return next(error);
            }
            
            console.log('file is read');
            resource_def.include_file_content = data;
            
            res.contentType = 'json';
            res.send(resource_def);
          }
        );
        
        return next();
      }
      
      // PREPARE AND SEND OUTPUT
      res.contentType = 'json';
      res.send(resource_def);
      return next();
    }
  );
  */


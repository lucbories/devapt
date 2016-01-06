
import T from 'typr'
import assert from 'assert'

import logs from '../utils/logs'



const context = 'common/datas/providers/provider'
const SOURCE_LOCAL_FILE = 'local_file'
const SOURCE_REMOTE_URL = 'remote_url'
const SOURCE_SQL_DATABASE = 'sql_database'
const SOURCE_NOSQL_DATABASE = 'nosql_database'


/**
 * Provide JSON datas
 * @param {object} arg_settings - datas provider settings
 * @return {object} JSON datas
 */
function provide_json(arg_settings)
{
    logs.debug(context + ':enter')
    
    // CHECK SETTINGS
    assert( T.isObject(arg_settings) && T.isObject(arg_settings.datas_provider), context + ':bad providr settings object')
    assert( T.isString(arg_settings.datas_provider.source), context + ':bad settings object')
    
    const source = arg_settings.datas_provider.source
    let json = {}
    
    switch(source)
    {
        case SOURCE_LOCAL_FILE:
        {
            logs.debug(context + ':' + source)
            
        }
    
    // REMOTE URL
    
    // SQL DATABASE
    
    // NOSQL DATABASE
    
        default:{
            log.error(context + ':bad provider source string [' + source + ']')
        }
    }
    
    logs.debug(context + ':leave')
    return json
}


export default provide_json
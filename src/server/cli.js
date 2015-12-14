
import path from 'path'
import Vantage from 'vantage'
import mysql_repl from 'vantage-repl-mysql'
import repl from 'vantage-repl-sandboxed'
import Proxy from 'vantage-command-proxy'

import servers_cmd from '../common/commands/servers_cmd'



let vantage = Vantage()
let proxy = Proxy(vantage, { "path": path.join(__dirname, '..'), "cmd":"test"})


const users = [ {user:'admin', pass:'pass'} ]
const banner = '---------------------------- WELCOME ----------------------------'

const repl_cfg = {
    "context": {
        "vantage":vantage
    }
}


proxy.Proxy
    .command('test', 'tests proxy')
    .action(function(cmd,cb) {
        cb('no logic');
    }
)


vantage
    .delimiter('node-cli~$')
    .banner(banner)
    
    .use(repl, repl_cfg)
    
    .use(mysql_repl, {
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'auth_dev'
        }
    )
    
    // .firewall.policy("REJECT")
    // .firewall.accept("localhost")
    // .firewall.accept("127.0.0.1")
    
    // .auth("basic", {
    //     "users": users,
    //     "retry": 3,
    //     "retryTime": 500,
    //     "deny": 1,
    //     "unlockTime": 3000
    //   }
    // )
    
    .show();


export default { vantage, proxy }

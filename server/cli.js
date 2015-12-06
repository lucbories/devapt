
import Vantage from 'vantage'
import repl from 'vantage-repl-mysql'


const users = [ {user:'admin', pass:'pass'} ]

Vantage()
  .delimiter('node-cli~$')
  
  .use(repl, {
      host     : 'localhost',
      user     : 'root',
      password : 'jokari',
      database : 'auth_dev'
    }
  )
  
  // .auth("basic", {
  //     "users": users,
  //     "retry": 3,
  //     "retryTime": 500,
  //     "deny": 1,
  //     "unlockTime": 3000
  //   }
  // )
  
  .show();
'use strict';

var authentication = require('../security/authentication'),
    crypto = require('crypto');




// EXPORT A PROMISE
module.exports = {
  test: function()
  {
    // TEST AUTHENTICATION
    // console.log(ready_promise, 'ready_promise');
    
    // http://localhost:8080/MODEL_AUTH_USERS?username=demo&password=fe01ce2a7fbac8fafaed7c982a04e229
    
    
    // var hash_md5 = crypto.createHash('md5');
    // var pwd_hash = hash_md5.update('demo', 'utf8'); // SHOULD BE: md5(md5('demo')) = 6c5ac7b4d3bd3311f033f971196cfa75
    // console.log(pwd_hash.digest('hex'), 'pwd_hash.digest()');
    
    var md5 = require('MD5');
    // var received_pwd = 'fe01ce2a7fbac8fafaed7c982a04e229'; // md5('demo')
    var db_pwd_hash = md5('demo');
    // console.log(pwd_hash, 'md5(demo)');
    
    
    var login_promise = authentication.authenticate('demo', db_pwd_hash);
    // console.log(login_promise, 'login_promise');
    
    login_promise.then(
      function(result)
      {
        // console.log(result, 'login result');
        
        if (result)
        {
          console.log('login success');
        } else {
          console.log('login failure');
        }
      },
      function()
      {
        console.log('login error');
      }
    );
  }
}

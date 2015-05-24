define(['/devapt-client/lib/jstorage-0.4.12/jstorage.js'],
function()
{
	var jStorage = window.$.jStorage;
	console.log(jStorage, 'jStorage');
	
	// Tell Require.js that this module returns a reference to jStorage
	return jStorage;
} );
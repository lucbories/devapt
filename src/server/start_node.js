
import T from 'typr'
import path from 'path'
import chokidar from 'chokidar'
import runtime from '../common/base/runtime'
import commander from 'commander'

// const runtime = devapt.runtime


function parse_files_list(list)
{
	return list.split(',')
}

commander
	.version('1.0.0')
	.option('-n --node-name <node name>', 'topology node name')
	.option('-w --watch-files [files]', 'files list to watch:file1,../abc/file2,...', parse_files_list)
	.option('-b --base-directory [application base directory]', 'topology startup resources directory', path.join(__dirname, '..'))
	.option('-t --topology-directory [topology resources directory]', 'topology startup resources directory', '../')
	.option('-s --servers-bindings [servers bindings string]', 'Bindings between real ip/port and a node server. node:server:ip:port|node:server:ip:port...')
	.parse(process.argv)





const DEVAPT_NODE_NAME = commander.nodeName
const DEVAPT_NODE_CFG = path.join(commander.topologyDirectory, '../nodes', DEVAPT_NODE_NAME + '.json')


// DEBUG
// console.log(commander.nodeName, 'commander.nodeName')
// console.log(commander.resourcesDirectory, 'commander.resourcesDirectory')
// console.log(DEVAPT_NODE_CFG, 'DEVAPT_NODE_CFG')


// CHECK NODE NAME
if (!DEVAPT_NODE_NAME)
{
	console.log('no given node name!')
	process.exit()
}


const runtime_settings = require(DEVAPT_NODE_CFG)
runtime_settings.base_dir = commander.baseDirectory
runtime_settings.world_dir = commander.topologyDirectory
runtime_settings.is_master = true
runtime_settings.servers_bindings = undefined
if (commander.serversBindings)
{
	runtime_settings.servers_bindings = []
	const bindings = commander.serversBindings.split('|')
	bindings.forEach(
		(binding) => {
			const parts = binding.split(':')
			if (parts.length == 4)
			{
				const binding_record = {
					node:parts[0],
					server:parts[1],
					host:parts[2],
					port:parts[3]
				}
				runtime_settings.servers_bindings.push(binding_record)
			}
		}
	)
}


const DEBUG = false


// LOAD RUNTIME AND PLUGINS
runtime.load(runtime_settings)
.then(
	(result) => {
		if (result)
		{
			if ( DEBUG && T.isArray(commander.watchFiles) && commander.watchFiles.length > 0 )
			{
				// WATCH SRC FILES AND RELOAD
				commander.watchFiles.forEach(
					function(file)
					{
						const path_file = path.join(__dirname, file)
						watch(path_file)
					}
				)
			}

			return
		}
		
		console.log('runtime.load failure', result)
	},
	
	(reason) => {
		console.log('runtime.load failure for ', reason)
	}
)
.catch(
	(e) => {
		console.log('runtime.load exception with ', e)
	}
)


	
/**
 * Reload a file.
 * 
 * @param {string} arg_file_path - file path name.
 * 
 * @returns {nothing}
 */
function reload_file(arg_file_path)
{
	const file_name = path.basename(arg_file_path)
	const this_file_name = path.basename(__filename)
	if (file_name == this_file_name)
	{
		console.info('Need to reload after change on ' + this_file_name)
		return
	}
	
	const exts = ['.js', '.json']
	const ext = path.extname(arg_file_path)
	const full_path = path.resolve(arg_file_path)
	
	if ((exts.indexOf(ext) > -1) && (full_path in require.cache))
	{
		console.info('Reloading: ' + full_path)
		// console.log(require.cache[full_path].parent.children[0])
		
		delete require.cache[full_path]
		require(full_path)
	}
}



/**
 * Watch directory files.
 * 
 * @param {string} arg_src_dir - source directory.
 * 
 * @returns {object} - watcher object.
 */
function watch(arg_src_dir)
{
	console.info('Watching for change on: ' + arg_src_dir)
	
	const watch_settings = { ignored: /[\/\\]\./, persistent: true }
	var watcher = chokidar.watch(arg_src_dir, watch_settings)
	watcher.on('change', reload_file)
	
	return watcher
}



/**
 * Stop watching files.
 * @param {object} - watcher object
 * @returns {nothing}
 */
function unwatch(arg_watcher)
{
	arg_watcher.close()
}



process.on('exit',
	(code) => {
		console.log('About to exit with code:', code)
	}
)



process.on('SIGTERM',
	function()
	{
		unwatch()
		process.exit()
	}
)



process.on('unhandledRejection',
	(reason, p) => {
		console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
	}
)



process.on('uncaughtException',
	(err) => {
		console.log(`Caught exception: ${err}`)
	}
)

import Net from 'net'


export function is_remote(arg_host, arg_port)
{
	return Net.localAddress != arg_host && (arg_port ? Net.localPort != arg_port : true)
}


export function is_locale(arg_host, arg_port)
{
	return ! is_remote(arg_host)
}


export default { is_remote, is_locale }

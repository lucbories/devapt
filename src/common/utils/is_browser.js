
const has_window = new Function('try {return this===window;}catch(e){ return false;}')

const is_node = new Function('try {return this===global;}catch(e){return false;}')


export function is_server() { return is_node() }

export function is_browser() { return has_window() }

export default { is_server, is_browser }

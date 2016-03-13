
import path from 'path'

import runtime from '../base/runtime'


function get_base_dir()
{
    return runtime ? runtime.get_setting('base_dir') : null
}

function get_absolute_path(arg_relative_path)
{
    return path.join(get_base_dir(), arg_relative_path)
}

export { get_absolute_path, get_base_dir}
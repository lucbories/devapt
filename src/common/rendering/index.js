
// COMMON IMPORTS
import RenderingResult from './rendering_result'
import factory         from './rendering_factory'
import f               from './rendering_function'
import input_field     from './input_field'
import button          from './button'
import table           from './table'
import anchor          from './anchor'
import list            from './list'
import image           from './image'
import label           from './label'
import hbox            from './hbox'
import vbox            from './vbox'
import menubar         from './menubar'
import script          from './script'
// import page            from './page'
// import tabs            from './tabs'

export default {
	RenderingResult:RenderingResult,
	rendering_function:f,
	rendering_factory:factory,
	input_field,
	button,
	table,
	anchor,
	list,
	image,
	label,
	hbox,
	vbox,
	menubar,
	script/*,
	page,
	tabs*/
}
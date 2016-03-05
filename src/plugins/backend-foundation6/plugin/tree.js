
import T from 'typr'
import assert from 'assert'

import DefaultTree from '../../../common/rendering/default/tree'



const context = 'plugins/backend-foundation6/plugin/tree'


export default class Tree extends DefaultTree
{
	constructor(arg_name, arg_settings)
	{
        super(arg_name, arg_settings)
		
        this.$settings = T.isObject(this.$settings) ? this.$settings : {}
       
        const scripts_urls = [
            'plugins/foundation6/js/vendor/jquery.min.js',
            'plugins/foundation6/js/foundation.js',
            'plugins/foundation6/js/app.js']
        this.add_scripts_urls(scripts_urls)
        
        const styles_urls = [
            'plugins/foundation6/css/foundation.min.css',
            'plugins/foundation6/css/app.css']
        this.add_styles_urls(styles_urls)
        
        // console.log('foundation6.tree.$settings', this.$settings)
        
        this.set_css_classes_for_tag('tree', 'f6_tree', false)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
        // console.log('foundation6.tree.get_initial_state')
        
		return {
			headers: [],
			items: [],
            
			label:'no label'
		}
	}
}

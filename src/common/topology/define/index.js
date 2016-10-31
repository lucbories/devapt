// COMMON IMPORTS
import TopologyDefineWorld from './topology_define_world'


/**
 * A topology is a graph of items.
 * An item is owned by another item: owner is responsible to create or delete an children.
 * Items can be linked together: an item can use another item. 
 * 
 * Runtime topology ownership is:
 * 		world                   (TopologyDefineWorld)
 * 			tenants             (TopologyDefineTenant)
 * 				applications    (TopologyDefine)
 * 					security    (TopologyDefineSecurity)
 * 				packages        (TopologyDefinePackage)
 * 					commands    (TopologyDefineCommand)
 * 					services    (TopologyDefineService)
 * 					datasources (TopologyDefineDatasource)
 * 					models      (TopologyDefineModel)
 * 					views       (TopologyDefineView)
 * 					menus       (TopologyDefineMenu)
 * 					menubars    (TopologyDefineMenubar)
 * 				security        (TopologyDefineSecurity)
 * 			nodes               (TopologyDefineNode)
 * 				servers         (TopologyDefineServer)
 * 			plugins				(TopologyDefinePlugin)
 * 			security            (TopologyDefineSecurity)
 * 
 */

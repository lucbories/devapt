/**
 * @version		$Id: README.txt 2013-01-13 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


see www.libapt.org for more informations.


WELCOME !

LIBAPT aka A PHP Toolkit library is a project to help to create web applications (on the internet or into the enterprise) with less code as possible.
The concept is to declare db connexions, datas models, display views, page menus, configure the index.php and GO ! The application is running.

For instance, LIBAPT is still in development but runable.
It is very usefull for applications with databases access and with table presentation.

LIBAPT use PHP / HTML / CSS / JAVASCRIPT. The limit between server side or browser side code is very difficult to find in every situations and is still moving. So some code display initial state from PHP code but refresh the view in browser side. That's a point of progess.

If you need to write a browser side javascrip application, LIBAPT isn't the best way, see others full javascript toolkits.
But if you need to write a server and browser side application with datas access, LIBAPT can help you.
Be carefull, LIBAPT use declarative concept so you write wonfiguration files but not all the code.
You can provide an application with databases access without writing any code : write db/models/views/menus configuration files html templates and update the index.php and load.php, that's all !



SECURITY CONFIGURATION : (do not permit to see configuration files)
Edit .htaccess into the root of your web server space :
	Options -Indexes

	<Files .htaccess>
			order allow,deny
			deny from all
	</Files>
	<Files *.ini>
			order allow,deny
			deny from all
	</Files>
	<Files *.cfg>
			order allow,deny
			deny from all
	</Files>
	<Files *.csv>
			order allow,deny
			deny from all
	</Files>
	<Files *.template>
			order allow,deny
			deny from all
	</Files>
	<Files *.template.*>
			order allow,deny
			deny from all
	</Files>
	<Files *.html>
			order allow,deny
			deny from all
	</Files>
	<Files *.html.*>
			order allow,deny
			deny from all
	</Files>
	<Files *.php>
			order allow,deny
			deny from all
	</Files>
	<Files index.php>
			order allow,deny
			allow from all
	</Files>



INSTALL LIBAPT APPLICATIONS:

Go into in the web application folder and copy :
libapt-demo-0.x.y/
libapt-main-0.x.y/
libapt-plugins-0.x.y/
magicapp/



FOR MAGICAPP : (see http://code.google.com/p/libapt/wiki/FrHowtoCreateApplication)
Configure magicapp/index.php according to your needs.
That's all.
Open a web browser in http://serveur/.../magicapp



FOR LIBAPT-DEMO : (http://code.google.com/p/libapt/wiki/FrHowtoCreateApplication)

Create the DB schema and datas :
use libapt-demo-0.x.y/install/§auth_db_20130113.sql for user authentification and role base authorizations.
use libapt-demo-0.x.y/install/§demo_db_20130113.sql for calendars, datatables, docwiki, planning demo modules.
Rename the default database name in the two files corresponding to your dababases (auth_db and demo_db can be into the same database).

Remove the libapt-demo-0.x.y/install/ folder.
Configure your database: libapt-demo-0.x.y/common/db_connexions.csv
Configure libapt-demo-0.x.y/index.php according to your needs.
Configure libapt-demo-0.x.y/load.php if needed

Open a web browser in http://serveur/.../libapt-demo-0.x.y/
A login screen appears.
Enter the login "test1" ans the password "test1".


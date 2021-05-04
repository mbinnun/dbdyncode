# DBDYNCODE
Run a dynamic NodeJS code, stored on a mongoDB database.

----
# Installation
1. You should have NodeJS and mongoDB being installed on your development/server environment.<br/>
2. Do a *git clone https://github.com/mbinnun/dbdyncode/*<br/>
3. Do a *mongorestore* to the DBDYNCODE database dumps from the *mongo-files* folder.<br/>(After the restore, you should have the DBDYNCODE database on your mongodb.)<br/>
4. Run the following command on the mongo-cli:<br/>*db.createUser({user: "myuser", pwd: "mypassword", roles:[{role: "userAdmin" , db:"DBDYNCODE"}, {role: "readWrite" , db:"DBDYNCODE"}]});*<br/>Change **myuser** and **mypassword**, set them to your own username and password.<br/>
5. On the project's root folder, run the command *npm install* to automatically install the dependencies.<br/>
6. Now, run the project for the first time:<br/>(Again - use your own username and password)<br/>*export DYN_MONGO_USER=**myuser**<br/>export DYN_MONGO_PASSWD=**mypassword**<br/>export DYN_MONGO_SRV=**localhost**<br/>npm start*<br/>
7. You should now see the 'Hello World' message.<br/>That means the installation was successful.<br/>

----
# Running Modes
Before running the *npm start* command, you may choose a running mode by using *export DYN_MODE*.<br/>
<br/>
The available modes are:
1. ***export DYN_MODE=hello*** --> The default mode. Will just show 'Hello world'.<br/><br/>
2. ***export DYN_MODE=app*** --> Run a dynamic app's code.<br/>You should also *export* the *DYN_APPNAME* as the name of the app that you want to run.<br/><br/>
3. ***export DYN_MODE=http*** --> Run a basic nodejs server.<br/>You may *export* the *DYN_PORT* as the server's listening port. (default port is 7777).<br/><br/>
4. ***export DYN_MODE=express*** --> Run an express server.<br/>You may *export* the *DYN_PORT* as the server's listening port. (default port is 7778).<br/><br/>

**App Mode**
-
This mode runs a dyanmic code from the **DBDYNCODE.TblApps** table.<br/>
Use *export DYN_APPNAME=appname* to decide which code to fetch from the table.<br/><br/>
If the app has not been found in the table, the system will show a warning and get out.<br/>
<br/>
**Document structure of the TblApps:**<br/>
[<br/>
&nbsp;&nbsp;&nbsp;&nbsp;_id<br/>
&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;strName  <sub><-- The app name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- The dynamic app's code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;arrClasses [  <sub><-- Reusable codes ("classes")</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strName  <sub><-- "Class" name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- "Class" code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
]<br/>
<br/>
To run an app's "class" code from within the dynamic app's code, use:<br/>
*await DYNAPPS.RunAppClass(classname);*<br/>
<br/>
**Note:**<br/>
By default, the app will remain in memory and won't be finalized since we assume it to be asynchronous (processes can still run in the background after the code is executed).<br/>
If you want to finalize the app and get out as soon as the execution has finished, use the following:<br/>
*DYNCODE.flgFinalize = 1;*<br/>
<br/>

**Http Mode**
-
This mode runs a basic node js server that listens on port 7777.<br/>
Use *export DYN_PORT=portnum* to override the default port.<br/><br/>
The server expects to treat http-requests that look like this: *http://mydomain.name:7777/minisitename/pagename/?params=values*<br/>
When a request is invoked, the server runs a site's dyanmic code from the **DBDYNCODE.TblHttpSites** table, according to the domain.<br/>
After execution, it responds the text in *DYNHTTPSITES.htmlResponse* and ends the response (the server however continues running and serving).<br/><br/>
If the domain has not been found in the table, the server will respond an error 404 and show a warning in the console.<br/>
<br/>
**Document structure of the TblHttpSites:**<br/>
[<br/>
&nbsp;&nbsp;&nbsp;&nbsp;_id<br/>
&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;strDomain  <sub><-- The site's domain</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- The dynamic site's code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;arrClasses [  <sub><-- Reusable codes ("classes")</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strName  <sub><-- "Class" name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- "Class" code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;strDefaultMinisiteUri
&nbsp;&nbsp;&nbsp;&nbsp;arrMinisites [  <sub><-- "Minisites" of this site </sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strUri  <sub><-- "Minisite" name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;flgAuth  <sub><-- Flag for http-auth protecting this "minisite"</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strAuthUser  <sub><-- http-auth user</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strAuthPass  <sub><-- http-auth password</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- "Minisite" code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strDefaultPageUri<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arrPages [  <sub><-- "Pages" of this minisite </sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strUri  <sub><-- "Page" name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- "Page" code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;arrTextFiles [  <sub><-- Site's static text files to be served</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileExt  <sub><-- Static file extension</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileName  <sub><-- Static file name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtData  <sub><-- Static file contents</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;arrB64Files [  <sub><-- Site's static text files to be served</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileExt  <sub><-- Static file extension</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileName  <sub><-- Static file name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b64Data  <sub><-- Static file contents (base64 encoded)</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
]<br/>

**Notes:**<br/>
1. If the minisite/page parts are missing from the url, the server will redirect 301 the request to the default minisite/page uri.<br/><br/>
2. Alonside dynamic code, the server also handles static files.<br/>For serving a static file, it expects a url like: http://mydomain.com/myfile.pdf<br/><br/>
3. By default, the server will echo the string of *DYNHTTPSITES.htmlResponse* and will end the response.<br/>If from some reason you don't want the response to end (for example: websockets) then use:<br/>*DYNHTTPSITES.flgFinalize = 0;*<br/><br/>
4. To run a site's "class" code from within the dynamic site's code, use:<br/>
*await DYNHTTPSITES.RunSiteClass(classname);*<br/>
<br/>

**Variables:**<br/><br/>
The server will hold the following variables on each request, you may use them:<br/><br/>
*DYNHTTPSITES.htmlResponse*<br/>
*DYNHTTPSITES.binResponse*<br/>
*DYNHTTPSITES.strReqProtocol*<br/>
*DYNHTTPSITES.strReqDomain*<br/>
*DYNHTTPSITES.iReqPort*<br/>
*DYNHTTPSITES.strReqUri*<br/>
*DYNHTTPSITES.strReqMinisiteUri*<br/>
*DYNHTTPSITES.strReqPageUri*<br/>
*DYNHTTPSITES.arrReqQueryString*<br/>
*DYNHTTPSITES.arrReqPostData*<br/>
*DYNHTTPSITES.arrReqPostFiles*<br/>
*DYNHTTPSITES.arrReqCookies*<br/>
*DYNHTTPSITES.strReqUserAgent*<br/>

**Express Mode**
-
This mode runs an express js server that listens on port 7778.<br/>
Use *export DYN_PORT=portnum* to override the default port.<br/><br/>
The server expects to treat http-requests that look like this: *http://mydomain.name:7778/minisitename/pagename/?params=values*<br/>
When a request is invoked, the server runs a site's dyanmic code from the **DBDYNCODE.TblExpressSites** table, according to the domain.<br/>
After execution, it responds the text in *res.locals.DYNEXPRESSSITES.htmlResponse* and ends the response (the server however continues running and serving).<br/><br/>
If the domain has not been found in the table, the server will respond an error 404 and show a warning in the console.<br/>
<br/>
**Document structure of the TblExpressSites:**<br/>
[<br/>
&nbsp;&nbsp;&nbsp;&nbsp;_id<br/>
&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;strDomain  <sub><-- The site's domain</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- The dynamic site's code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;arrClasses [  <sub><-- Reusable codes ("classes")</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strName  <sub><-- "Class" name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- "Class" code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;strDefaultMinisiteUri
&nbsp;&nbsp;&nbsp;&nbsp;arrMinisites [  <sub><-- "Minisites" of this site </sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strUri  <sub><-- "Minisite" name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;flgAuth  <sub><-- Flag for http-auth protecting this "minisite"</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strAuthUser  <sub><-- http-auth user</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strAuthPass  <sub><-- http-auth password</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- "Minisite" code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strDefaultPageUri<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arrPages [  <sub><-- "Pages" of this minisite </sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strUri  <sub><-- "Page" name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtCode  <sub><-- "Page" code to run</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;arrTextFiles [  <sub><-- Site's static text files to be served</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileExt  <sub><-- Static file extension</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileName  <sub><-- Static file name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;txtData  <sub><-- Static file contents</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;arrB64Files [  <sub><-- Site's static text files to be served</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtInsert<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtUpdate<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileExt  <sub><-- Static file extension</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strFileName  <sub><-- Static file name</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b64Data  <sub><-- Static file contents (base64 encoded)</sub><br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
]<br/>

**Notes:**<br/>
1. If the minisite/page parts are missing from the url, the server will redirect 301 the request to the default minisite/page uri.<br/><br/>
2. Alonside dynamic code, the server also handles static files.<br/>For serving a static file, it expects a url like: http://mydomain.com/myfile.pdf<br/><br/>
3. By default, the server will echo the string of *res.locals.DYNEXPRESSSITES.htmlResponse* and will end the response.<br/>If from some reason you don't want the response to end (for example: websockets) then use:<br/>*res.locals.DYNEXPRESSSITES.flgFinalize = 0;*<br/><br/>
4. To run a site's "class" code from within the dynamic site's code, use:<br/>
*await res.locals.DYNEXPRESSSITES.RunSiteClass(classname);*<br/>
5. You may use the following functions to return error 404 / redirect 301:<br/>
*res.locals.DYNEXPRESSSITES.Error404();*<br/>
*res.locals.DYNEXPRESSSITES.Redirect301(strRedirectUrl);*<br/>

**Variables:**<br/><br/>
The server will hold the following variables on each request, you may use them:<br/><br/>
*res.locals.DYNEXPRESSSITES..htmlResponse*<br/>
*res.locals.DYNEXPRESSSITES..binResponse*<br/>
*res.locals.DYNEXPRESSSITES..strReqProtocol*<br/>
*res.locals.DYNEXPRESSSITES..strReqDomain*<br/>
*res.locals.DYNEXPRESSSITES..iReqPort*<br/>
*res.locals.DYNEXPRESSSITES..strReqUri*<br/>
*res.locals.DYNEXPRESSSITES..strReqMinisiteUri*<br/>
*res.locals.DYNEXPRESSSITES..strReqPageUri*<br/>
*res.locals.DYNEXPRESSSITES..arrReqQueryString*<br/>
*res.locals.DYNEXPRESSSITES..arrReqPostData*<br/>
*res.locals.DYNEXPRESSSITES..arrReqPostFiles*<br/>
*res.locals.DYNEXPRESSSITES..arrReqCookies*<br/>
*res.locals.DYNEXPRESSSITES..strReqUserAgent*<br/>
<br/>

----
# General Notes
1. To use a node js component one of the apps/sites, it has to be installed to the whole project using *npm install --save componentname*<br/>
2. On file uploades (multipart/form-data), the uploaded files are deleted from the disk as soon as the request is served.<br/>To save them you may use *DYNEXPRESS.objFs* (or *DYNHTTP.objFs* on Http mode) to get access to the filesystem and move the file to a persistent folder.<br/>
3. The http-auth password will become MD5 on the next versions of dbdyncode.<br/>
4. You can use the **TblClasses** to develop your own "modes"/global codes.<br/>Afterwards, run your class/mode using *await DYNCLASSES.RunClass(strModeClassName);*


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
7. You should now see the 'Hello World' message.<br/>That means the installation was successful.

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
Use *export DYN_APPNAME=appname* to decide which code to fetch from the table.<br/>
If the app has not been found in the table, the system will show a warning and get out.
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

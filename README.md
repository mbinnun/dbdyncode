# dbdyncode
Run NodeJS code stored on database

**Installation**
1. You should have NodeJS and mongoDB being installed on your development/server environment.<br/>
2. Do a *git clone https://github.com/mbinnun/dbdyncode/*<br/>
3. Do a *mongorestore* to the DBDYNCODE database dumps from the *mongo-files* folder.<br/>(You should now have the DBDYNCODE database restored on your mongodb.)<br/>
4. Run the following command on the mongo-cli:<br/>*db.createUser({user: "myuser", pwd: "mypassword", roles:[{role: "userAdmin" , db:"DBDYNCODE"}, {role: "readWrite" , db:"DBDYNCODE"}]});*<br/>Change **myuser** and **mypassword**, set them to your own username and password.<br/>
5. On the project's root folder, run the command *npm install* to automatically install the dependencies.<br/>
6. Now run the project for the first time:<br/>*DYN_MONGO_USER=**myuser** DYN_MONGO_PASSWD=**mypassword** npm start*<br/>(Again, use your own username and password).<br/>
7. You should now see the 'Hello World' message.<br/>If so, the installation has succeeded.

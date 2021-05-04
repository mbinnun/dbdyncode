// === Bofore using this node app, use the following code snippet as a DB-Admin on mongo-shell (after doing a mongorestore of the DBDYNCODE collection).
// === Change user and password to your needs.
/*
  use DBDYNCODE;
  db.createUser({user: "myuser", pwd: "mypassword", roles:[{role: "userAdmin" , db:"DBDYNCODE"}, {role: "readWrite" , db:"DBDYNCODE"}]});
*/

// Declare an object to hold the global variables
let GLOBALS = {};

// Declare the DYNCODE object
let DYNCODE = {};

// === Import the mongoose node_module
DYNCODE.dynMongoose = require('mongoose');
DYNCODE.dynSchema   = DYNCODE.dynMongoose.Schema;
DYNCODE.dynModel    = DYNCODE.dynMongoose.model;
DYNCODE.dynConn     = null;

// === Get credentials from the ENV variables (passed as DYNUSER, DYNPASSWD, DYNMODE)
DYNCODE.strDynMognoServer = process.env['DYN_MONGO_SRV']    || 'mongo';
DYNCODE.strDynUser        = process.env['DYN_MONGO_USER']   || 'myuser';
DYNCODE.strDynPasswd      = process.env['DYN_MONGO_PASSWD'] || 'mypassword';
DYNCODE.strDynMode        = process.env['DYN_MODE']         || 'hello';

// === Do not immediately finalize the app by default, since we're in an async app.
// === Turn on this flag only for a sync app.
DYNCODE.flgFinalize = 0;

// === Connect to the DYNCODE database
DYNCODE.dynMongoose.connect('mongodb://'+DYNCODE.strDynUser+':'+DYNCODE.strDynPasswd+'@'+DYNCODE.strDynMognoServer+':27017/DBDYNCODE', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err, db)=>{});
DYNCODE.dynConn = DYNCODE.dynMongoose.connection;

// === Connection error handling
DYNCODE.dynConn.on('error', async (err) => {
  // Show error message
  console.log('DBDYNCODE db connection error'+'\n'+err.message+'\n');
  // Finalize
  try { DYNCODE.dynConn.close(); DYNCODE.dynConn = null; delete DYNCODE.dynConn; } catch(err) {}
});

// === Connection success handling
DYNCODE.dynConn.on('open', async (ref) => {

  // === Declare the global classes handling object
  let DYNCLASSES = {};

  // == Global classes table definition
  DYNCLASSES.schemaTblClasses = new DYNCODE.dynSchema({
    dtInsert: { type : Date, default: Date.now },
    dtUpdate: { type : Date, default: Date.now },
    strName : { type: String, required: true, unique: true },
    txtCode : { type: String }
  });
  DYNCLASSES.objTblClasses = DYNCODE.dynModel('TblClasses', DYNCLASSES.schemaTblClasses, 'TblClasses');

  // == Global classes running code
  DYNCLASSES.RunClass = async (strClassName) => {

    // == Get global class code
    let txtClassCode = '';
    const objClassFilter = { strName: strClassName };
    try {
      const arrTblClasses = await DYNCLASSES.objTblClasses.find(objClassFilter);
      if (arrTblClasses.length > 0) {
        txtClassCode = arrTblClasses[0].txtCode;
      } else {
        console.log('Warning: The class "'+strClassName+'" is missing from DBDYNCODE.TblClasses');
      }
    }
    catch(err) { console.log('Error in DBDYNCODE.TblClasses:'+'\n'+err.message); }

    // Run the code
    if (txtClassCode != '') {
      let RunClassCode = async () => {};
      try {
        eval('RunClassCode = async () => { '+'\n'+txtClassCode+'\n'+' };');
        await RunClassCode();
      }
      catch(err) { console.log('Global class "'+strClassName+'" runtime error:'+'\n'+err.message); }
      // memory free
      RunClassCode = null;
      delete RunClassCode;
    }

    // memory free
    txtClassCode = null;
    delete txtClassCode;
  };

  // == Calculate execution mode
  let strModeClassName = 'CLSHELLO';
  switch (DYNCODE.strDynMode) {
    // as a dynamic app
    case 'app':     strModeClassName = 'CLSAPP';
      break;
    // as a node-http server
    case 'http':    strModeClassName = 'CLSHTTP';
      break;
    // as an express-based server
    case 'express': strModeClassName = 'CLSEXPRESS';
      break;
  }
  
  // == Run the initial class for the current execution mode
  await DYNCLASSES.RunClass(strModeClassName);

  if (DYNCODE.flgFinalize == 1) {
    // Memory free
    DYNCLASSES.objTblClasses    = null;
    DYNCLASSES.schemaTblClasses = null;
    delete DYNCLASSES.objTblClasses;
    delete DYNCLASSES.schemaTblClasses;
    DYNCLASSES = null;
    delete DYNCLASSES;
    
    // Finalize
    try { DYNCODE.dynConn.close(); DYNCODE.dynConn = null; delete DYNCODE.dynConn; } catch(err) {}
    console.log('\n');
  }
  
});

// == Stop the dyncode app on connection close
DYNCODE.dynConn.on('close', async () => {
  console.log('Goodbye.');
  process.exit();
});

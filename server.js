const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
// MongoDb Store
const MongoDBStore = require('connect-mongodb-session')(session);

// database config
const databaseConfig = require('./config/mongo.database.config.js');

require('./app/services/google-passport.js')(passport);
//require('./services/google-passport-token.js')(passport);

const authRouter = require('./app/routes/auth-router.js')();

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use( express.static(__dirname + '/public'));
app.use( cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//newly added mongodb store
const store = new MongoDBStore({
  uri: databaseConfig.uri,
  collection: 'mySessions', 
});

app.use(session({
  secret: 'cookie-secret', //change the secret and store it in a env file
  resave: false,
  saveUninitialized: true,
  store: store,
  maxAge: new Date(new Date().getTime() + (1000*60*60*24*365)),
  cookie: {
    expires: new Date(new Date().getTime() + (1000*60*60*24*365)),
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);

mongoose.connect(databaseConfig.uri,function(err){
  if(err){
    console.log(' ERROR CONNECTING TO THE DATABASE ' + err);
  }else{
    console.log('Successfully connected to the database');
  }
});

app.listen(3000, () => {
    console.log('Server has started');
});
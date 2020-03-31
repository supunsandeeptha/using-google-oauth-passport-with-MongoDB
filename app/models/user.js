var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var User = new Schema({
    google: {
      id: String,
      token: String,
      refreshToken: String,
      displayName: String,
      email: String,
      profileImg: String,
      expiry_date: Number
    }
  });
  
  module.exports = mongoose.model('User', User);

const User = require("../models/user.js");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const moment = require("moment");

const oauth2Client = new OAuth2(
    "445805490759-1653aqat0lhlv5ao2v7eotdo5dpbj828.apps.googleusercontent.com",
    "dBmHiKbXg7xrP0BTRZ-3t5Fz",
    "http://localhost:3000/auth/google/callback",
);

exports.checkToken = (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    console.log("NO USER");
   // console.log(req);
    return next();
  }

  if (moment().subtract(req.user.google.expiry_date, "s").format("x") > -3000) {
    oauth2Client.setCredentials({
      access_token: req.user.google.token,
      refresh_token: req.user.google.refreshToken
    });

    oauth2Client.refreshAccessToken(function(err, tokens) {
      if (err) return next(err);

      User.findOneAndUpdate(
        { "google.id": req.user.google.id },
        {
          "google.token": tokens.access_token,
          "google.expiry_date": tokens.expiry_date
        },
        {
          new: true,
          runValidators: true
        },
        function(err, doc) {
          if (err) return next(err);
          next();
        }
      );
    });
  }
  next();
};

const mongoose = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook')

const clientSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    googleId: String,
    facebookId: String,
    profilePic: {
        type: String,
        default: "images/profilePic.jpeg"
    },
    code: Number,
    codeGeneratedAt: Date
})

clientSchema.plugin(findOrCreate);
clientSchema.plugin(passportlocalmongoose);

const clientModel = mongoose.model('clientsdata', clientSchema);

passport.use(clientModel.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await clientModel.findById(id);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    useProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        var prof = profile._json.picture !== undefined ? profile._json.picture : 'images/profilePic.jpeg'
        clientModel.findOrCreate({ googleId: profile.id, username: profile.displayName, profilePic: prof }, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile)
        var prof = profile.profileUrl !== undefined ? profile.profileUrl : 'images/profilePic.jpeg'
        clientModel.findOrCreate({ facebookId: profile.id, username: profile.displayName, profilePic: prof }, function (err, user) {
            return cb(err, user);
        });
    }
));

module.exports = clientModel;

const express = require('express');
const bodyparser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport");

const app = express()

const controllers = require('./controllers')

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",
    passport.authenticate("google", { scope: ['email', 'profile'] })
);

app.get("/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect('/');
    });

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

app
    .route('/')
    .get(controllers.getHome)

app
    .route('/signup')
    .get(controllers.signupPage)
    .post(controllers.postSignup)

app
    .route('/login')
    .get(controllers.loginPage)
    .post(controllers.postLogin)

app.post('/codeVerify', controllers.verifyCode);

app.get('/user', controllers.getUser);

app.get("/logout", controllers.logout);

app.use((err, req, res, next) => {
    res.status(400).json({
        status: 'error',
        errName: err.name,
        errMessage: err.message
    })
})

module.exports = app;
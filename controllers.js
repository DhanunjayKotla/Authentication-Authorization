const clientModel = require('./model');
const sendEmail = require('./email');
const sendMessage = require('./twilio')
const catchError = require('./error')
const passport = require("passport");

const generateCode = () => {
    const code = Math.random().toFixed(6) * 1000000;
    return code;
}

exports.getHome = (req, res) => {
    if (req.isAuthenticated()) {
        res.render("final", { user: req.user });
    } else {
        res.redirect("/login");
    }
}

exports.signupPage = (req, res) => {
    res.render('signup');
}

exports.postSignup = catchError(async (req, res, next) => {
    clientModel.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            // res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, async function () {
                const temp = await sendCode(user, req.body.type)
                if (temp == 1) {
                    user = req.user;
                    res.render('otp', { user });
                } else {
                    await clientModel.deleteOne({ username: user.username });
                    res.status(400).json({
                        status: 'error',
                        message: `Can not send code to this ${req.body.type}!!!`
                    })
                }
            })
        }
    })
})

exports.loginPage = (req, res) => {
    res.render('signin');
}

exports.postLogin = catchError(async (req, res) => {
    var user = new clientModel({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, async function () {
                const temp = await sendCode(req.user, req.body.type)
                if (temp == 1) {
                    user = req.user;
                    res.render('otp', { user });
                } else {
                    res.status(400).json({
                        status: 'error',
                        message: `Can not send code to this ${req.body.type}!!!`
                    })
                }
            })
        }
    })
})

exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) return err;
        res.redirect("/");
    });
}

async function sendCode(client, type) {
    const code = generateCode()
    client.code = code;
    client.codeGeneratedAt = Date.now();
    await client.save()
    const issent = type === 'email' ? await sendEmail(client.username, code) : await sendMessage(code, `+91${client.username}`);
    return issent;
}

exports.getUser = catchError(async (req, res) => {
    const user = await clientModel.find({ username: req.query.username });
    res.send(user);
})

exports.verifyCode = catchError(async (req, res) => {
    const { code, clientId } = req.body;
    const client = await clientModel.findById(clientId);
    // console.log(req.body, client);

    if (client.code === code * 1) {
        if (Date.now() - client.codeGeneratedAt <= 120000) {
            res.redirect('/');
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Code expired!'
            })
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'Incorrect code'
        })
    }
})


const nodemailer = require('nodemailer');

module.exports = async (email, code) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.MAIL_PASSWORD,
        to: email,
        subject: 'Secret Code 🙌',
        text: `${code} is your code to login 🎁. It is valid for only 2 minutes.`
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        return 0;
    }
    return 1;
}

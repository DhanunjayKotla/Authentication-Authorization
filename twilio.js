require('dotenv').config({ path: './config.env' });

module.exports = async (code, number) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken)

    try {
        const res = await client.messages
            .create({
                body: `${code} is your secret code to login 🎁. It is valid for only 2 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: number
            })
    } catch (err) {
        console.log(err);
        return 0;
    }
    return 1;

}



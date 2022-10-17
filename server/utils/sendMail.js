const nodemailer = require("nodemailer")

const sendMail = async (email, subject, text) => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.CLIENT,
            service: process.env.SERVICE,
            port: Number(process.env.EMAL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: { user: process.env.USER, pass: process.env.PASS }
        })

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })

        console.log("Email sent Successfully");
    } catch (e) {
        console.log(e)
        console.log("Email not sent");
    }
}

module.exports = { sendMail }
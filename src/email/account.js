const sgMail = require('@sendgrid/mail')

const apiKey = "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"

sgMail.setApiKey(apiKey)

const signupMail = (email, name) => {
    sgMail.send({
        to: email,
        from: "ssajwan.deligence@gmail.com",
        Subject: `Welcome ${name}!`,
        text: `Welcome to the app ${name}!.Let me know how you get along with the app.`
    })
}

const deactivateMail = (email, name) => {
    sgMail.send({
        to: email,
        from: "ssajwan.deligence@gmail.com",
        Subject: 'Deactivation Successfull',
        text: `Tell us,${name}.What you didn't like about our services`
    })
}

module.exports = {
    signupMail,
    deactivateMail
}
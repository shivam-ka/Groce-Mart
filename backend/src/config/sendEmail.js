import { Resend } from 'resend';
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})

const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey) {
    console.log("please provide resend api key")
}

const resend = new Resend(resendApiKey);

const sendEmail = async ({ name, sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Groce Mart <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        console.log("data", data)

        if (error) {
            return console.error("Send Email Error", { error })
        }

    } catch (error) {
        console.error("Send Email Error", { error });
    }
}

export { sendEmail }
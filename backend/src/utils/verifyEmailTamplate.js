const verifyEmailTemplate = ({ name, url }) => {
    return `<h1>Verify Your Email</h1>
        <p>Hello, ${name}</p>
        <p>Thank you for registering with us! Please click the button below to verify your email address.</p>

        <p><a style="display: inline-block; background-color: #007bff; color: white; padding: 5px 12px; text-decoration: none; border-radius: 5px; text-align: center; font-size: 14px;" href=${url}>Verify Email</a></p>

        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Groce Mart</p>`
}

export { verifyEmailTemplate }
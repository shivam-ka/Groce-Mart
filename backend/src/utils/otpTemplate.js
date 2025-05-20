const otpTemplate = ({ name, otp }) => {
    return `
    <p>Hello, ${name}</p>
    
    <h3> ${otp} </h3>

    <p>Please use the following OTP to complete your verification process.
    Thi OTP is vailid only for 15 Min.</p>
    <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Groce Mart</p>
    `
}

export default otpTemplate
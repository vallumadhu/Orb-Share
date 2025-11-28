const mail_otp_template = (otp, verifyURL) => {
    return `
<div style="
    font-family: Arial, sans-serif;
    padding: 24px;
    background: #f7f7f7;
    border-radius: 10px;
    max-width: 420px;
    margin: auto;
    border: 1px solid #e5e5e5;
">
    <h2 style="
        margin-top: 0;
        color: #333;
        text-align: center;
        font-size: 22px;
        font-weight: 600;
    ">
        Verify Your Email
    </h2>

    <p style="
        font-size: 16px;
        color: #555;
        line-height: 1.6;
        text-align: center;
    ">
        Your OTP code is:
    </p>

    <p style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #111;
        text-align: center;
        margin: 10px 0 20px;
    ">
        ${otp}
    </p>

    <a href="${verifyURL}"
       style="
           background: #4CAF50;
           color: white;
           padding: 12px 20px;
           text-decoration: none;
           border-radius: 6px;
           display: block;
           text-align: center;
           font-size: 16px;
           font-weight: 600;
       ">
        Complete Registration
    </a>

    <p style="
        margin-top: 20px;
        font-size: 13px;
        color: #777;
        text-align: center;
    ">
        This code expires in 5 minutes.
    </p>
</div>
`;
};


module.exports = mail_otp_template
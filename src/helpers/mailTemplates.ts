// TODO: Convert all these to HTML

function welcomeMail(name: String, email?: String, password?: String) {
  return `
Dear ${name},
Welcome to BUCC. Your account has been created successfully, and your portal is now ready to access. Please use the following credentials to log in and complete your profile.

Your login credentials are:
Email: ${email}
Password: ${password}

After logging in, you can change your password to a strong one from Settings or add two-factor authentication. See you soon!

Note: This is an automated email. Please do not reply to this email.

Regards,
BUCC Web Team
Research and Development Department
`;
}

function verifyMail(name: String, verifyToken: String) {
  return `
Dear ${name},
Please verify your email by clicking the link below:
${process.env.DOMAIN_URL}${process.env.NEXT_PUBLIC_API_URL}/users/verify?${verifyToken}`;
}

function resetMail(resetToken: string) {
  return `
    Dear User,

    You recently requested to reset your password. Please click the link below to set a new one:
    ${resetToken}

    If you did not request this change, you can safely ignore this email.

    Regards,
    BUCC Web Team
  `;
}

function sendVerifyToken(name: String, verifyToken: String) {
  return `
    Dear ${name},
    Please Copy the Token Below and Paste it in the Verification Page:
    ${verifyToken}`;
}

export { resetMail, sendVerifyToken, verifyMail, welcomeMail };

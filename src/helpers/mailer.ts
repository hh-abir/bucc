import {
  resetMail,
  sendVerifyToken,
  welcomeMail,
} from "@/helpers/mailTemplates";
import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_SECRET,
  },
});

const singleWelcomeMail = async (
  userId: String,
  name: String,
  email: String,
  password: String,
) => {
  try {
    // We don't need to fetch the user from DB since we already have the required data
    // passed as arguments. This also avoids issues with different user models.
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email.toString(),
      subject: "Welcome to BUCC Portal",
      text: welcomeMail(name, email, password),
    };
    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const singleVerifyMail = async (
  name: string,
  email: string,
  verifyToken: string,
) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Verification Token",
      text: sendVerifyToken(name, verifyToken),
    };

    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    return error.message;
  }
};

const singleResetMail = async (
  email: string,
  resetToken: string,
) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Reset your BUCC Portal Password",
      text: resetMail(resetToken),
    };

    await transporter.sendMail(mailOptions);

    return "Mail sent successfully";
  } catch (error: any) {
    return error.message;
  }
};

export { singleResetMail, singleVerifyMail, singleWelcomeMail };

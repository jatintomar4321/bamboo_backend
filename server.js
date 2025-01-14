const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create a transporter for Bamboo website (api.bamboodigital.in)
const transporterBamboo = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER_BAMBOO,
    pass: process.env.SMTP_PASS_BAMBOO,
  },
});

// Create a transporter for AgenC website (api.your-agenc.ai)
const transporterAgenc = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER_AGENC,
    pass: process.env.SMTP_PASS_AGENC,
  },
});

// Utility function to determine which transporter to use based on the subdomain
const getTransporter = (host) => {
  if (host.includes("bamboodigital.in")) {
    return transporterBamboo;
  } else if (host.includes("your-agenc.ai")) {
    return transporterAgenc;
  } else {
    return null;
  }
};

// Email sending endpoint for Bamboo website (api.bamboodigital.in)
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;
  const host = req.get("Host"); // Get the subdomain from the request

  const transporter = getTransporter(host);

  if (!transporter) {
    return res.status(400).json({ error: "Invalid subdomain" });
  }

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please provide name, email, and message" });
  }

  const mailOptions = {
    from: `<${email}>`,
    to: "info@bamboodigital.in", // Replace with your receiving email for Bamboo
    subject: `New message from ${name}`,
    text: message,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Email sending endpoint for AgenC website (api.your-agenc.ai)
app.post("/verify", async (req, res) => {
  const { otp, email } = req.body;
  const host = req.get("Host"); // Get the subdomain from the request

  const transporter = getTransporter(host);

  if (!transporter) {
    return res.status(400).json({ error: "Invalid subdomain" });
  }

  if (!otp || !email) {
    return res.status(400).json({ error: "Please provide OTP and email" });
  }

  const mailOptions = {
    from: `rishabh@your-agenc.ai`,
    to: `<${email}>`,
    subject: `OTP Verification from AgenC`,
    html: `
      <h1>OTP Verification</h1>
      <p><strong>OTP:</strong> ${otp}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Email sending endpoint for AgenC website (api.your-agenc.ai) - Demo Request
app.post("/send-info", async (req, res) => {
  const { name, phone, email } = req.body;
  const host = req.get("Host"); // Get the subdomain from the request

  const transporter = getTransporter(host);

  if (!transporter) {
    return res.status(400).json({ error: "Invalid subdomain" });
  }

  if (!name || !phone || !email) {
    return res
      .status(400)
      .json({ error: "Please provide name, phone, and email" });
  }

  const mailtoSelf = {
    from: `rishabh@your-agenc.ai`,
    to: `rishabh@your-agenc.ai`, // Replace with your receiving email for AgenC
    subject: `New Demo Request from ${name}`,
    html: `
      <h1>New Demo Request</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `,
  };

  try {
    await transporter.sendMail(mailtoSelf);
    res.status(200).json({ message: "Demo request sent successfully" });
  } catch (error) {
    console.error("Error sending demo request:", error);
    res.status(500).json({ error: "Failed to send demo request" });
  }
});

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

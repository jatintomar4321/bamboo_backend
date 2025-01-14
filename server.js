const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://bamboodigital.in",
        "https://your-agenc.ai",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Create transporters
const bambooTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER_BAMBOO,
    pass: process.env.SMTP_PASS_BAMBOO,
  },
});

const agencTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER_AGENC,
    pass: process.env.SMTP_PASS_AGENC,
  },
});

// Bamboo Digital routes under /bamboo path
const bambooRouter = express.Router();

bambooRouter.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please provide name, email, and message" });
  }

  const mailOptions = {
    from: `<${email}>`,
    to: "info@bamboodigital.in",
    subject: `New message from ${name}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await bambooTransporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// AgenC routes under /agenc path
const agencRouter = express.Router();

agencRouter.post("/verify", async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ error: "Please provide OTP and email" });
  }

  const mailOptions = {
    from: "rishabh@your-agenc.ai",
    to: `<${email}>`,
    subject: "New message from AgenC",
    html: `
      <h1>OTP Verification</h1>
      <p><strong>OTP:</strong> ${otp}</p>
    `,
  };

  try {
    await agencTransporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

agencRouter.post("/send-info", async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res
      .status(400)
      .json({ error: "Please provide name, phone, and email" });
  }

  const mailtoSelf = {
    from: "rishabh@your-agenc.ai",
    to: "rishabh@your-agenc.ai",
    subject: `New message from ${name}`,
    html: `
      <h1>Hey, I just requested a demo</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `,
  };

  try {
    await agencTransporter.sendMail(mailtoSelf);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Mount routers
app.use("/bamboo", bambooRouter);
app.use("/agenc", agencRouter);

// Basic route to check server status
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

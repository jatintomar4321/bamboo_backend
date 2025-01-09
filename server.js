const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Create a transporter using SMTP
const transporter1 = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER_BAMBOO,
    pass: process.env.SMTP_PASS_BAMBOO
  }
})

// Email sending endpoint
app.post('/send-email-bamboo', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message' })
  }

  const mailOptions = {
    from: `<${email}>`,
    to: 'info@bamboodigital.in', // Replace with your receiving email
    subject: `New message from ${name}`,
    text: message,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  }

  try {
    await transporter1.sendMail(mailOptions)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running')
})

const transporter2 = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER_AGENC,
    pass: process.env.SMTP_PASS_AGENC
  }
})

// Email sending endpoint
app.post('/send-email-agenc', async (req, res) => {
  const { otp, email} = req.body

  console.log(otp)
  if (!otp || !email) {
    return res.status(400).json({ error: 'Please provide name, email, and message' })
  }

  const mailOptions = {
    from: `rishabh@your-agenc.ai`,
    to: `<${email}>`, // Replace with your receiving email
    subject: `New message from AgenC`,
    html: `
      <h1>OTP Verification</h1>
      <p><strong>OTP:</strong> ${otp}</p>
    `
  }

  try {
    await transporter2.sendMail(mailOptions)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})


app.post('/send-info', async(req, res) => {
    const { name, phone, email} = req.body

 
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Please provide name, email, and message' })
  }

  const mailtoSelf = {
    from: `rishabh@your-agenc.ai`,
    to: `rishabh@your-agenc.ai`, // Replace with your receiving email
    subject: `New message from ${name}`,
    html: `
      <h1>OTP Verification</h1>
      <p><strong>name:</strong> ${name}</p>
      <p><strong>phone:</strong> ${phone}</p>
    `
  }

  try {
    await transporter2.sendMail(mailtoSelf)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


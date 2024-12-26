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
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Email sending endpoint
app.post('/send-email', async (req, res) => {
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
    await transporter.sendMail(mailOptions)
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

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
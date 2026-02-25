require('dotenv').config()
const mongoose = require('mongoose')
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    startServer(PORT)
  })
  .catch(err => console.error('DB connection error', err.message))
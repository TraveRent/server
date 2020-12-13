require('dotenv').config()
const express = require('express')
const app = express()
const PORT = +process.env.PORT

const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')
const { errorHandler } = require('./middlewares')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(routes)
app.use(errorHandler)

mongoose.connect(process.env.MONGODB_ATLAS_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    // * Send logs
    console.log('mongoose connected into AWS MongoDB Atlas Test Cluster')

    // * Listen the app
    app.listen(PORT, () => {
      console.log('Server is live at http://localhost:' + PORT)
    })
  })
  .catch(console.error)

module.exports = app
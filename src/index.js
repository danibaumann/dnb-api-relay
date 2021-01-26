const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const server = http.createServer(app)
const cors = require('cors')
require('dotenv').config()
const dnbController = require('./controller/dnb.js')

// import Routers
const dnbRouter = require('./router/dnb.js')

app.use(cors('*')) // allow all origin (*) for development

// check if process env is set
if (
  !process.env.DNB_API ||
  !process.env.KEY ||
  !process.env.SECRET ||
  !process.env.PORT
) {
  console.log(
    `Error: Please set DNB_API, PORT, KEY and SECRET environment variables before starting the server.`
  )
  // close server & exit process
  server.close(() => {
    process.exit(0)
  })
}
const port = process.env.PORT

// add body-parser support and basic setup
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// setup logger
app.use(morgan('tiny'))

// login on startup
dnbController.login()

// set interval to get a new auth token every 8h
// you should do an expiresIn check in production
const loginInterval = 8 * 60 * 60 * 1000
setInterval(() => {
  dnbController.login()
}, loginInterval)

// Routing setup
app.use('/v1', dnbRouter)

app.get('*', (req, res, next) => {
  res.status(404).send('404 Page not found')
})

// starting Server
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`Server is running in ${process.env.NODE_ENV} environment.`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  // close server & exit process
  server.close(() => {
    process.exit(1)
  })
})

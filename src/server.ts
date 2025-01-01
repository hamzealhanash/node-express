import fs = require('fs')
import 'dotenv/config'
import http = require('http')
import https = require('https')
import express = require('express')
import {Application} from 'express'
import bodyParser = require('body-parser')
import useRouter = require('./routes/auth')

const privateKey = fs.readFileSync('sslcert/server.key', 'utf8')
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}
const app = express()
const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)
const PORT = process.env.PORT || 3000
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}))
app.use(express.json())


app.use('/api/auth', useRouter as Application)
app.get("/", (_req: any, res: any) => {
    res.send('Hello, Express!')
})

httpServer.listen(PORT, () => {
    console.log(`HTTP server running on PORT: http://localhost:${PORT}`)
})
httpsServer.listen(PORT, () => {
    console.log(`HTTPS server running on PORT: https://localhost:${PORT}`)
})
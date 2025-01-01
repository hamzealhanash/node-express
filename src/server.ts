import 'dotenv/config'
import fs = require('fs')
import http = require('http')
import https = require('https')
import express = require('express')
import useRouter = require('./routes/auth')
import bodyParser = require('body-parser')
import {Application} from 'express'

const privateKey = fs.readFileSync(__dirname + '/../keys/selfsigned.key', 'utf8')
const certificate = fs.readFileSync(__dirname + '/../keys/selfsigned.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}
const app = express()
const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)
const HTTP_PORT = process.env.HTTP_PORT || 2000
const HTTPS_PORT = process.env.HTTPS_PORT || 2443

app.use(bodyParser.urlencoded({limit: "10mb", extended: false}))
app.use(express.json())

app.use('/api/auth', useRouter as Application)
app.get("/", (_req: any, res: any) => {
    res.send("test")
})

httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server running on PORT: http://localhost:${HTTP_PORT}`)
})
httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS server running on PORT: https://localhost:${HTTPS_PORT}`)
})
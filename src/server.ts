import 'dotenv/config'
import fs = require('fs')
import express = require('express')
import {Application} from 'express'
import logger from './functions/logger'
import {createServer as http} from "http"
import bodyParser = require('body-parser')
import {createServer as https} from "https"
import authRouter = require('./routes/auth')
import shipmentRouter = require('./routes/shipment')

const privateKey = fs.readFileSync(__dirname + '/../keys/server.key', 'utf8')
const certificate = fs.readFileSync(__dirname + '/../keys/server.crt', 'utf8')
const HTTP_PORT = process.env.HTTP_PORT || 2000
const HTTPS_PORT = process.env.HTTPS_PORT || 2443
const app = express()

// express config
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}))
app.use(express.json())

// logger
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => logger(req, res, next, null))

//app routes
app.use('/api/auth', authRouter as Application)
app.use('/api/data/shipments', shipmentRouter as Application)
app.get("/", (_req: express.Request, res: express.Response) => res.send("test"))

// running server on http and https
http(app).listen(HTTP_PORT, () => {
    console.log(`HTTP server running on PORT: http://localhost:${HTTP_PORT}`)
})
https({key: privateKey, cert: certificate}, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS server running on PORT: https://localhost:${HTTPS_PORT}`)
})

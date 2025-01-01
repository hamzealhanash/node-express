import express = require('express')
// import package = require("../models/packages")

const router = express.Router()
import jwt = require('jsonwebtoken')

router.get('/:id', async (req: any, res: any) => {

})

function extractToken(req:any, res:any, next:any) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.userId = decoded.userId;
        next();
    });
}

module.exports = router
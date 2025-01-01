import express = require('express')
import jwt = require('jsonwebtoken')
import {packagesData} from "../models/packages"

const router = express.Router()

router.route('/:userId')
        .get(async (req: any, res: any) => {
            try {


                const data = await packagesData(req.params.userId)
                if (!data) res.status(500).json({message: 'Server error'})
                res.send(JSON.stringify(data))
            } catch (err) {
                console.error(err)
                res.status(500).json({message: 'Server error'})
            }
        })
        .put(async (req: any, res: any) => {
            res.send(`User data for user ID: ${req.params.userId}`);
        })
        .delete(async (req: any, res: any) => {
            res.send(`User data for user ID: ${req.params.userId}`);
        })

router.param('userId', (req: any, res: any, next: any, userId) => {
    const token = req.headers['authorization']
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, 'chess-berger-123123-haze-mean', (err: Error, decoded: any) => {
        if (err) return res.sendStatus(403)
        if (userId.toString() !== decoded.uid.toString()) return res.sendStatus(403)
        userId = decoded.uid
        next()
    })
})


module.exports = router
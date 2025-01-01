import express = require('express')
import jwt = require('jsonwebtoken')
import {createHash} from "crypto"

const {createUser, getUser} = require('../models/users')
const router = express.Router()

router.post('/register', async (req: any, res: any) => {
    const {email, username, password} = req.body
    try {
        // Check if user already exists
        const isExisted = await getUser(email, username)
        if (isExisted?.email === email) return res.status(400).json({message: 'account already exists with the same email'})
        if (isExisted?.username === username) return res.status(400).json({message: 'account already exists with the same username'})

        const hashedPassword = createHash('sha256').update(password).digest('hex')
        const newUser = await createUser(username, hashedPassword, email)

        const token = jwt.sign({userId: newUser}, "chess-berger-123123-haze-mean", {expiresIn: '1h'})
        res.status(201).json({message: 'User registered successfully', token})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server error'})
    }
})
router.post('/login', async (req: any, res: any) => {
    const {email, password} = req.body;
    try {
        const user = await getUser(email)
        if (!user) return res.status(401).json({message: 'there is no user with email ' + email})

        const hashedPassword = createHash('sha256').update(password).digest('hex')
        if (user.password !== hashedPassword) return res.status(401).json({message: 'Password mismatch'})

        const token = jwt.sign({userId: user.uid}, "chess-berger-123123-haze-mean", {expiresIn: '1h'})
        res.json({message: 'Login successful', token})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server error'})
    }
})

module.exports = router
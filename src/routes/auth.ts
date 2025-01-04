import express = require('express')
import {sign} from "jsonwebtoken";
import {createHash} from "crypto"
import {createUser, getUser} from '../modules/users'

const router = express.Router()

router.post('/register', async (req: express.Request, res: express.Response) => {
    const {email, username, password} = req.body
    try {
        // Check if user already exists
        const isExisted = await getUser(email, username)
        if (isExisted?.email === email)
            return res.status(409).json({message: 'account already exists with the same email'})
        if (isExisted?.username === username)
            return res.status(409).json({message: 'account already exists with the same username'})

        const hashedPassword = createHash('sha256').update(password).digest('hex')
        const newUser = await createUser(username, hashedPassword, email)

        const token = sign({"uid": newUser}, "chess-berger-123123-haze-mean", {expiresIn: '3h'})
        res.status(201).json({message: 'User registered successfully', token})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server error'})
    }
})
router.post('/login', async (req: express.Request, res: express.Response) => {
    const {email, username, password} = req.body
    try {
        const user = await getUser(email, username)
        if (!user)
            return res.status(404).json({message: 'there is no user with email ' + email})

        const hashedPassword = createHash('sha256').update(password).digest('hex')
        if (user.password !== hashedPassword)
            return res.status(401).json({message: 'Password mismatch'})

        const token = sign({"uid": user.uid}, "chess-berger-123123-haze-mean", {expiresIn: '3h'})
        res.json({token})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server error'})
    }
})

module.exports = router
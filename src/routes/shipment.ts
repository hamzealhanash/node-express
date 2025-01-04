import express = require('express')
import {getShipment} from "../modules/packages"
import authenticate from '../middleware/authenticate'

const router = express.Router()

router.get('/', authenticate, async (req: express.Request, res: express.Response) => {
    try {
        if (req.body.uid === '') return res.status(400).json({message: 'no user id provided'})
        const data = await getShipment(req.body.uid)
        if (!data) return res.status(500).json({message: 'Server error'})

        res.json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Server error'})
    }
})

module.exports = router
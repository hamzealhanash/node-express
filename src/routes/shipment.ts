import express = require('express')
import {getShipment, updateShipments} from "../modules/packages"
import authenticate from '../middleware/authenticate'

const router = express.Router()

router.route('/')
        .get(authenticate, async (req: express.Request, res: express.Response) => {
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
        .put(authenticate, async (req: express.Request, res: express.Response) => {
            if (!req.body.state) return res.status(401).json({message: "request doesn't have state parameter"})
            try {
                if (req.body.uid === '') return res.status(400).json({message: 'no user id provided'})
                const data = await updateShipments(req.body.uid, req.body.pid, req.body.state)
                if (!data) return res.status(400).json({message: 'address not found'})
                return res.status(200).json({message: "package status updated successfully"})
            } catch (err) {
                console.error(err)
                res.status(500).json({message: 'Server error'})
            }
        })


module.exports = router
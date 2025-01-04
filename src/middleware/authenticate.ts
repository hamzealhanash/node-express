import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'

export default function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({message: 'no token provided'})
    try {
        // @ts-ignore
        jwt.verify(token, 'chess-berger-123123-haze-mean', (error, decode) => {
            if (error) {

                if (error instanceof jwt.TokenExpiredError)
                    return res.status(403).json({message: 'Token expired'})
                else if (error instanceof jwt.NotBeforeError)
                    return res.status(403).json({message: 'Token not initialized yet'})
                else if (error instanceof jwt.JsonWebTokenError)
                    return res.status(403).json({message: 'Token is not recognized'})
                else
                    return res.status(500).json({message: 'Failed to verify token'})
            }
            //@ts-ignore
            req.body = {...req.body, ...decode}
            return next()
        })

    } catch (error) {
        console.error(error)
        return res.status(403).json({message: 'invalid request'})
    }
}
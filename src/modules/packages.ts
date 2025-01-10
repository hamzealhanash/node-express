import {Connection, createConnection} from "mariadb";

async function getShipment(userId: string) {
    let db: Connection
    try {
        db = await connect()
        const [user] = await db.query("SELECT username FROM test1.authInfo where uid= ? ", [userId])
        if (!user) new Error("could not find user")
        return await db.query("SELECT * FROM test1.Shipment where transporter = ? ", [user?.username])
    } catch (error) {
        throw error
    } finally {
        if (db) await db.end()
    }
}

async function updateShipments(userId: string, packageId: string, state: string) {
    let db: Connection
    try {
        db = await connect()
        const [user] = await db.query("SELECT username FROM test1.authInfo where uid= ? ", [userId])
        if (!user) new Error("could not find user")
        const [update] = await
                db.query("UPDATE test1.packagesDetails SET state = ? WHERE carrier = ? and packageId = ? ", [state, user?.username, packageId])
        if (!update) new Error("Could not update package status")
        return update
    } catch (err) {
        throw err
    } finally {
        if (db) await db.end()
    }
}


async function connect() {
    return await createConnection({
        host: "localhost",
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })
}

export {getShipment, updateShipments}

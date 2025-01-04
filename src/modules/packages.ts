import {Connection, createConnection} from "mariadb";

async function getShipment(uid: string) {
    let db: Connection
    try {
        db = await connect()
        const [user] = await db.query("SELECT username FROM test1.authInfo where uid= ? ", [uid])
        if (!user) new Error("could not find user")
        return await db.query("SELECT * FROM test1.Shipment where transporter = ? ", [user?.username])
    } catch (error) {
        throw error
    } finally {
        if (db) await db.end()
    }
}

// async function updateShipments() {
// }


async function connect() {
    return await createConnection({
        host: "localhost",
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })
}

export {getShipment}

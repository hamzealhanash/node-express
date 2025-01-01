import mariadb = require('mariadb')


async function packages(uid: string) {
    let db: mariadb.Connection
    try {
        db = await connect()
        // take the user id from the token and get the username from the table to get all the user shipment
        const user = await db.query("SELECT username FROM test1.authInfo where uid= ? ", [uid])
        if (!user) new Error("could not find user")
        const [shipment] = await db.query("SELECT * FROM test1.Shipment where transporter = ? ", [user?.username])
        return shipment
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function connect() {
    return await mariadb.createConnection({
        host: "localhost",
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })
}

module.exports = packages
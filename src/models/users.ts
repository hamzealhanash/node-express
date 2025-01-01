import mariadb = require('mariadb');

async function createUser(username: string, password: string, email: string) {
    let db: mariadb.Connection
    try {
        db = await connect()
        await db.execute("INSERT INTO usersData (username) VALUES (?)", [username])
        await db.execute("INSERT INTO authInfo (username, password, email) VALUES (?,?,?)",
                [username, password, email])
        const [row] = await db.execute("SELECT uid FROM authInfo where username = ? ", [username])
        return row?.uid
    } catch (err) {
        console.error('Error occurred while creating user:', err)
        throw err
    } finally {
        if (db) await db.end()
    }
}

async function getUser(email: string, username: string) {
    let db: mariadb.Connection
    try {
        db = await connect()
        const [rows] = await db.execute("SELECT * FROM authInfo WHERE email = ? or username = ?", [email, username])
        return rows
    } catch (error) {
        console.error('Error occurred while getting user:', error);
        throw error
    } finally {
        if (db) await db.end();
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

module.exports = {createUser, getUser}
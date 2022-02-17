const mysql = require('mysql')
require('dotenv').config({ path: './config/.env' })

// connexion à la BDD
const pool = mysql.createConnection({
    multipleStatements: true,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    host: process.env.HOST,
    port: process.env.PORT_DB,
})

pool.connect((error) => {
    if (error) {
        return console.log('connexion à la base de données echouée!!!')
        throw error
    } else {
        console.log('connexion à la base de données réussie !')
    }
})
module.exports = pool

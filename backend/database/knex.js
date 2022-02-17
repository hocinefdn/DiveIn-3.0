const knex = require('knex')
require('dotenv').config({ path: './config/.env' })

const db = knex({
    client: 'mysql',
    connection: {
        // host: '127.0.0.1',
        // port: 3306,
        // user: 'root',
        // password: '',
        // database: 'divein',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        host: process.env.HOST,
        port: process.env.PORT_DB,
    },
})

module.exports = db

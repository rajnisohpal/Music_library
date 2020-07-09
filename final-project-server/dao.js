//Database Access Object
//re-usable module to connect DB_test database
const { Client } = require('pg')

let DB = {}

function connect () {
    DB = new Client({
        host: 'localhost',
        port: 5432,
        database: 'final-project-music-albums',
        user: 'postgres',
        password: 'postgres'
    })

    DB.connect((error) => {
        if (error) {
            throw error
        }
        else{
            console.log("Connected to Database")
        }
    })
}

function query (query_str, values, resultCallback) {
    DB.query(query_str, values, (error, result) => {
        if (error) {
            throw error
        }
        resultCallback(result)
    })
}

function disconnect () {
    DB.end()
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    query: query
}
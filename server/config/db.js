import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if(err) {
        console.error("Bağlantı hatası:", err)
        return
    }
    console.log("Bağlantı başarılı!")
})

export default connection
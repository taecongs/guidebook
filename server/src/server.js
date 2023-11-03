const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const PORT = 3001;


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "taecongs@",
    database: "guidebook",
});


app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
}))

app.use(express.urlencoded({extended:true}))

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})


app.get("/guidebook", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    const sql = "SELECT * FROM guidebook";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Database query error");
        } else {
            res.send(result);
        }
    });
});
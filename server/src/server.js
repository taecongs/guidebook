const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require('multer');
const path = require("path");

const app = express();
const PORT = 4001;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const serial = req.body.serial; // 받아온 serial 값 사용
        cb(null, `${serial}${ext}`);
    }
});

const upload = multer({ storage: storage });

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "taecongs@",
    database: "guidebook",
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // 정적 파일 제공

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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

app.post('/upload', upload.single('image'), (req, res) => {
    const { serial, name, detail, type1, type2, height, category, gender, weight, characteristic } = req.body;
    const imagePath = req.file.path; // 이미지 파일 경로

    const sql = "INSERT INTO guidebook (id, serial, name, detail, type1, type2, height, category, gender, weight, characteristic, image) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [serial, name, detail, type1, type2, height, category, gender, weight, characteristic, imagePath], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Database query error");
        } else {
            res.status(200).send("Data inserted successfully");
        }
    });
});
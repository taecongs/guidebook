const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require('multer');
const path = require("path");

const app = express();
const PORT = 4001;


/*====================================================
    // 파일 업로드를 위한 Multer 설정
=====================================================*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../client/public/uploads'));   // 업로드 된 파일 저장 경로
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);   // 파일 확장자 추출
        const serial = req.body.serial;   // 받아온 serial 값 사용
        cb(null, `${serial}${ext}`);   // 파일 이름 생성: 시리얼넘버버 + 확장자
    }
});

const upload = multer({ storage: storage });   // Multer 미들웨어 생성


/*====================================================
    // MySQL 데이터베이스 연결 설정
=====================================================*/
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "taecongs@",
    database: "guidebook2",
});


/*====================================================
    // 미들웨어 설정
=====================================================*/
app.use(cors());   // CORS 미들웨어
app.use(express.json());   // JSON 파싱 미들웨어
app.use(express.urlencoded({ extended: true }));   // URL 인코딩 파싱 미들웨어
app.use('/uploads', express.static(path.join(__dirname, '../../client/public/uploads')));   // 정적 파일 제공


/*====================================================
    // 서버 실행
=====================================================*/
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/*====================================================
    // 시리얼넘버 중복 확인
=====================================================*/
app.get("/checkDuplicateSerial/:serial", (req, res) => {
    const { serial } = req.params;

    const sql = "SELECT COUNT(*) AS count FROM guidebook WHERE serial = ?";

    db.query(sql, [serial], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Database query error");
        } else {
            const count = result[0].count;
            res.send({ isDuplicate: count > 0 });
        }
    });
});


/*====================================================
    // 모든 정보 가져오기
=====================================================*/
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


/*====================================================
    // 특정 시리얼번호에 해당하는 정보 가져오기
=====================================================*/
app.get("/guidebook/:serial", (req, res) => {
    const { serial } = req.params;

    const sql = "SELECT * FROM guidebook WHERE serial = ?";

    db.query(sql, [serial], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).send("Database query error");
        } else if (result.length === 0) {
            res.status(404).send("Pokemon not found");
        } else {
            res.send(result[0]);
        }
    });
});


/*====================================================
    // 포켓몬 정보 업로드
=====================================================*/
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
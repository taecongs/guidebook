const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require('multer');
const path = require("path");
const moment = require('moment-timezone');

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
        cb(null, `${serial}${ext}`);   // 파일 이름 생성: 시리얼넘버 + 확장자
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
    database: "guidebook4",
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

    // serial 값과 일치하는 행의 수를 반환
    const sql = "SELECT COUNT(*) AS count FROM guidebook WHERE serial = ?";

    db.query(sql, [serial], (err, result) => {
        if (err) {
            console.error(err);
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

    // "guidebook" 테이블에서 모든 데이터 선택
    // const sql = "SELECT * FROM guidebook";

    // "guidebook" 테이블에서 데이터를 선택하면서, 포린 키를 사용하여 "pokemon_type" 테이블과 조인하여 각 타입에 대한 정보를 추가로 선택한다.
    const sql = `
        SELECT g.*, 
            pt.type_id 'main_type_id', pt.type_name 'main_type_name', pt.color 'main_type_color', pt.type_image 'main_type_image',
            pt2.type_id 'sub_type_id', pt2.type_name 'sub_type_name', pt2.color 'sub_type_color', pt2.type_image 'sub_type_image'
            FROM guidebook g 
            left join pokemon_type pt on g.type1 = pt.type_id
            left join pokemon_type pt2 on g.type2 = pt2.type_id
    `

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
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

    // const sql = "SELECT * FROM guidebook WHERE serial = ?";

    // 특정 serial 값과 일치하는 포켓몬에 대한 정보와 그 포켓몬의 진화 정보를 함께 반환
    /*
    const sql = `
        select gui.*,(
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', g.id,
                        'name', g.name,
                        'serial', g.serial,
                        'type1', g.type1,
                        'type2', g.type2,
                        'image', g.image 
                    )
                ) AS evo_list
                FROM guidebook g
                JOIN evolution e1 ON g.id = e1.pkm_id
                JOIN evolution e2 ON e1.org_id = e2.org_id
                WHERE e2.pkm_id = (
                    SELECT id FROM guidebook WHERE serial = ?
                ) 
        ) as 'evo_list'
        from guidebook gui WHERE serial = ?;
    `;
    */

    const sql = `
        SELECT gui.*, (
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', g.id,
                        'name', g.name,
                        'serial', g.serial,
                        'type1', g.type1,
                        'type2', g.type2,
                        'image', g.image 
                    )
                ) AS evo_list
            FROM guidebook g
            JOIN evolution e1 ON g.id = e1.pkm_id
            JOIN evolution e2 ON e1.org_id = e2.org_id
            WHERE e2.pkm_id = (
                SELECT id FROM guidebook WHERE serial = ?
            ) 
        ) AS 'evo_list',
        pt_main.type_id 'main_type_id', pt_main.type_name 'main_type_name', pt_main.color 'main_type_color', pt_main.type_image 'main_type_image',
        pt_sub.type_id 'sub_type_id', pt_sub.type_name 'sub_type_name', pt_sub.color 'sub_type_color', pt_sub.type_image 'sub_type_image'
        FROM guidebook gui
        LEFT JOIN pokemon_type pt_main ON gui.type1 = pt_main.type_id
        LEFT JOIN pokemon_type pt_sub ON gui.type2 = pt_sub.type_id
        WHERE gui.serial = ?;
    `

    db.query(sql, [serial, serial], (err, result) => {
        if (err) {
            console.error(err);
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
    const { serial, name, detail, type1, type2, height, category, gender, weight, characteristic1, characteristic2 } = req.body;

    // 이미지 파일 경로
    const imagePath = req.file.path; 

    // 현재 한국 시간 정의
    const formattedDate = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

    const sql = "INSERT INTO guidebook (id, serial, name, detail, type1, type2, height, category, gender, weight, characteristic1, characteristic2, image, upload_date) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [serial, name, detail, type1, type2, height, category, gender, weight, characteristic1, characteristic2, imagePath, formattedDate], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database query error");
        } else {
            res.status(200).send("Data inserted successfully");
        }
    });
});


/*====================================================
    // 포켓몬 진화 정보 업로드
=====================================================*/
app.post('/evolution', (req, res) => {
    const {org_id, pkm_id, level} = req.body;

    const sql = "INSERT INTO evolution (org_id, pkm_id, evolution_level) VALUES (?, ?, ?)";
    db.query(sql, [org_id, pkm_id, level], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database query error");
        } else {
            res.status(200).send("Evolution data inserted successfully");
        }
    });
})

/*====================================================
    // 포켓몬 정보 수정 업로드
=====================================================*/
app.put('/edit/:serial', upload.single('image'), (req, res) => {
    const {serial} = req.params;
    const {name, detail, type1, type2, height, category, gender, weight, characteristic1, characteristic2} = req.body;
    
    // [True] 파일이 업로드 되었다면 해당 이미지 파일의 경로를 가져온다.
    // [False] 파일이 업로드 되지 않았다면 imagePath 가 null이 된다.
    const imagePath = req.file ? req.file.path : null;

    // 이미지를 변경하지 않는 경우를 위해 기존 이미지 경로 가져온다.
    const getImagePathSQL = "SELECT image FROM guidebook WHERE serial = ?";
    db.query(getImagePathSQL, [serial], (err, result) => {
        if(err){
            console.error(err);
            res.status(500).send("Database query error");
        } else{
            // [True] 배열이 비어있지 않은 경우 이전 이미지의 경로를 가져온다.
            // [False] 배열이 비어있으면 prevImagePath에 null을 할당한다.
            const prevImagePath = result.length > 0 ? result[0].image : null;

            // 이미지를 변경 한 경우 기존 이미지 파일 삭제
            if(prevImagePath && imagePath && prevImagePath !== imagePath){
                const fs = require('fs');
                const filePath = path.join(__dirname, '../../client/public', prevImagePath);
                fs.unlink(filePath, (err) => {
                    if(err){
                        console.error(err);
                    }
                });
            }

            // 테이블 업데이트 위해 정의
            const updateSQL = `
                UPDATE guidebook
                SET 
                    name = ?,
                    detail = ?,
                    type1 = ?,
                    type2 = ?,
                    height = ?,
                    category = ?,
                    gender = ?,
                    weight = ?,
                    characteristic1 = ?,
                    characteristic2 = ?,
                    ${imagePath ? ', image = ?' : ''}
                    edit_date = NOW()
                WHERE serial = ?;
            `;

            // SQL문에 전달할 매개변수들을 배열로 정의
            const params = [
                name,
                detail,
                type1,
                type2,
                height,
                category,
                gender,
                weight,
                characteristic1,
                characteristic2,
                ...(imagePath ? [imagePath] : []),
                serial,
            ];

            db.query(updateSQL, params, (err, result) => {
                if(err){
                    console.error(err);
                    res.status(500).send("Database query error");
                } else{
                    res.status(200).send("Data updated successfully");
                }
            });
        }
    })
}) 
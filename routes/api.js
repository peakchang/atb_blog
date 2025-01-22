import express from "express";
import { sql_con } from '../back-lib/db.js'
import bcrypt from "bcrypt";
import cheerio from "cheerio";

import moment from "moment-timezone";
const koreaTime = moment.tz('Asia/Seoul');



import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
    res.send('asldfjalisjdfliajsdf')
})


apiRouter.get('/moveboard', async (req, res) => {
    console.log('안들어오는거야?!?!?!');
    
    try {
        const getLandBoardDataQuery = "SELECT * FROM land_board WHERE bo_type IS NULL or bo_type = 'blog' LIMIT 1;";
        const [landBoardData] = await sql_con.promise().query(getLandBoardDataQuery,);
        if (landBoardData.length > 0) {
            const moveData = landBoardData[0];
            const insertFreeBoardForLandBoardQuery = "INSERT INTO board (bo_category,bo_subject,bo_content,bo_created_at) VALUES (?,?,?,?)";
            await sql_con.promise().query(insertFreeBoardForLandBoardQuery, [moveData.bo_category, moveData.bo_subject, moveData.bo_content, moment(moveData.bo_created_at).format('YYYY-MM-DD HH:mm:ss')]);

            const deleteLandBoardQuery = "DELETE FROM land_board WHERE bo_id =?";
            await sql_con.promise().query(deleteLandBoardQuery, [moveData.bo_id]);
            return res.send('옮기기 작업!!!')
        }else{
            return res.send('작업할게 없음!!!')
        }
    } catch (error) {
        console.error(error.message);
    }
})



apiRouter.post('/python_writer', async (req, res) => {
    let status = true;
    const body = req.body;
    console.log(body);

    let content = ""
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    for (let i = 0; i < body.content_arr.length; i++) {
        const line = body.content_arr[i];
        const lineChk = line.split('|')
        if (lineChk[0] == 'img_line') {
            content = content + `<p class="ql-align-center"><img class="inline-block" src="${lineChk[1]}"></p><p class="ql-align-center"><br></p>`
        } else {
            content = content + `<p class="ql-align-center">${line}</p><p class="ql-align-center"><br></p>`
        }
    }

    try {
        const insertBoardQuery = "INSERT INTO land_board (bo_category, bo_subject, bo_content, bo_type, bo_created_at) VALUES (?,?,?,?,?)";
        await sql_con.promise().query(insertBoardQuery, ['news', body.subject, content, 'blog', now]);
    } catch (error) {
        status = false;
    }

    res.json({ status })
})


apiRouter.post('/python_writer_img_uploads', upload.array('image', 10), (req, res) => {  // 최대 10개의 파일 처리

    console.log('들어는 오는거니?!?!??!!');

    let status = true;
    const fileInfos = [];

    const protocol = req.protocol;
    // 현재 호스트 (localhost, 도메인 등)
    const host = req.get('host');  // req.get('host')는 호스트와 포트를 모두 포함
    // 현재 URL (프로토콜 + 호스트)
    const fullUrl = `${protocol}://${host}`;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ message: 'No files uploaded' });
        }
        // 파일 처리 반복문
        req.files.forEach((file) => {
            // 저장 경로 설정
            const outputPath = folderChk() + `/${Date.now()}_${file.originalname}`;
            console.log(outputPath);
            // 파일 시스템에 저장 (메모리에서 파일로 저장)
            fs.writeFileSync(outputPath, file.buffer);
            const putPutHref = outputPath.replace(/^public\/uploads\/pyimg/, `${fullUrl}/py_img`);
            fileInfos.push({ filename: file.originalname, path: outputPath, href: putPutHref });
        });

        // 파일 정보 반환
        // res.status(200).send({ message: 'Files uploaded successfully', files: fileInfos });
        console.log(fileInfos);


    } catch (err) {
        console.error(err.message);
        status = false
    }

    res.status(200).json({ status, fileInfos })
});

apiRouter.post('/update_visit_count', async (req, res, next) => {
    let status = true;

    const body = req.body;
    console.log(body);

    console.log(process.env.SERVER_IP);

    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('going to chkeck~~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('방문자의 IP 주소:', ipAddress);
    console.log(body.ld_domain);
    console.log(body.referrer);
    if (ipAddress != process.env.SERVER_IP) {

        const userAgent = req.get('user-agent');
        console.log(userAgent);

        try {
            const now = moment().format('YYYY-MM-DD HH:mm:ss');
            const insertVisitList = "INSERT INTO site_visit (sv_domain, sv_ip, sv_ua, sv_referrer, sv_created_at) VALUES (?,?,?,?,?)";
            await sql_con.promise().query(insertVisitList, [body.ld_domain, ipAddress, userAgent, body.referrer, now]);
        } catch (error) {
            status = false;
        }

    }
    res.json({ status })
})

apiRouter.get('/test_time', (req, res, next) => {
    const now1 = koreaTime.format('YYYY-MM-DD HH:mm:ss');
    const now2 = moment().format('YYYY-MM-DD HH:mm:ss')
    let today = new Date();
    const now3 = moment.tz(today, 'Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

    res.json({ status: true })

})

apiRouter.post('/', async (req, res, next) => {
    const body = req.body;
    let validPassword = true;
    try {
        const getPwdQuery = "SELECT cf_pwd FROM config WHERE cf_base='base';";
        const getPwd = await sql_con.promise().query(getPwdQuery);
        const get_pwd = getPwd[0][0];
        validPassword = await bcrypt.compare(body.pwdVal, get_pwd.cf_pwd);

    } catch (error) {
        console.error(error.message);
        validPassword = false;
    }
    res.json({ validPassword })
})

apiRouter.post('/add_post_list', async (req, res, next) => {
    const body = req.body;
    let listStatus = true;
    const getPostListQuery = "SELECT * FROM board ORDER BY bo_id DESC LIMIT ?, 10";
    const getPostList = await sql_con.promise().query(getPostListQuery, [body.postNum]);
    const posts = getPostList[0];

    for (let i = 0; i < posts.length; i++) {
        const date = new Date(posts[i].bo_created_at);
        const year = date.getFullYear().toString().slice(2); // '23'
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // '07'
        const day = date.getDate().toString().padStart(2, "0"); // '14'
        posts[i]["date_str"] = `${year}.${month}.${day}`;


        const $ = cheerio.load(posts[i]["bo_content"]);
        const imageTag = $("img");
        posts[i]["img_link"] = imageTag.length
            ? imageTag.eq(0).attr("src")
            : "/no-image.png";
        posts[i]["text"] = $("p").text();
    }


    if (posts.length < 10) {
        listStatus = false;
    }

    res.json({ posts, listStatus })
})



function folderChk() {
    let setFolder
    const now = moment().format('YYMMDD')

    try {
        fs.readdirSync(`public`);
    } catch (error) {
        console.error(error.message);
        fs.mkdirSync(`public`);
    }

    try {
        fs.readdirSync(`public/uploads`);
    } catch (error) {
        fs.mkdirSync(`public/uploads`);
    }

    try {
        fs.readdirSync(`public/uploads/pyimg`);
    } catch (error) {
        fs.mkdirSync(`public/uploads/pyimg`);
    }

    try {
        fs.readdirSync(`public/uploads/pyimg/pyimg${now}`);
    } catch (error) {
        fs.mkdirSync(`public/uploads/pyimg/pyimg${now}`);
    }
    setFolder = `public/uploads/pyimg/pyimg${now}`

    return setFolder;
}

export { apiRouter }
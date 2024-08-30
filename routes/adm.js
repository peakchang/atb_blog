import express from "express";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from "../back-lib/lib.js";
import fs from 'fs'
import axios from 'axios';
import moment from "moment-timezone";

const admRouter = express.Router();


// 자동 글쓰기 admin

admRouter.get('/write_post_ready', async (req, res, next) => {
    let status = true;

    const api_key = process.env.GPT_API_KEY;

    const headers = {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
    }

    const getWritListQuery = "SELECT * FROM board_ready WHERE br_date <= CURDATE()";
    const getWritList = await sql_con.promise().query(getWritListQuery);
    const get_write_list = getWritList[0];
    for (const writeData of get_write_list) {

        const userInput = `'${writeData.br_subject}' 이라는 제목으로 700자 내외 블로그에 작성할 글좀 개행좀 많이 넣어서 작성해줘`
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `${userInput}` }],
                },
                { headers }
            );
            const chatGptResponse = response.data.choices[0].message.content;

            const now = moment().format('YYYY-MM-DD hh:mm:ss');

            // 개행을 기준으로 배열로 변경 > 빈곳 삭제하고(filter) 태그 씌워서 리턴~ (map)
            const chatArr = chatGptResponse.split('\n').filter(item => item !== undefined && item !== null && item !== "").map(item => `<p class="ql-align-center">${item}</p><p class="ql-align-center"><br></p>`);

            // 배열의 절반값 구하기
            const halfIndex = Math.round(chatArr.length / 2);

            // 이미지 배열로 변경
            const imgArr = writeData.br_imgs.split(',')

            // 첫번째 이미지 글 중간에 끼워넣기
            const middleImgValue = `<p class="ql-align-center"><img class="inline-block" src="${imgArr[0]}"></p><p class="ql-align-center"><br></p>`
            chatArr.splice(halfIndex, 0, middleImgValue);

            // 두번째 이미지 글 마지막에 끼워넣고 끝내기
            const resultContent = chatArr.join('') + (imgArr[1] ? `<p class="ql-align-center"><img class="inline-block" src="${imgArr[1]}"></p>` : "");

            // 서버에 업로드
            const insertContentQuery = "INSERT INTO land_board (bo_category,bo_subject,bo_content,bo_type,bo_created_at) VALUES (?,?,?,?,?)"
            await sql_con.promise().query(insertContentQuery, [writeData.br_category, writeData.br_subject, resultContent, 'blog', now]);

            // 사용한 내용은 삭제하기~
            const deleteQuery = "DELETE FROM board_ready WHERE br_id =?"
            await sql_con.promise().query(deleteQuery, [writeData.br_id]);

        } catch (err) {
            console.error('Error: ' + err.message);
        }
    }

    res.json({ status })
})


admRouter.post('/delete_imgs', async (req, res, next) => {
    let status = true;
    const delImgArr = req.body.delImgArr;
    const currentUrl = req.protocol + '://' + req.get('host')
    for (let i = 0; i < delImgArr.length; i++) {
        const delPath = `public/uploads${delImgArr[i].replace(currentUrl, "")}`
        try {
            fs.unlinkSync(delPath)
        } catch (error) {
            console.error(error);
        }
    }
    res.json({ status })
})


admRouter.post('/delete_ready', async (req, res, next) => {
    let status = true;
    const deleteList = req.body.delete_list;
    for (let i = 0; i < deleteList.length; i++) {
        try {
            const br_id = deleteList[i];
            const deleteQuery = `DELETE FROM board_ready WHERE br_id =?`
            await sql_con.promise().query(deleteQuery, [br_id]);
        } catch (error) {
            status = false;
        }
    }
    res.json({ status })
})


admRouter.post('/update_ready', async (req, res, next) => {
    let status = true;
    const body = req.body;
    if (body.type == 'upload') {
        try {
            delete body.type
            delete body.br_id
            const queryStr = getQueryStr(body, 'insert');
            const insertQuery = `INSERT INTO board_ready (${queryStr.str}) VALUES (${queryStr.question})`;
            const res = await sql_con.promise().query(insertQuery, queryStr.values);

        } catch (error) {
            console.error(error.message);
            status = false;
        }
    } else {
        try {
            const brId = body.br_id
            delete body.type
            delete body.br_id
            const queryStr = getQueryStr(body, 'update');
            queryStr.values.push(brId)
            const updateQuery = `UPDATE board_ready SET ${queryStr.str} WHERE br_id = ?`
            await sql_con.promise().query(updateQuery, queryStr.values);
        } catch (error) {
            console.error(error.message);
            status = false;
        }
    }
    res.json({ status })
})

admRouter.get('/ready_list', async (req, res, next) => {

    let status = true;
    let ready_list = [];

    try {
        const getReadyListQuery = "SELECT * FROM board_ready ORDER BY br_id DESC";
        const getReadyList = await sql_con.promise().query(getReadyListQuery);
        ready_list = getReadyList[0]
    } catch (error) {

    }
    res.json({ status, ready_list })
})


admRouter.post('/get_site_visit', async (req, res, next) => {
    let status = true;
    let site_visit_list = [];

    try {
        const getSiteVisitListQuery = "SELECT * FROM site_visit ORDER BY sv_id DESC";
        const getSiteVisitList = await sql_con.promise().query(getSiteVisitListQuery);
        site_visit_list = getSiteVisitList[0]
    } catch (err) {
        console.error(err.message);
        status = false;
    }

    res.json({ status, site_visit_list })
})


// chat 부분 끝~~~~



admRouter.post('/setting', async (req, res, next) => {

    let status = true;
    const body = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        if (body.configDataList.cf_pwd) {
            const hashed = await bcrypt.hash(body.configDataList.cf_pwd, salt);
            const cfUpdateQuery = "UPDATE config SET cf_pwd=? WHERE cf_base=?";
            await sql_con.promise().query(cfUpdateQuery, [hashed, 'base']);
        }

    } catch (error) {
        // console.error(error);
        status = false;
    }
    res.json({ status })
})



// 사이트~~~~~~~~~~~~~
admRouter.get('/get_site_main', async (req, res, next) => {
    let status = true;

    let site_list = [];
    try {
        const loadSitelistQuery = "SELECT st_name, st_created_at, st_id FROM site";
        const loadSitelist = await sql_con.promise().query(loadSitelistQuery);
        site_list = loadSitelist[0]
    } catch (error) {
        status = false;
    }

    res.json({ status, site_list })
})


admRouter.post('/load_site_modify', async (req, res, next) => {

    let status = true;
    const getId = req.body.getId;
    let land_modify_val = {}
    try {
        const loadLandModifyQuery = "SELECT * FROM site WHERE st_id = ?"
        const loadLandModify = await sql_con.promise().query(loadLandModifyQuery, [getId]);
        land_modify_val = loadLandModify[0][0]
    } catch (error) {
        status = false;
    }

    res.json({ status, land_modify_val })
})

admRouter.post('/upload_data', async (req, res, next) => {
    let status = true;
    let body = req.body.allData;

    const st_id = body['st_id'];
    const type = req.body.type;
    delete body['st_id'];

    if (type == "upload") {
        try {
            const queryData = getQueryStr(body, 'insert', 'st_created_at');
            const insertLandQuery = `INSERT INTO site (${queryData.str}) VALUES (${queryData.question})`
            await sql_con.promise().query(insertLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    } else {
        delete body['st_created_at'];
        delete body['st_updated_at'];

        try {
            const queryData = getQueryStr(body, 'update', 'st_updated_at');
            queryData.values.push(st_id);;
            const updateLandQuery = `UPDATE site SET ${queryData.str} WHERE st_id = ?`;
            await sql_con.promise().query(updateLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    }

    res.json({ status })
})


admRouter.post('/delete_mainimg', async (req, res, next) => {

    let status = true;
    const delPath = req.body.logoUrlPath;
    const ldId = req.body.ld_id;

    try {
        await fs.unlink(delPath, (err) => {
            console.error(err);
        })
        const deleteLogoQuery = "UPDATE land SET ld_logo = '' WHERE ld_id = ?";
        await sql_con.promise().query(deleteLogoQuery, [ldId]);
    } catch (error) {
        status = false
        console.error(error);
    }
    res.json({ status })
})



export { admRouter }
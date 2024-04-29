import express from "express";
import { sql_con } from '../back-lib/db.js'
import fs from 'fs'
const boardRouter = express.Router();
import { getQueryStr } from "../back-lib/lib.js";
import moment from "moment-timezone";


boardRouter.post('/load_content', async (req, res, next) => {
    let status = true;
    console.log('alsjdfilajsldifj');
    const getId = req.body.getId
    let all_data = {}

    try {
        const getDataQuery = "SELECT * FROM board WHERE bo_id = ?"
        const getData = await sql_con.promise().query(getDataQuery, [getId]);
        all_data = getData[0][0]
    } catch (error) {

    }
    res.json({ status, all_data })
})


boardRouter.post('/reply_regist', async (req, res, next) => {

    try {
        const body = req.body;
        const randomIP = generateRandomIP();
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const bodyArr = [body.getId, randomIP, body.convertTag, now]
        const insertReplyQuery = "INSERT INTO reply (re_type, re_parent, re_ip,re_content, re_created_at) VALUES ('write', ?,?,?,?)"
        await sql_con.promise().query(insertReplyQuery, bodyArr);
    } catch (error) {
        console.error(error.message);
    }

    res.status(200).json({ status: 'success' })
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomIP() {
    const ipComponents = [];
    for (let i = 0; i < 4; i++) {
        const component = getRandomInt(0, 255);
        ipComponents.push(component);
    }
    return ipComponents.join('.');
}








boardRouter.post('/delete', async (req, res, next) => {
    const data = req.body;

    let delImgList = data.contentArr
    try {
        const deletePostQuery = "DELETE FROM board WHERE bo_id = ?";
        await sql_con.promise().query(deletePostQuery, [data.getId]);
    } catch (error) {
        console.error(error.message);
    }

    for (let i = 0; i < delImgList.length; i++) {
        if (delImgList[i]) {
            try {
                fs.unlinkSync(delImgList[i]);
            } catch (error) {
                console.error(error.message);
            }
        }
    }
    res.json({ status: 'success' });
})


// boardRouter.post('/modify', async (req, res, next) => {
//     let status = 'success';
//     const body = req.body;

//     const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     const now = moment().format('YYYY-MM-DD HH:mm:ss');

//     try {
//         const updateContentQuery = "UPDATE board SET bo_category=?, bo_subject=?, bo_content=?,bo_keyword=?,bo_description=?, bo_updated_at=? WHERE bo_id=?";
//         await sql_con.promise().query(updateContentQuery, [body.category, body.subject, body.content, body.keyword, body.description, now, body.getId]);
//     } catch (error) {
//         console.error(error.message);
//         status = 'fail';
//     }

//     const delImgList = body.contentArr
//     for (let i = 0; i < delImgList.length; i++) {
//         if (delImgList[i]) {
//             try {
//                 fs.unlinkSync(delImgList[i]);
//             } catch (error) {
//                 console.error(error.message);
//             }
//         }
//     }

//     res.json({ status })
// })



boardRouter.post('/write', async (req, res, next) => {
    let status = true;
    const body = req.body;
    if (body.type == 'upload') {
        const queryData = getQueryStr(body.allData, 'insert', 'bo_created_at');
        console.log(queryData);

        try {
            const insertBoardQuery = `INSERT INTO board (${queryData.str}) VALUES (${queryData.question})`
            await sql_con.promise().query(insertBoardQuery, queryData.values);
        } catch (error) {
            console.error(error.message);
            status = false;
        }
    } else {

        delete body.allData['bo_created_at'];
        delete body.allData['bo_updated_at'];

        const queryData = getQueryStr(body.allData, 'update', 'bo_updated_at');
        queryData.values.push(body.allData['bo_id'])
        delete body.allData['bo_id'];
        try {
            const updateBoardQuery = `UPDATE board SET ${queryData.str} WHERE bo_id = ?`;
            await sql_con.promise().query(updateBoardQuery, queryData.values);
        } catch (error) {
            status = false;
            console.error(error.message);
        }
    }

    const imgList = body.contentArr
    for (let i = 0; i < imgList.length; i++) {
        if (imgList[i]) {
            try {
                fs.unlinkSync(imgList[i]);
            } catch (error) {
                console.error(error);

            }
        }
    }
    res.json({ status })
})



boardRouter.post('/delete_mainimg', async (req, res, next) => {

    let status = true;
    const delPath = req.body.mainImgUrlPath;
    // const ldId = req.body.ld_id;

    console.log(delPath);

    try {
        await fs.unlink(delPath, (err) => {
            console.log(err);
        })
        // const deleteLogoQuery = "UPDATE board SET  = '' WHERE ld_id = ?";
        // await sql_con.promise().query(deleteLogoQuery, [ldId]);
    } catch (error) {
        status = false
        console.error(error);
    }
    res.json({ status })
})


boardRouter.post('/upload_land_data', async (req, res, next) => {
    let status = true;
    let body = req.body.allData;
    console.log(body);

    const bo_id = body['bo_id'];
    const type = req.body.type;
    delete body['bo_id'];

    // console.log(st_id);

    console.log(type);

    if (type == "upload") {
        try {
            const queryData = getQueryStr(body, 'insert', 'bo_created_at');
            const insertLandQuery = `INSERT INTO board (${queryData.str}) VALUES (${queryData.question})`
            await sql_con.promise().query(insertLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    } else {
        console.log('여기서는 업데이트!!!!!');
        delete body['bo_created_at'];
        delete body['bo_updated_at'];
        try {
            const queryData = getQueryStr(body, 'update', 'bo_updated_at');
            queryData.values.push(bo_id);
            delete body['bo_id'];
            const updateLandQuery = `UPDATE board SET ${queryData.str} WHERE bo_id = ?`;
            await sql_con.promise().query(updateLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    }
    //     delete body['st_created_at'];
    //     delete body['st_updated_at'];

    //     try {
    //         const queryData = getQueryStr(body, 'update', 'st_updated_at');
    //         console.log(queryData);
    //         queryData.values.push(st_id);;
    //         const updateLandQuery = `UPDATE site SET ${queryData.str} WHERE st_id = ?`;

    //         console.log(updateLandQuery);
    //         await sql_con.promise().query(updateLandQuery, queryData.values);
    //     } catch (err) {
    //         console.error(err.message);
    //         status = false;
    //     }
    // }

    res.json({ status })
})


export { boardRouter }
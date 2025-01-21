import express from "express";
import { sql_con } from '../back-lib/db.js'
import fs from 'fs'
const boardRouter = express.Router();
import { getQueryStr } from "../back-lib/lib.js";
import moment from "moment-timezone";


// 새로 만든것!!!!!
boardRouter.post('/get_post_list', async (req, res, next) => {
    console.log('들어오지???');

    let post_list = [];
    try {
        const getPostListQuery = "SELECT * FROM board ORDER BY bo_created_at DESC";
        const [getPostList] = await sql_con.promise().query(getPostListQuery);
        post_list = getPostList
    } catch (error) {

    }

    res.json({ post_list })
})
// 여기까지!!!!


boardRouter.post('/load_content', async (req, res, next) => {
    console.log('역니느 들ㅇㅁㄴㅇ리ㅓㅁ니ㅑㅇ허ㅑㅣ멍ㄹ');
    let status = true;
    const getId = req.body.getId
    console.log(getId);
    let all_data = {}

    try {
        const getDataQuery = "SELECT * FROM land_board WHERE bo_id = ?"
        const getData = await sql_con.promise().query(getDataQuery, [getId]);
        all_data = getData[0][0]
    } catch (error) {

    }
    console.log(all_data);
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
        const deletePostQuery = "DELETE FROM land_board WHERE bo_id = ?";
        await sql_con.promise().query(deletePostQuery, [data.getId]);
    } catch (error) {
        try {
            const deletePostQuery = "DELETE FROM free_board WHERE bo_id = ?";
            await sql_con.promise().query(deletePostQuery, [data.getId]);
        } catch (error) {

        }
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



    console.log(body);
    if (body.type == 'upload') {
        const queryData = getQueryStr(body.allData, 'insert', 'bo_created_at');
        try {
            const insertBoardQuery = `INSERT INTO ${req.body.showType} (${queryData.str}) VALUES (${queryData.question})`
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
            const updateBoardQuery = `UPDATE ${req.body.showType} SET ${queryData.str} WHERE bo_id = ?`;
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

    if (type == "upload") {
        try {
            const queryData = getQueryStr(body, 'insert', 'bo_created_at');
            const insertLandQuery = `INSERT INTO ${req.body.showType} (${queryData.str}) VALUES (${queryData.question})`
            await sql_con.promise().query(insertLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    } else {
        delete body['bo_created_at'];
        delete body['bo_updated_at'];
        try {
            const queryData = getQueryStr(body, 'update', 'bo_updated_at');
            queryData.values.push(bo_id);
            delete body['bo_id'];
            const updateLandQuery = `UPDATE ${req.body.showType} SET ${queryData.str} WHERE bo_id = ?`;
            await sql_con.promise().query(updateLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    }

    res.json({ status })
})


boardRouter.post('/all_list', async (req, res, next) => {
    console.log('일단 들어오는지?');
    let status = true;
    const nowPage = req.body.nowPage;
    const pageCount = 12;
    let startCount = (nowPage - 1) * pageCount
    let get_post_list = [];
    let get_all_count = 0

    try {
        const getAllCountQeury = `SELECT (SELECT COUNT(*) FROM land_board) + (SELECT COUNT(*) FROM free_board) AS total_rows;`;
        const getAllCount = await sql_con.promise().query(getAllCountQeury);
        get_all_count = Math.ceil(getAllCount[0][0]['total_rows'] / pageCount)

        const getPostListQuery = `SELECT bo_id, bo_category, bo_subject,bo_content,bo_main_img,bo_created_at,bo_updated_at, 'land_board' AS board_type FROM land_board
        UNION ALL
        SELECT bo_id, bo_category, bo_subject,bo_content,bo_main_img,bo_created_at,bo_updated_at, 'free_board' AS board_type FROM free_board
        ORDER BY bo_created_at DESC LIMIT ${startCount}, ${pageCount}`;
        const getPostList = await sql_con.promise().query(getPostListQuery);
        get_post_list = getPostList[0]
    } catch (error) {
        status = false;
        console.error(error.message);
    }

    res.json({ status, get_post_list, get_all_count })
})



export { boardRouter }
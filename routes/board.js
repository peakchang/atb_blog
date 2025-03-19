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



boardRouter.post('/load_modify_content', async (req, res, next) => {
    let status = true;
    const getId = req.body.getId
    const table = req.body.table
    let all_data = {}

    try {
        const getDataQuery = `SELECT * FROM ${table} WHERE bo_id = ?`
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




boardRouter.post('/real_set_reserve_content', async (req, res, next) => {
    const getId = req.body.id;
    console.log(getId);
    
    try {
        const getContentDataQuery = "SELECT * FROM write_reserve WHERE bo_id = ?";
        const [getContentData] = await sql_con.promise().query(getContentDataQuery, [getId]);
        console.log(getContentData[0]);
        const contentData = removeNullValues(getContentData[0])
        

        const table = contentData.bo_table_name;
        const deleteId = contentData.bo_id
        delete contentData.bo_table_name
        delete contentData.bo_id
        delete contentData.bo_memo

        console.log(contentData);
        
        const queryData = getQueryStr(contentData, 'insert', 'bo_created_at')
        console.log(queryData);

        const insertQuery = `INSERT INTO ${table} (${queryData.str}) VALUES (${queryData.question})`;
        await sql_con.promise().query(insertQuery, queryData.values); 
        
        const deleteQuery = "DELETE FROM write_reserve WHERE bo_id =?"
        await sql_con.promise().query(deleteQuery, [deleteId]);
        
    } catch (error) {
        
    }

    res.json({})
})

function removeNullValues(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null)
    );
}

boardRouter.get('/load_reserve', async (req, res, next) => {
    console.log('안들어와?!?!');

    let reserve_list = [];
    try {
        const loadReserveListQuery = "SELECT bo_id, bo_name, bo_subject, bo_table_name, bo_memo FROM write_reserve";
        const [loadReserveList] = await sql_con.promise().query(loadReserveListQuery);
        reserve_list = loadReserveList
    } catch (error) {
    }
    res.json({ reserve_list })
})


boardRouter.post('/upload_reserve_content', async (req, res, next) => {
    console.log('들어와랏');
    let status = true;
    const body = req.body;
    const uploadData = body.allData
    if (body.type == 'upload') {
        const queryData = getQueryStr(uploadData, 'insert');
        console.log(queryData);
        try {
            const insertReserveQuery = `INSERT INTO write_reserve (${queryData.str}) VALUES (${queryData.question})`
            console.log(insertReserveQuery);

            await sql_con.promise().query(insertReserveQuery, queryData.values);
        } catch (error) {
            console.error(error.message);
            status = false;
        }

    } else {
        const table = uploadData.bo_show_type;
        delete uploadData['bo_created_at'];
        delete uploadData['bo_updated_at'];
        delete uploadData['bo_show_type'];

        const queryData = getQueryStr(body.allData, 'update', 'bo_updated_at');
        queryData.values.push(body.allData['bo_id'])
        delete body.allData['bo_id'];
    }

    const imgList = body.contentArr
    if (imgList) {
        for (let i = 0; i < imgList.length; i++) {
            if (imgList[i]) {
                try {
                    fs.unlinkSync(imgList[i]);
                } catch (error) {
                    console.error(error);

                }
            }
        }
    }

    res.json({ status })
})


boardRouter.post('/upload_content', async (req, res, next) => {
    console.log('들어와랏');
    let status = true;
    const body = req.body;
    const uploadData = body.allData
    if (body.type == 'upload') {
        const table = uploadData.bo_show_type;
        delete uploadData.bo_show_type;
        const queryData = getQueryStr(uploadData, 'insert', 'bo_created_at');
        console.log(queryData);
        try {
            const insertBoardQuery = `INSERT INTO ${table} (${queryData.str}) VALUES (${queryData.question})`
            console.log(insertBoardQuery);

            await sql_con.promise().query(insertBoardQuery, queryData.values);
        } catch (error) {
            console.error(error.message);
            status = false;
        }

    } else {
        const table = uploadData.bo_show_type;
        delete uploadData['bo_created_at'];
        delete uploadData['bo_updated_at'];
        delete uploadData['bo_show_type'];

        const queryData = getQueryStr(body.allData, 'update', 'bo_updated_at');
        queryData.values.push(body.allData['bo_id'])
        delete body.allData['bo_id'];
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

    console.log('안들어오는거야?!?!?!');


    let body = req.body.allData;

    const st_id = body['st_id'];
    const type = req.body.type;
    delete body['st_id'];
    delete body['bo_type'];

    if (type == "upload") {
        try {
            const queryData = getQueryStr(body, 'insert', 'st_created_at');
            const insertLandQuery = `INSERT INTO site (${queryData.str}) VALUES (${queryData.question})`
            console.log(insertLandQuery);
            await sql_con.promise().query(insertLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
        }
    } else {
        delete body['st_created_at'];
        delete body['st_updated_at'];
        try {
            const queryData = getQueryStr(body, 'update', 'st_updated_at');
            queryData.values.push(st_id);
            delete body['st_id'];
            const updateLandQuery = `UPDATE site SET ${queryData.str} WHERE st_id = ?`;
            await sql_con.promise().query(updateLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    }

    res.json({})
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
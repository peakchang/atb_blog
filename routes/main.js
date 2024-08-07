import express from "express";
import { sql_con } from '../back-lib/db.js'

import moment from "moment-timezone";
const koreaTime = moment.tz('Asia/Seoul');

const mainRouter = express.Router();



mainRouter.post('/get_modify', async (req, res, next) => {
    const id = req.body.id;
    let get_content
    let get_category
    try {
        const getContentQuery = "SELECT * FROM board WHERE bo_id = ?";
        const getContent = await sql_con.promise().query(getContentQuery, [id]);
        get_content = getContent[0][0];
        const getCategoryQuery = "SELECT cf_category FROM config WHERE cf_base = 'base'";
        const getCategory = await sql_con.promise().query(getCategoryQuery);
        get_category = getCategory[0][0];
    } catch (error) {
        console.error(error.message);
    }

    res.json({ get_content, get_category })
})

mainRouter.post('/get_reply', async (req, res, next) => {
    let get_reply
    const id = req.body.id
    try {
        const getReplyQuery = "SELECT * FROM reply WHERE re_parent = ? ORDER BY re_id DESC"
        const getReply = await sql_con.promise().query(getReplyQuery, [id]);
        get_reply = getReply[0];
    } catch (error) {
        console.error(error.message);
    }
    res.json({ get_reply })
})

mainRouter.post('/view_detail', async (req, res, next) => {
    let status = true
    let content;
    const id = req.body.id
    let get_previous_post = []
    let get_next_post = []
    try {
        const getContentQuery = "SELECT * FROM land_board WHERE bo_id = ?";
        const getContent = await sql_con.promise().query(getContentQuery, [id]);
        content = getContent[0][0];

        const getPreviousPostQuery = "SELECT bo_id,bo_subject FROM land_board WHERE bo_category = ? AND bo_id < ? ORDER BY bo_id DESC LIMIT 1";
        const getPreviousPost = await sql_con.promise().query(getPreviousPostQuery, [content.bo_category, id]);
        get_previous_post = getPreviousPost[0]

        const getNextPostQuery = "SELECT bo_id,bo_subject FROM land_board WHERE bo_category = ? AND bo_id > ? ORDER BY bo_id ASC LIMIT 1"
        const getNextPost = await sql_con.promise().query(getNextPostQuery, [content.bo_category, id]);
        get_next_post = getNextPost[0]
    } catch (error) {
        console.error(error.message);
        status = false;
    }

    res.json({ content, get_previous_post, get_next_post, status })
})


mainRouter.post('/board_detail', async (req, res, next) => {
    let status = true
    let content;
    const id = req.body.id
    let get_previous_post = []
    let get_next_post = []
    try {
        const getContentQuery = "SELECT * FROM free_board WHERE bo_id = ?";
        const getContent = await sql_con.promise().query(getContentQuery, [id]);
        content = getContent[0][0];

        const getPreviousPostQuery = "SELECT bo_id,bo_subject FROM free_board WHERE bo_category = ? AND bo_id < ? ORDER BY bo_id DESC LIMIT 1";
        const getPreviousPost = await sql_con.promise().query(getPreviousPostQuery, [content.bo_category, id]);
        get_previous_post = getPreviousPost[0]

        const getNextPostQuery = "SELECT bo_id,bo_subject FROM free_board WHERE bo_category = ? AND bo_id > ? ORDER BY bo_id ASC LIMIT 1"
        const getNextPost = await sql_con.promise().query(getNextPostQuery, [content.bo_category, id]);
        get_next_post = getNextPost[0]
    } catch (error) {
        console.error(error.message);
        status = false;
    }

    res.json({ content, get_previous_post, get_next_post, status })
})

mainRouter.post('/menu', async (req, res, next) => {
    let get_category;
    let posts;
    const cateLink = req.body.link
    const showType = req.body.showType
    console.log(showType);


    console.log('일단 들어오는지?');
    let status = true;
    const nowPage = req.body.nowPage;
    const pageCount = 12;
    let startCount = (nowPage - 1) * pageCount
    console.log(`startCount : ${startCount}`);
    let all_pages = 0

    let addSqlLine = ""
    let sqlArr = []

    if (cateLink == 'land') {
        sqlArr = [cateLink, 'news']
        addSqlLine = "bo_category = ? OR bo_category = ?"
    } else {
        sqlArr = [cateLink, 'news']
        addSqlLine = "bo_category = ?"
    }

    try {

        const getAllCountQeury = `SELECT COUNT(*) FROM ${showType} WHERE ${addSqlLine}`;
        const getAllCount = await sql_con.promise().query(getAllCountQeury, sqlArr);
        all_pages = Math.ceil(getAllCount[0][0]['COUNT(*)'] / pageCount)
        
        const getCategoryContentQuery = `SELECT * FROM ${showType} WHERE ${addSqlLine} ORDER BY bo_id DESC LIMIT ${startCount}, 12`
        const getCategoryContent = await sql_con.promise().query(getCategoryContentQuery, [cateLink]);
        posts = getCategoryContent[0]
    } catch (error) {
        status = false;
        console.error(error.message);

    }


    res.json({ status, posts, all_pages })
})

mainRouter.get('/base', async (req, res, next) => {

    let get_post_list;

    try {
        // const getPostListQuery = "SELECT * FROM view_board ORDER BY bo_id DESC LIMIT 12";
        const getPostListQuery = `SELECT bo_id, bo_category, bo_subject,bo_content,bo_main_img,bo_created_at,bo_updated_at, 'land_board' AS board_type FROM land_board
        UNION ALL
        SELECT bo_id, bo_category, bo_subject,bo_content,bo_main_img,bo_created_at,bo_updated_at, 'free_board' AS board_type FROM free_board
        ORDER BY bo_created_at DESC LIMIT 12;`;
        const getPostList = await sql_con.promise().query(getPostListQuery);
        get_post_list = getPostList[0]

    } catch (error) {
        console.error(error.message);
    }


    res.json({ get_post_list })
})

mainRouter.get('/', async (req, res, next) => {



    res.json({})
})






export { mainRouter }
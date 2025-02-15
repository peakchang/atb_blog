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
    console.log('여기는 안들어오고?!?!?!');

    let content;
    const id = req.body.id
    console.log(id);

    let get_previous_post = []
    let get_next_post = []
    try {
        const getContentQuery = "SELECT * FROM board WHERE bo_id = ?";
        const getContent = await sql_con.promise().query(getContentQuery, [id]);
        content = getContent[0][0];


        const getPreviousPostQuery = "SELECT bo_id,bo_subject FROM board WHERE bo_category = ? AND bo_id < ? ORDER BY bo_id DESC LIMIT 1";
        console.log(getPreviousPostQuery);

        const getPreviousPost = await sql_con.promise().query(getPreviousPostQuery, [content.bo_category, id]);
        get_previous_post = getPreviousPost[0]
        const getNextPostQuery = "SELECT bo_id,bo_subject FROM board WHERE bo_category = ? AND bo_id > ? ORDER BY bo_id ASC LIMIT 1"
        const getNextPost = await sql_con.promise().query(getNextPostQuery, [content.bo_category, id]);
        get_next_post = getNextPost[0]
    } catch (error) {
        console.log('에러남!!!');

        console.error(error.message);
    }

    console.log(content.bo_category);
    console.log(content.bo_subject);
    console.log(content.bo_created_at);



    res.json({ content, get_previous_post, get_next_post })
})




mainRouter.get('/base', async (req, res, next) => {

    let post_list = [];
    let site_list = [];

    try {
        // const getPostListQuery = "SELECT * FROM view_board ORDER BY bo_id DESC LIMIT 12";
        const getPostListQuery = `SELECT * FROM board ORDER BY bo_created_at DESC LIMIT 12`;
        const [getPostList] = await sql_con.promise().query(getPostListQuery);
        post_list = getPostList

        const getSiteListQuery = "SELECT * FROM site ORDER BY st_created_at DESC LIMIT 6"
        const [getSiteList] = await sql_con.promise().query(getSiteListQuery);
        site_list = getSiteList
    } catch (error) {
        console.error(error.message);
    }


    res.json({ post_list, site_list })
})





export { mainRouter }
import express from "express";
import { sql_con } from "../back-lib/db.js";
import moment from "moment-timezone";

// import cookieParser from 'cookie-parser';


moment.tz.setDefault("Asia/Seoul");

const siteRouter = express.Router();


//

siteRouter.post('/get_site_list', async (req, res, next) => {

    console.log('여긴 들어왕?');

    let site_list = [];

    try {
        const getSiteListQuery = "SELECT * FROM site ORDER BY bo_id DESC"
        const [getSiteList] = await sql_con.promise().query(getSiteListQuery);
        site_list = getSiteList
    } catch (error) {
        console.error(error.message);

    }
    

    res.json({ site_list })
})

siteRouter.post('/get_site_info', async (req, res, next) => {
    let status = true;
    let siteInfo = {}
    const pageId = req.body.pageId;

    try {
        const getSiteInfoQuery = "SELECT * FROM site WHERE bo_id = ?"
        const getSiteInfo = await sql_con.promise().query(getSiteInfoQuery, [pageId]);
        siteInfo = getSiteInfo[0][0]
    } catch (error) {

    }

    res.json({ status, siteInfo })
})


export { siteRouter }
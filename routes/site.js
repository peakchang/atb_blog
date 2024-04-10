import express from "express";
import { sql_con } from "../back-lib/db.js";
import moment from "moment-timezone";

// import cookieParser from 'cookie-parser';


moment.tz.setDefault("Asia/Seoul");

const siteRouter = express.Router();

siteRouter.post('/get_site_info', async (req, res, next) => {
    let status = true;

    let siteInfo = {}

    console.log(req.body);
    const pageId = req.body.pageId;
    console.log(`pageId~~~~~~~~~~~~~~ : ${pageId}`);

    try {
        const getSiteInfoQuery = "SELECT * FROM site WHERE st_id = ?"
        const getSiteInfo = await sql_con.promise().query(getSiteInfoQuery, [pageId]);
        siteInfo = getSiteInfo[0][0]
    } catch (error) {
        
    }

    res.json({ status, siteInfo })
})


export { siteRouter }
import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'

const subviewRouter = express.Router();



subviewRouter.post('/', async (req, res, next) => {
    let status = true;
    const subDomainName = req.body.subDomainName
    let subView = "";
    try {
        const getSubDomainQuery = "SELECT * FROM sub_board WHERE sb_domain = ?";
        const getSubDomainCon = await sql_con.promise().query(getSubDomainQuery, [subDomainName]);
        subView = getSubDomainCon[0][0]
    } catch (error) {

    }

    res.json({ status, subDomainName, subView })
})



export { subviewRouter }
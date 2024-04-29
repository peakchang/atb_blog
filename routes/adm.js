import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'
import {  getQueryStr } from "../back-lib/lib.js";
import fs from 'fs'

const admRouter = express.Router();



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
        console.log(land_modify_val);
    } catch (error) {
        status = false;
    }

    console.log(getId);

    res.json({ status, land_modify_val })
})

admRouter.post('/upload_data', async (req, res, next) => {
    let status = true;
    let body = req.body.allData;
    console.log(body);

    const st_id = body['st_id'];
    const type = req.body.type;
    delete body['st_id'];

    console.log(st_id);

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
            console.log(queryData);
            queryData.values.push(st_id);;
            const updateLandQuery = `UPDATE site SET ${queryData.str} WHERE st_id = ?`;

            console.log(updateLandQuery);
            await sql_con.promise().query(updateLandQuery, queryData.values);
        } catch (err) {
            console.error(err.message);
            status = false;
        }
    }

    res.json({ status })
})


admRouter.post('/delete_mainimg', async (req, res, next) => {

    console.log('');

    let status = true;
    const delPath = req.body.logoUrlPath;
    const ldId = req.body.ld_id;
    
    try {
        await fs.unlink(delPath, (err) => {
            console.log(err);
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
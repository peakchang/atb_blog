

import axios from "axios";
import { back_api, category_list, siteName } from "$src/lib/const";
import moment from "moment-timezone";


export const load = async ({ fetch, url }) => {

    let posts = []
    let site_list = [];
    let view_list = [];

    try {
        const res = await axios.get(`${back_api}/main/base`)
        if (res.status == 200) {
            posts = res.data.post_list
            site_list = res.data.site_list
            view_list = res.data.view_list
        }
    } catch (error) {
        console.error(error.message);
    }

    for (let i = 0; i < posts.length; i++) {
        const con = posts[i];
        const published = moment(con.bo_created_at ? con.bo_created_at : con.bo_updated_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
        posts[i]['published'] = published
    }

    for (let i = 0; i < view_list.length; i++) {
        const con = view_list[i];
        const published = moment(con.bo_created_at ? con.bo_created_at : con.bo_updated_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
        view_list[i]['published'] = published
    }

    return { posts, site_list, view_list }
}
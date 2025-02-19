

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

    console.log(view_list);
    



    return { posts, site_list, view_list }
}
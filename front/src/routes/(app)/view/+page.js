

import axios from "axios";
import { back_api, category_list, siteName } from "$src/lib/const";
import moment from "moment-timezone";


export const load = async ({ fetch, url }) => {

    let post_list = [];

    try {
        const res = await axios.post(`${back_api}/board/get_post_list`)
        if (res.status == 200) {
            post_list = res.data.post_list;
        }
        console.log(post_list);
    } catch (error) {
        console.error(error.message);
    }



    return { post_list }
}
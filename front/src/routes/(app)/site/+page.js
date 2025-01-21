

import axios from "axios";
import { back_api, category_list, siteName } from "$src/lib/const";
import moment from "moment-timezone";


export const load = async ({ fetch, url }) => {

    let site_list = [];

    try {
        const res = await axios.post(`${back_api}/site/get_site_list`)       
        if (res.status == 200) {
            site_list = res.data.site_list;
        }
    } catch (error) {
        console.error(error.message);
    }



    return { site_list }
}
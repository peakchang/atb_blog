

import axios from "axios";
import { back_api, category_list, siteName } from "$src/lib/const";
import moment from "moment-timezone";


export const load = async ({ fetch, url }) => {

    let reserveList = [];
    try {
        const res = await axios.get(`${back_api}/board/load_reserve`)
        if (res.status == 200) {
            reserveList = res.data.reserve_list;
            console.log(reserveList);
        }
    } catch (error) {
        console.error(error.message);
    }

    return { reserveList }
}
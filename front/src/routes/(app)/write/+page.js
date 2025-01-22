import axios from 'axios';
import cheerio from "cheerio";
import { back_api, category_list } from '$src/lib/const';
import moment from "moment-timezone";


export const prerender = false;

export const load = async ({ params, url }) => {
    console.log(url);
    const getId = url.searchParams.get('id');
    const type = url.searchParams.get('type');
    console.log(getId);
    let all_data = {}
    if (getId && type == 'board') {
        const res = await axios.post(`${back_api}/board/load_modify_board_content`, { getId })
        if (res.data.status) {
            all_data = res.data.all_data;

        }
    } else if (getId && type == 'land') {
        const res = await axios.post(`${back_api}/board/load_modify_land_content`, { getId })
        if (res.data.status) {
            all_data = res.data.all_data;
        }

    }

    console.log(all_data);
    return { all_data, type }

}

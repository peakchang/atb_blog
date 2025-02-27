import axios from 'axios';
import cheerio from "cheerio";
import { back_api, category_list } from '$src/lib/const';
import moment from "moment-timezone";


export const prerender = false;

export const load = async ({ params, url }) => {
    const getId = url.searchParams.get('id');
    const table = url.searchParams.get('table');
    console.log(table);
    
    
    let all_data = {}
    if (getId) {
        const res = await axios.post(`${back_api}/board/load_modify_content`, { getId, table })
        if (res.data.status) {
            all_data = res.data.all_data;

        }
    }
    return { all_data, getId }

}


import axios from "axios";
import { back_api } from "$src/lib/const";


export const load = async ({ fetch, url }) => {

    let site_visit_list = [];

    try {
        const res = await axios.post(`${back_api}/adm/get_site_visit`)
        if (res.data.status) {
            site_visit_list = res.data.site_visit_list
        }
    } catch (error) {

    }
    console.log(site_visit_list);
    return { site_visit_list }
}
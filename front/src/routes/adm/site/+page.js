import axios from "axios";
import { back_api } from "$lib/const";
// import Cookies from "js-cookie";
// import { user_info } from "$lib/store";

export const load = (async ({ url }) => {

    console.log(url);

    let siteList = [];

    try {
        const res = await axios.get(`${back_api}/adm/get_site_main`)
        if(res.data.status){
            siteList = res.data.site_list;
        }
    } catch (error) {
        
    }

    console.log(siteList);
    return { siteList };
}) 
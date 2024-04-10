import axios from "axios";
import { back_api } from "$lib/const";
// import Cookies from "js-cookie";
// import { user_info } from "$lib/store";

export const load = (async ({ url }) => {

    const getId = url.searchParams.get('st_id')
    console.log(getId);
    let modifyVal = {}
    try {
        const res = await axios.post(`${back_api}/adm/load_site_modify`, { getId })
        if (res.data.status) {
            modifyVal = res.data.land_modify_val
        }
    } catch (error) {

    }

    console.log(modifyVal);
    return { modifyVal, getId };
}) 
import axios from "axios";
import { back_api } from "$lib/const";

export const load = (async ({ url }) => {

    let ready_list = [];

    try {
        const res = await axios.get(`${back_api}/adm/ready_list`)
        if (res.data.status) {
            ready_list = res.data.ready_list
        }
    } catch (error) {

    }

    return { ready_list };
}) 
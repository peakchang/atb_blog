

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
    
    

    const seoValue = {
        title: '분양현장',
        description: '부동산 분양의 모든것! 아파트 분양, 오피스텔 분양, 상가 분양, 지식산업센터 분양 등 현재 진행중인 분양 및 청약, 미분양 정보 안내',
        url: url.href,
        image: `${url.origin}/logo.png`,
        date: '23-12-07',
        published_time: '2023-12-07T11:46:53+00:00',
        icon: `${url.href}favicon.png`,
    }
    



    return { site_list, seoValue }
}
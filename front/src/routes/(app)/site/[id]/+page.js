import axios from 'axios';
import cheerio from "cheerio";
import { back_api, category_list } from '$src/lib/const';
import moment from "moment-timezone";


export const prerender = false;

export const load = async ({ params, url }) => {
    let siteInfo = {}


    let seoValue = {
        title: "",
        description: '',
        url: url.href,
        image: "",
        icon: `${url.origin}/favicon.png`,
    }
    try {
        const res = await axios.post(`${back_api}/site/get_site_info`, { pageId: params['id'] })
        if (res.data.status) {
            siteInfo = res.data.siteInfo
        }
        
        seoValue['title'] = siteInfo.bo_name
        seoValue['description'] = siteInfo.bo_name + ' 모델하우스 | 분양가 | 할인조건 | 오시는길 | 특장점 | 올댓분양 | ' + siteInfo.bo_description.replace(/<\/?p>/g, '');
        seoValue['image'] = siteInfo.bo_main_img
        
    } catch (err) {
        console.error(err.message);

    }



    return { siteInfo, seoValue }
}



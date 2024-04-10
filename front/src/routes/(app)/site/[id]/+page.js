import axios from 'axios';
import cheerio from "cheerio";
import { back_api, category_list } from '$src/lib/const';
import moment from "moment-timezone";


export const prerender = false;

export const load = async ({ params, url }) => {
    console.log(params['id']);
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
        console.log(res);
        if (res.data.status) {
            siteInfo = res.data.siteInfo
        }

        seoValue['title'] = siteInfo.st_name
        seoValue['description'] = siteInfo.st_description
        seoValue['image'] = siteInfo.st_main_img



    } catch (error) {

    }

    

    return { siteInfo, seoValue }
}



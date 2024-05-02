import axios from 'axios';
import cheerio from "cheerio";
import { back_api, category_list, siteName } from '$lib/const';
import moment from "moment-timezone";


export const prerender = false;

export const load = async ({ params, fetch, url }) => {


    const { link } = params
    let category = ""
    let categoryType = ""
    let posts = [];
    let seoValue = {
        title: "",
        description: '부동산 분양의 모든것! 아파트 분양, 오피스텔 분양, 상가 분양, 지식산업센터 분양 등 현재 진행중인 분양 및 청약, 미분양 정보 안내',
        url: url.href,
        image: `${url.href}logo.png`,
        date: '23-12-07',
        published_time: '2023-12-07T11:46:53+00:00',
        icon: `${url.origin}/favicon.png`,
    }



    try {

        const res = await axios.post(`${back_api}/main/menu`, {
            link
        })
        posts = res.data.posts;

        for (let i = 0; i < posts.length; i++) {
            // 날짜
            const getTimeStr = posts[i]['bo_updated_at'] ? posts[i]['bo_updated_at'] : posts[i]['bo_created_at']
            const dateStr = moment.tz(getTimeStr, 'Asia/Seoul');
            posts[i]["date_str"] = dateStr.format('YYYY-MM-DD HH:mm:ss');

            if (!posts[i]['bo_type'] || posts[i]['bo_type'] != 'land') {
                // 첫번째 이미지
                const $ = cheerio.load(posts[i]["bo_content"]);
                const imageTag = $("img");
                posts[i]["img_link"] = imageTag.length
                    ? imageTag.eq(0).attr("src")
                    : "/no-image.png";
                posts[i]["text"] = $("p").text();
            } else {
                posts[i]["img_link"] = posts[i]['bo_main_img']
            }


            // 카테고리 명
            const getCategoryObj = category_list.find(v => v.link === posts[i]["bo_category"]);
            posts[i]["category"] = getCategoryObj['name']
            console.log(posts[i]);




        }

        const getCategoryObj = category_list.find(v => v.link === link);
        category = getCategoryObj['name']
        categoryType = getCategoryObj['type']

        seoValue.title = `${siteName} - ${category}`

    } catch (error) {

    }










    return { posts, category, seoValue, categoryType }
}



function extractFirstImage(htmlString) {
    // 이미지 태그의 src 속성값을 추출하기 위한 정규식 패턴
    const imgSrcRegex = /<img.*?src="(.*?)"/i;
    // 정규식을 사용하여 첫 번째 이미지의 URL 추출
    const match = htmlString.match(imgSrcRegex);
    if (match && match[1]) {
        return match[1];  // 첫 번째 이미지의 URL 반환
    } else {
        return null;  // 이미지가 없는 경우 null 반환
    }
}
import axios from 'axios';
import cheerio from "cheerio";
import { back_api, category_list } from '$src/lib/const';
import { extractFirstImageSrc } from '$src/lib/lib';

import moment from "moment-timezone";


export const prerender = false;

export const load = async ({ params, url }) => {

    const { id } = params;
    let nextPosts = []
    let previousPosts = []
    let contentData;
    let get_reply;

    let seoValue = {}

    try {
        const res = await axios.post(`${back_api}/main/board_detail`, { id })
        if (res.data.status) {
            contentData = res.data.content
            console.log(contentData);
            if (!contentData.bo_type) {
                contentData.bo_type = 'blog'
            }
        }

        console.log(contentData);
        if (contentData.bo_type == "blog") {

            // 디스크립션 따기 위해 태그 모두 제거
            const viewTextOnly = contentData['bo_content'].replace(/<[^>]+>/g, ' ');
            const viewTextOnlyFilter = viewTextOnly.replace(/\s+/g, ' ').trim();

            // html 태그가 있을때 첫번째 이미지만 뽑기
            const firstImg = extractFirstImageSrc(contentData['bo_content'])
            const publishdTime = contentData['bo_updated_at'] ? contentData['bo_updated_at'] : contentData['bo_created_at']

            seoValue = {
                title: contentData.bo_subject,
                description: truncateTextTo100Chars(viewTextOnlyFilter),
                url: url.href,
                image: firstImg,
                date: moment(publishdTime).format('YYYY-MM-DD'),
                published_time: publishdTime,
                icon: `${url.origin}/favicon.png`,
            }
            console.log(seoValue);
        }else{
            seoValue = {
                title: contentData.bo_subject,
                description: `${contentData.bo_subject} 홈페이지 | ${contentData.bo_subject} 분양가 | ${contentData.bo_subject} 모델하우스 | 주소 | 견본주택 | 홍보관 안내 | ${contentData.bo_description}`,
                url: url.href,
                image: contentData.bo_main_img,
                icon: `${url.origin}/favicon.png`,
            }
            console.log(seoValue);
        }


        // 카테고리
        if (contentData["bo_category"]) {
            const getCategoryObj = category_list.find(v => v.link === contentData["bo_category"]);
            contentData["category"] = getCategoryObj['name']
        } else {
            contentData["category"] = "분양뉴스"
        }



    } catch (error) {
        console.error(error.message);
    }


    // 여기서부턴 댓글

    try {

        const res = await axios.post(`${back_api}/main/get_reply`, {
            id
        })

        get_reply = res.data.get_reply;

        for (let i = 0; i < get_reply.length; i++) {
            get_reply[i]["hidden_ip"] = hideLastTwoSegments(
                get_reply[i]["re_ip"]
            );
            const date = new Date(get_reply[i]['re_created_at']);
            const dateStr = moment.tz(date, 'Asia/Seoul');
            get_reply[i]['date'] = dateStr.format('YYYY-MM-DD HH:mm');
        }



    } catch (error) {
        console.error(error.message);
    }

    return { contentData, seoValue, get_reply, nextPosts, previousPosts }
}


function hideLastTwoSegments(ipAddress) {
    const segments = ipAddress.split(".");
    if (segments.length < 4) {
        // 유효한 IP 주소가 아님
        return "Invalid IP address";
    }

    // 마지막 두 부분을 '*'로 대체
    segments[2] = "*";
    segments[3] = "*";

    return segments.join(".");
}


function truncateTextTo100Chars(text) {
    if (text.length <= 100) {
        return text;
    }

    // 100자 뒤의 가장 가까운 띄어쓰기를 찾음
    const truncatedText = text.substr(0, 200);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');

    if (lastSpaceIndex === -1) {
        // 띄어쓰기를 찾지 못한 경우, 그냥 100자까지 자름
        return truncatedText;
    }

    // 가장 가까운 띄어쓰기까지 잘라서 반환
    return truncatedText.substr(0, lastSpaceIndex);
}
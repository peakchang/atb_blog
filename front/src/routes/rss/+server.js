import { category_list, siteName } from "$src/lib/const";
import { sql_con } from '$lib/server/db'
import moment from "moment-timezone";

export async function GET({ url }) {

    let boardList = [];
    let postXmlStr = ""
    let lastBuildDate = ""

    try {

        const getSiteListQuery = "SELECT * FROM site ORDER BY st_id DESC";
        const getSiteList = await sql_con.promise().query(getSiteListQuery);
        const siteList = getSiteList[0];

        console.log(siteList);

        for (let i = 0; i < siteList.length; i++) {
            let template = `
            <item>
                <title>${siteList[i]['st_name']}</title>
                <link>${url.origin}/site/${siteList[i]['st_id']}</link>
                <description>${siteList[i]['st_description']}</description>
                <guid>${url.origin}/site/${siteList[i]['st_id']}</guid>
            </item>
            `
            postXmlStr = postXmlStr + template
        }


        const getBoardListQuery = "SELECT * FROM board ORDER BY bo_id DESC";
        const getBoardList = await sql_con.promise().query(getBoardListQuery);
        boardList = getBoardList[0]

        for (let l = 0; l < boardList.length; l++) {
            if(l == 0){
                lastBuildDate = boardList[l]['bo_created_at']
            }

            const template = `
            <item>
                <title>${boardList[l]['bo_subject']}</title>
                <link>${url.origin}/view/${boardList[l]['bo_id']}</link>
                <description>${removeImgAndBrTags(boardList[l]['bo_content'])}</description>
                <guid>${url.origin}/view/${boardList[l]['bo_id']}</guid>
                
            </item>
            `
            postXmlStr = postXmlStr + template
        }
        // <guid isPermaLink="true">${url.origin}/view/${boardList[l]['bo_id']}</guid>
        // <pubDate>${boardList[l]['bo_created_at']}</pubDate>

    } catch (error) {
        console.error(error.message);
    }

    return new Response(
        `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
            <title>${siteName} rss</title>
            <link>${url.origin}/rss</link>
            <description>${siteName} 포스팅 모음</description>
            <atom:link href="${url.origin}/rss" rel="self"/>
            <language>ko-kr</language>
            <lastBuildDate>${lastBuildDate}</lastBuildDate>
            ${postXmlStr}
        </channel>
        </rss>`.trim(),
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}


function removeImgAndBrTags(html) {
    // 정규식을 사용하여 이미지 태그를 제거합니다.
    return html.replace(/<img[^>]*>|<br[^>]*>/g, '');
}
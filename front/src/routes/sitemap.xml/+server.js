import { category_list } from "$src/lib/const";
import { sql_con } from '$lib/server/db'
import moment from "moment-timezone";

export async function GET({ url }) {

    let boardXmlStr = ""

    try {
        const getBoardListQuery = "SELECT * FROM board ORDER BY bo_id DESC";
        const getBoardList = await sql_con.promise().query(getBoardListQuery);
        const boardList = getBoardList[0]

        for (let i = 0; i < boardList.length; i++) {
            // published_time
            const getTimeStr = boardList[i]['bo_updated_at'] ? boardList[i]['bo_updated_at'] : boardList[i]['bo_created_at']
            const dateStr = moment.tz(getTimeStr, 'Asia/Seoul');
            const getDate = dateStr.format('YYYY-MM-DD');
            // const getDate = dateStr.format('YYYY-MM-DDTHH:mm:ssZ');

            let template = `
            <url>
            <loc>${url.origin}/blog/${boardList[i]['bo_id']}</loc>
                <lastmod>${getDate}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.5</priority>
            </url>
            `
            console.log(template);
            boardXmlStr = boardXmlStr + template
        }

    } catch (error) {

    }
    
    return new Response(
        `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

        ${boardXmlStr}

        </urlset>`.trim(),
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}

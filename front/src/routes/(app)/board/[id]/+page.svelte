<script>
    import { page } from "$app/stores";
    import axios from "axios";
    import { authStatus } from "$lib/store";
    import { goto, invalidate, invalidateAll } from "$app/navigation";
    import cheerio from "cheerio";
    import Reply from "$lib/components/Reply.svelte";
    import { back_api } from "$lib/const";
    import moment from "moment-timezone";
    import SeoMeta from "$lib/components/SeoMeta.svelte";
    import { onMount } from "svelte";
    import Cookies from "js-cookie";

    export let data;

    let replyData = [];
    let contentData = {};
    let previousPosts = [];
    let nextPosts = [];
    let seoValue = {};

    $: data, setData();

    function setData() {
        seoValue = data.seoValue;
        replyData = data.get_reply;
        contentData = data.contentData;
        previousPosts = data.previousPosts;
        nextPosts = data.nextPost;

        console.log(contentData);
    }

    let getId = $page.params.id;
    let contentArr;
    let replyContent;


    onMount(async () => {
        const getVisitedCookie = Cookies.get("topby_visited");
		console.log(getVisitedCookie);
		const referrer = document.referrer;
		console.log(referrer);
		if (!getVisitedCookie) {
			console.log("쿠키 없어???");

            console.log(back_api);
            console.log($page);

			// const res = await axios.post(`${back_api}/update_visit_count`, {
			// 	ld_id: siteData["ld_id"],
			// 	ld_domain : siteData["ld_domain"],
			// 	ld_visit_count: siteData["ld_visit_count"],
			// 	referrer
			// });

			// Cookies.set("topby_visited", "ok", { expires: 1 });
		}
    })

    // 댓글달기 나중에 수정하기~~~
    async function postReply() {
        const convertTag = convertTextareaToPTag(replyContent);
        await axios
            .post(`${back_api}/board/reply_regist`, { getId, convertTag })
            .then((res) => {
                alert("댓글이 성공적으로 달렸습니다.");
                invalidateAll();
                replyContent = "";
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    // async function deletePost() {
    //     if (!confirm("삭제된 글은 복구 불가합니다. 삭제하시겠습니까?")) {
    //         return false;
    //     }

    //     const $ = cheerio.load(data.content.bo_content);
    //     const imageTag = $("img");
    //     const iframeTag = $("iframe");

    //     const tempImgArr = getSrcList($, imageTag);
    //     const tempVideoArr = getSrcList($, iframeTag);

    //     contentArr = [...tempImgArr, ...tempVideoArr];

    //     await axios
    //         .post(`${back_api}/board/delete`, { getId, contentArr })
    //         .then((res) => {
    //             goto("/");
    //         });
    // }

    // function getSrcList($, tagList) {
    //     const tempImgArr = tagList
    //         .map((index, element) => {
    //             const imageUrl = $(element).attr("src");
    //             const newImageUrl = imageUrl.replace(
    //                 /^(https?:\/\/)?[^/]+/,
    //                 "",
    //             );

    //             let startFolder;
    //             if (import.meta.env.VITE_STATUS == "dev") {
    //                 startFolder = "front/static";
    //             } else {
    //                 startFolder = "public/uploads";
    //             }
    //             const reImgUrl = startFolder + newImageUrl;
    //             return reImgUrl;
    //         })
    //         .get();

    //     return tempImgArr;
    // }

    function convertTextareaToPTag(text) {
        const paragraphs = text
            .split("\n")
            .map((p) => `<p>${p}</p>`)
            .join("");
        return paragraphs;
    }

    // function convertPTagToNewline(htmlString) {
    //     const regex = /<p[^>]*>(.*?)<\/p>/gs;
    //     const newLineSeparatedText = htmlString.replace(regex, "$1\n");
    //     return newLineSeparatedText;
    // }

    // async function imgApiChk() {
    //     try {
    //         const getId = $page.params.id;
    //         const res = axios.post(`${back_api}/board/modify_api_img`, {
    //             getId,
    //         });
    //     } catch (error) {}
    // }

    // ********************************** 위에는 일반 블로그
</script>

<svelte:head>
    <SeoMeta bind:seoValue />
</svelte:head>

{#if contentData.bo_type == "blog"}
    <div class="container px-3.5 max-w-4xl mx-auto my-7 suit-font">
        <div class="pt-6">
            <h1 class="text-xl font-medium text-center">
                {contentData.bo_subject}
            </h1>
        </div>

        <div class="border-b pt-3 pb-1 text-right flex justify-between">
            <div>
                <button
                    class="px-3 py-1 text-sm rounded-lg bg-pink-500 text-white"
                    on:click={() => {
                        history.back();
                    }}
                >
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i> 뒤로가기
                </button>

                {#if $authStatus}
                    <a href="/write?id={getId}">
                        <button
                            class="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white"
                        >
                            <i class="fa fa-cog" aria-hidden="true"></i> 수정하기
                        </button>
                    </a>
                    <!-- <button
                    class="px-3 py-1 text-sm rounded-lg bg-red-500 text-white"
                    on:click={deletePost}
                >
                    <i class="fa-solid fa-circle-minus" /> 삭제하기
                </button> -->
                {/if}
            </div>
            <div>
                {moment(
                    contentData["bo_updated_at"]
                        ? contentData["bo_updated_at"]
                        : contentData["bo_created_at"],
                ).format("YYYY-MM-DD")} / {contentData.category}
            </div>
        </div>

        <div class="mt-6 px-2 ql-editor">
            {@html contentData.bo_content}
        </div>

        <hr class="my-1" />

        <ul>
            {#if previousPosts && previousPosts.length > 0}
                {#each data.previousPosts as prePost}
                    <a href="/view/{prePost.bo_id}">
                        <li><span>{prePost.bo_subject}</span></li>
                    </a>
                {/each}
            {/if}

            {#if previousPosts.length > 0 && previousPosts.length > 0}
                <hr class="my-1" />
            {/if}

            {#if nextPosts && nextPosts.length > 0}
                {#each nextPosts as nextPost}
                    <a href="/view/{nextPost.bo_id}">
                        <li><span>{nextPost.bo_subject}</span></li>
                    </a>
                {/each}
            {/if}
        </ul>

        <div class="pt-3">
            <section class="bg-white dark:bg-gray-900 py-8 lg:py-16">
                <div class="max-w-2xl mx-auto px-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2
                            class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white"
                        >
                            <!-- 댓글 ({data.get_reply.length}) -->
                        </h2>
                    </div>

                    <form class="mb-6" on:submit|preventDefault={postReply}>
                        <div
                            class="py-2 px-4 mb-2 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        >
                            <textarea
                                rows="6"
                                class="px-0 w-full h-20 text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none resize-none"
                                placeholder="댓글을 입력해주세요"
                                bind:value={replyContent}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        >
                            댓글 등록하기
                        </button>
                    </form>
                </div>
            </section>

            {#each replyData as reply}
                <article
                    class="mb-6 text-base bg-white rounded-lg dark:bg-gray-900"
                >
                    <footer class="flex justify-between items-center">
                        <div class="flex items-center">
                            <p
                                class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"
                            >
                                <i
                                    class="fa-regular fa-circle-user text-xl"
                                />&nbsp;&nbsp;
                                {reply.hidden_ip}
                            </p>
                            <p>/&nbsp;&nbsp;</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {reply.date}
                            </p>
                        </div>
                        <button
                            id="dropdownComment1Button"
                            data-dropdown-toggle="dropdownComment1"
                            class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button"
                        >
                            .
                            <span class="sr-only">Comment settings</span>
                        </button>
                        <!-- Dropdown menu -->
                    </footer>
                    <p class="text-gray-500 dark:text-gray-400">
                        {@html reply.re_content}
                    </p>
                    <div class="flex items-center mt-2 space-x-4">
                        <button
                            type="button"
                            class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
                        >
                            <i class="fa-regular fa-comment-dots" />&nbsp; Reply
                        </button>
                    </div>
                </article>
            {/each}
        </div>
    </div>
{:else}
    <div class="container px-3.5 max-w-4xl mx-auto my-7 suit-font">
        <div class="text-4xl font-bold text-gray-600 text-center py-5 bg-gray-100">
            {contentData.bo_subject}
        </div>
        <div class="text-center pt-5">
            <img src="{contentData.bo_main_img}" alt="" class="w-full mx-auto">
        </div>

        <div class="pt-10 grid md:grid-cols-2 suit-font">
            <table class="w-full">
                <tr>
                    <th class="border p-2 text-sm">현장명</th>
                    <td class="border p-2 text-sm">{contentData.bo_subject}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">전용면적</th>
                    <td class="border p-2 text-sm">{contentData.bo_area_size}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">시공예정</th>
                    <td class="border p-2 text-sm">{contentData.bo_construct_date}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">공급위치</th>
                    <td class="border p-2 text-sm">{contentData.bo_supply_location}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">분양가</th>
                    <td class="border p-2 text-sm">{contentData.bo_parcel_price}</td>
                </tr>
            </table>

            <table class="w-full mt-1 md:mt-0">
                <tr>
                    <th class="border p-2 text-sm">세대수</th>
                    <td class="border p-2 text-sm">{contentData.bo_housenum}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">규모</th>
                    <td class="border p-2 text-sm">{contentData.bo_scale}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">시행사</th>
                    <td class="border p-2 text-sm">{contentData.bo_developer}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">입주예정</th>
                    <td class="border p-2 text-sm">{contentData.bo_movein_date}</td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm">문의</th>
                    <td class="border p-2 text-sm">{contentData.bo_inquiry}</td>
                </tr>
            </table>
        </div>

        <div class="pt-5">
            <div class="border rounded-md p-5">
                {contentData.bo_description}
            </div>
        </div>
        <div class="pt-5">
            {#each contentData.bo_imgs.split(',') as siteImg}
            <img src="{siteImg}" alt="" class="w-full mx-auto">
            {/each}
        </div>


    </div>
{/if}

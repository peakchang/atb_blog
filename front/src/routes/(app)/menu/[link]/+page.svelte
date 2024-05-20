<script>
    import { page } from "$app/stores";
    import { extractFirstImageSrc } from "$lib/lib";
    import moment from "moment-timezone";

    import {
        afterNavigate,
        beforeNavigate,
        invalidate,
        invalidateAll,
    } from "$app/navigation";
    import { back_api, category_list, siteName } from "$src/lib/const";

    // invalidate 를 사용할때에는 인자로 링크가 들어가야함

    export let data;
    let category = "";
    let categoryType = "";
    let posts = [];
    let pageArr = [];
    let getNowPage = 1;
    const newPath = $page.url.pathname;
    let nowPage = 1;

    console.log($page);

    $: data, setData();

    function setData() {
        category = data.category;
        categoryType = data.categoryType;
        console.log(category);
        posts = data.posts;
        pageArr = data.pageArr;
        nowPage = data.nowPage;

        console.log(getNowPage);
    }
</script>

<div class="max_screen mx-auto px-2 pb-8 mt-2">
    <h1 class="sr-only">{siteName} - {category}</h1>
    <div class="my-6 kbo-font text-2xl text-gray-700 text-center relative">
        {category} 최신글 리스트
    </div>

    <div
        data-sveltekit-preload-data="tap"
        data-sveltekit-reload
        class="grid grid-cols-2 md:grid-cols-4 suit-font gap-1"
    >
        {#each posts as post}
            <a
                href={post["bo_show_type"] == "land_board"
                    ? `/view/${post.bo_id}`
                    : `/board/${post.bo_id}`}
            >
                <div class="border rounded-md overflow-hidden">
                    <div
                        class="w-full h-32 overflow-hidden flex justify-center items-center"
                    >
                        {#if post.bo_main_img}
                            <img src={post.bo_main_img} alt="asdfasdf" />
                        {:else if extractFirstImageSrc(post.bo_content)}
                            <img
                                src={extractFirstImageSrc(post.bo_content)}
                                alt="asdfasdf"
                            />
                        {:else}
                            <img src="/no-image.png" alt="asdfasdf" />
                        {/if}
                    </div>

                    <div class="p-2 flex flex-col gap-2">
                        <!-- <div class="truncate">{post.bo_subject}</div> -->
                        <div class="text-xs">
                            {post.category} / {moment(
                                post.bo_created_at,
                            ).format("YY-MM-DD HH:mm")}
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>

    <div class="my-3 suit-font">
        <ul
            class="flex justify-center gap-1 text-sm font-semibold"
            data-sveltekit-preload-data="tap"
        >
            <li>
                <button class="w-8 h-8 border rounded-md">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
            </li>

            {#each pageArr as page}
                {#if nowPage == page}
                    <li>
                        <button
                            class="w-8 h-8 border rounded-md bg-blue-200"
                            value="1"
                        >
                            {page}
                        </button>
                    </li>
                {:else}
                    <li>
                        <a href="{newPath}?page={page}">
                            <button class="w-8 h-8 border rounded-md" value="1">
                                {page}
                            </button>
                        </a>
                    </li>
                {/if}
            {/each}
            <li>
                <button class="w-8 h-8 border rounded-md">
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </button>
            </li>
        </ul>
    </div>
</div>

<style>
    .sr-only {
        position: absolute;
        overflow: hidden;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        border: 0;
        clip: rect(0, 0, 0, 0);
    }
</style>

<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { afterNavigate, goto } from "$app/navigation";
    import { authStatus } from "$lib/store";
    import SeoMeta from "$src/lib/components/SeoMeta.svelte";

    import { invalidateAll } from "$app/navigation";
    import { back_api, siteName, category_list } from "$lib/const";

    import { extractFirstImageSrc, getNameByLink } from "$lib/lib";
    import moment from "moment-timezone";

    import Cookies from "js-cookie";

    let postList = [];
    let seoValue = {};
    export let data;
    $: data, setData();
    function setData() {
        postList = data.post_list;
        for (let i = 0; i < postList.length; i++) {
            const con = postList[i];
            console.log(con);
            
        }
        seoValue = data.seoValue;
    }
</script>

<svelte:head>
    <SeoMeta bind:seoValue />
</svelte:head>

<div class="p-3 text-center suit-font border-b">
    <ul class="flex justify-center gap-3">
        <li>전체</li>
        <li>질문/답변</li>
        <li>자유게시판</li>
    </ul>
</div>

<div data-sveltekit-preload-data="tap" data-sveltekit-reload>
    {#each postList as post}
        <a href={`/board/${post.bo_id}`}>
            <div
                class="border-b mb-5 p-2 flex justify-between gap-3 suit-font h-18"
            >
                <div class="overflow-hidden flex flex-col justify-evenly">
                    <span
                        class="w-full block overflow-hidden text-ellipsis whitespace-nowrap md:text-lg"
                    >
                        {post.bo_subject ? post.bo_subject : post.bo_name}
                    </span>
                    <span class="text-xs md:text-sm">
                        <i class="fa fa-user" aria-hidden="true"></i>
                        관리자 /
                        <i class="fa fa-bookmark-o" aria-hidden="true"></i>
                        {getNameByLink(category_list, post.bo_category)} /
                        <i class="fa fa-clock-o" aria-hidden="true"></i>
                        {moment(post.bo_created_at).format("YY-MM-DD hh:mm")} /
                        <i class="fa fa-eye" aria-hidden="true"></i>
                        1,857
                    </span>
                </div>

                <div
                    class=" min-w-28 w-28 h-20 md:min-w-40 md:w-40 md:h-28 border rounded-md overflow-hidden"
                >
                    <img
                        src={post.bo_main_img
                            ? post.bo_main_img
                            : extractFirstImageSrc(post.bo_content)}
                        alt=""
                        class="w-full h-full"
                    />
                </div>
            </div>
        </a>
    {/each}
</div>

<style>
</style>

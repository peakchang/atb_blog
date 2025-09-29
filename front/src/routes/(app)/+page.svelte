<script>
    import Swiper from "swiper";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";
    // import Swiper and modules styles
    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/pagination";

    import { Modal, Button, Label, Input, Checkbox } from "flowbite-svelte";
    import axios from "axios";
    import { onMount } from "svelte";
    import { afterNavigate, goto } from "$app/navigation";
    import { authStatus } from "$lib/store";

    import { invalidateAll } from "$app/navigation";
    import { back_api, siteName, category_list } from "$lib/const";
    import SeoMeta from "$src/lib/components/SeoMeta.svelte";

    import { extractFirstImageSrc, getNameByLink } from "$lib/lib";
    import moment from "moment-timezone";

    import Cookies from "js-cookie";

    let chkModalVal = false;
    let pwdVal;
    let posts = [];
    let siteList = [];
    let viewList = [];
    let bannerSwiper;
    let loading = true;

    let bannerList = [
        { src: "/banner/bn_1.webp" },
        { src: "/banner/bn_2.webp" },
        { src: "/banner/bn_3.webp" },
        { src: "/banner/bn_4.webp" },
        { src: "/banner/bn_5.webp" },
    ];

    let seoValue = {};

    export let data;



    $: data, setData();
    function setData() {
        seoValue = data.seoValue;
        posts = data.posts;
        siteList = data.site_list;
        viewList = data.view_list;
    }

    afterNavigate(() => {
        invalidateAll();
    });

    onMount(() => {
        loading = false;
        // init Swiper:
        const swiper = new Swiper(bannerSwiper, {
            // configure Swiper to use modules

            modules: [Autoplay, Navigation, Pagination],
            // centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },

            navigation: {
                nextEl: ".right-btn",
                prevEl: ".left-btn",
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });
    });

    async function goWrite(e) {
        try {
            const res = await axios.post(`${back_api}`, { pwdVal });

            if (res.data.validPassword) {
                $authStatus = "ok";

                Cookies.set("auth_status", "ok");

                alert("인증 완료! 글쓰기로 넘어갑니다!");
                goto("/write");
            } else {
                alert("인증 실패 비밀번호를 확인해주세요!");
                chkModalVal = false;
                pwdVal = "";
            }
        } catch (error) {
            // console.error(error.message);
        }
    }

    function chkModalOpen() {
        if (!$authStatus || $authStatus != "ok") {
            chkModalVal = !chkModalVal;
        } else if ($authStatus == "ok") {
            alert("인증 완료! 글쓰기로 넘어갑니다!");
            goto("/write");
        }
    }
</script>

<svelte:head>
		<SeoMeta bind:seoValue />
</svelte:head>

<div class="swiper my-5 relative" bind:this={bannerSwiper}>
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper relative">
        {#each bannerList as banner}
            <div class="swiper-slide">
                <img src={banner.src} alt="" />
            </div>
        {/each}
    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>

    <div class="left-btn top-1/2 z-20 left-7">
        <button
            class="w-7 h-7 md:w-10 md:h-10 text-sm md:text-base bg-white flex justify-center items-center rounded-full text-gray-500"
        >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
    </div>
    <div class="right-btn top-1/2 z-20 right-7">
        <button
            class="w-7 h-7 md:w-10 md:h-10 text-sm md:text-base bg-white flex justify-center items-center rounded-full text-gray-500"
        >
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </button>
    </div>
    <div class="swiper-scrollbar"></div>
</div>

<div class="px-2 pb-8 mt-2">
    <h1 class="sr-only">{siteName}</h1>
    <div class="my-6 relative pb-5">
        <div class="absolute right-0 suit-font text-sm">
            <button
                class="bg-green-500 focus:bg-green-600 text-white px-3 py-1 rounded-md flex justify-center items-center gap-2"
                style="top: -20px"
                on:click={chkModalOpen}
            >
                <span>
                    <svg
                        class="w-4 h-4 dark:text-white"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M18.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12.167v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                        />
                    </svg>
                </span>
                <span> 글추가하기 </span>
            </button>
        </div>
    </div>

    <div class="  text-center pb-3 relative">
        <span class="kbo-font text-2xl text-gray-700"> 최신 현장 리스트 </span>

        <button class="absolute right-0 top-0 suit-font text-sm">
            <i class="fa fa-plus-square-o" aria-hidden="true"></i>
            전체 현장 바로가기
        </button>
    </div>

    <div
        data-sveltekit-preload-data="tap"
        data-sveltekit-reload
        class="grid grid-cols-2 md:grid-cols-3 suit-font gap-3"
    >
        {#each viewList as view}
            <a href={`/view/${view.bo_id}`}>
                <div class="border rounded-md overflow-hidden">
                    <div class=" h-40 overflow-hidden">
                        <img
                            src={view.bo_main_img}
                            alt=""
                            class="min-w-full min-h-full align-center"
                        />
                    </div>
                    <div class="p-3">
                        {view.bo_name}
                    </div>
                </div>
            </a>
        {/each}
    </div>

    <!-- <div class="text-center mt-10 pb-3 relative">
        <span class="kbo-font text-2xl text-gray-700">
            {siteName} 게시판 리스트
        </span>

        <button class="absolute right-0 top-0 suit-font text-sm">
            <i class="fa fa-plus-square-o" aria-hidden="true"></i>
            게시판 바로가기
        </button>
    </div> -->


    <!-- <div
        data-sveltekit-preload-data="tap"
        data-sveltekit-reload
        class="grid grid-cols-1 md:grid-cols-2 suit-font gap-1"
    >
        extractFirstImageSrc(post.bo_content) 썸네일 이미지 따는 함수
        {#each viewList as view}
            <a href={`/view/${view.bo_id}`}>
                <div class="border flex gap-1 min-h-20">
                    <div
                        class="border-r h-20 w-20 flex justify-center items-center"
                    >
                        <img
                            src={view.bo_main_img
                                ? view.bo_main_img
                                : extractFirstImageSrc(view.bo_content)}
                            alt=""
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div
                        class="overflow-hidden p-3 flex flex-col justify-center gap-1"
                    >
                        <span
                            class="w-full block overflow-hidden text-ellipsis whitespace-nowrap text-sm"
                        >
                            {view.bo_subject ? view.bo_subject : view.bo_name}
                        </span>
                        <span class="text-xs">
                            <i class="fa fa-bookmark-o" aria-hidden="true"></i>
                            {getNameByLink(category_list, view.bo_category)}
                            /
                            <i class="fa fa-clock-o" aria-hidden="true"></i>
                            {view.published}
                        </span>
                    </div>
                </div>
            </a>
        {/each}
    </div> -->

    <div class="text-center mt-10 pb-3 relative">
        <span class="kbo-font text-2xl text-gray-700">
            {siteName} 커뮤니티 리스트
        </span>

        <button class="absolute right-0 top-0 suit-font text-sm">
            <i class="fa fa-plus-square-o" aria-hidden="true"></i>
            게시판 바로가기
        </button>
    </div>
    <div
        data-sveltekit-preload-data="tap"
        data-sveltekit-reload
        class="grid grid-cols-1 md:grid-cols-2 suit-font gap-1"
    >
        <!-- extractFirstImageSrc(post.bo_content) 썸네일 이미지 따는 함수 -->
        {#each posts as post}
            <a href={`/board/${post.bo_id}`}>
                <div class="border flex gap-1 min-h-20">
                    <div
                        class="border-r h-20 w-20 flex justify-center items-center"
                    >
                        <img
                            src={post.bo_content
                                ? extractFirstImageSrc(post.bo_content)
                                : post.bo_main_img}
                            alt=""
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div
                        class="overflow-hidden p-3 flex flex-col justify-center gap-1"
                    >
                        <span
                            class="w-full block overflow-hidden text-ellipsis whitespace-nowrap text-sm"
                        >
                            {post.bo_subject ? post.bo_subject : post.bo_name}
                        </span>
                        <span class="text-xs">
                            <i class="fa fa-bookmark-o" aria-hidden="true"></i>
                            {getNameByLink(category_list, post.bo_category)}
                            /
                            <i class="fa fa-clock-o" aria-hidden="true"></i>
                            {post.published}
                        </span>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>

<Modal bind:open={chkModalVal} size="xs" autoclose={false} class="w-full">
    <form class="flex flex-col space-y-6" on:submit|preventDefault={goWrite}>
        <span class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
            비밀번호를 입력하세요
        </span>
        <Label class="space-y-2">
            <span>password</span>
            <Input
                type="password"
                name="password"
                required
                bind:value={pwdVal}
            />
        </Label>
        <Button type="submit" class="w-full1">Login to your account</Button>
    </form>
</Modal>

<style>
    .box-over {
        /* 여러 줄 자르기 추가 스타일 */
        white-space: normal;
        text-align: left;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

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

    .right-btn {
        position: absolute;
        transform: translate(50%, -50%);
    }

    .left-btn {
        position: absolute;
        transform: translate(-50%, -50%);
    }
</style>

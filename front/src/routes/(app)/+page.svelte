<script>
    import { Modal, Button, Label, Input, Checkbox } from "flowbite-svelte";
    import axios from "axios";
    import { onMount, tick, beforeUpdate } from "svelte";
    import { afterNavigate, goto } from "$app/navigation";
    import { authStatus } from "$lib/store";

    import { page } from "$app/stores";

    import { invalidateAll } from "$app/navigation";
    import { back_api, siteName } from "$lib/const";

    let chkModalVal = false;
    let pwdVal;
    let postNum = 10;
    let listStatus = true;
    let posts = [];

    export let data;

    $: data, setData();
    function setData() {
        posts = data.posts;
    }

    afterNavigate(() => {
        invalidateAll();
    });

    async function goWrite(e) {
        try {
            const res = await axios.post(`${back_api}`, { pwdVal });

            if (res.data.validPassword) {
                $authStatus = "ok";
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

    async function addPostList() {
        axios
            .post(`${back_api}/add_post_list`, { postNum })
            .then((res) => {
                const addData = res.data.posts;
                const addStatus = res.data.listStatus;
                data.posts = [...data.posts, ...addData];
                postNum = postNum + 10;
                listStatus = addStatus;
            })
            .catch((err) => {
                console.error(err.message);
            });
    }
</script>

<svelte:head></svelte:head>

<div class="max_screen mx-auto px-2 pb-8 mt-2">
    <h1 class="sr-only">{siteName}</h1>
    <div class="my-6 kbo-font text-2xl text-gray-700 text-center relative">
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

        {siteName} 최신글 리스트
    </div>

    <div
        data-sveltekit-preload-data="tap"
        data-sveltekit-reload
        class="grid grid-cols-2 md:grid-cols-4 suit-font gap-1"
    >
        {#each posts as post}
            <a href="/view/{post.bo_id}">

                <div class="border rounded-md overflow-hidden">
                    <div
                        class="w-full h-32 overflow-hidden flex justify-center items-center"
                    >
                        <img src={post.img_link} alt="asdfasdf" />
                    </div>

                    <div class="p-2 flex flex-col gap-2">
                        <div class="truncate">{post.bo_subject}</div>
                        <div class="text-xs">
                            {post.category} / {post.date_str}

                    </div>
                </div>
            </a>
        {/each}
    </div>

    {#if listStatus}
        <div class="text-center mt-6">
            <button class=" text-5xl text-gray-500" on:click={addPostList}>
                <i class="fa-solid fa-circle-plus" />
            </button>
        </div>
    {/if}
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
</style>

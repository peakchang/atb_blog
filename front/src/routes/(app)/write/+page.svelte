<script>
    import Editor from "$lib/components/Editor.svelte";
    import axios from "axios";
    import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
    // @ts-ignore
    import Cookies from "js-cookie";
    import { back_api, category_list } from "$lib/const";

    import SortableImg from "$lib/components/SortableImg.svelte";
    import { dataURItoBlob } from "$src/lib/lib";

    import { page } from "$app/stores";

    let contentArr;
    let modifyVal;
    let content;

    let workStatus = false; // 값이 true 면 새로고침시 체크

    let subject;
    let category;
    let keyword;
    let description;

    const uploadContent = async () => {
        if (!subject || !category) {
            alert("제목 or 카테고리 미선택! 선택해주세여");
            return false;
        }

        // 지울 목록 찾기 (에디터에 없는 항목만 배열로 남겨놓기)
        for (let i = 0; i < contentArr.length; i++) {
            const element = contentArr[i];
            if (element.includes("/")) {
                var ttt = element.split("/");
            } else {
                var ttt = element.split("\\");
            }

            var kkk = ttt[ttt.length - 1];
            if (content.includes(kkk)) {
                contentArr[i] = "";
            }
        }

        const res = await axios.post(`${back_api}/board/write`, {
            subject,
            category,
            content,
            contentArr,
        });

        if (res.data.status) {
            workStatus = false;
            alert("글 작성이 완료 되었습니다.");
            goto("/");
        }
    };

    const getEditorContent = (e) => {
        content = e.detail.editorContent;
        if (!content || content == "<p><br></p>") {
            workStatus = false;
        } else {
            workStatus = true;
        }
    };

    beforeNavigate(async ({ from, to, cancel }) => {
        if (workStatus) {
            if (
                confirm(
                    "페이지에서 나가시겠습니까? 작성중인 문서는 삭제됩니다.",
                )
            ) {
                const deleteArr = contentArr;
                const del_list_cookie = deleteArr.join(",");
                Cookies.set("del_list_cookie", del_list_cookie); // 혹시 모르니까 쿠키에 저장
                await axios
                    .post(`${back_api}/editor/nosave_del`, { deleteArr })
                    .then(() => {
                        Cookies.remove("del_list_cookie");
                    });
            } else {
                cancel();
            }
        }
    });

    // F5키를 누르는 경우 삭제할 이미지 리스트 쿠키 바로 저장
    function onKeyDown(e) {
        if (e.keyCode == 116) {
            Cookies.set("del_list_cookie", contentArr);
        }
    }

    // ********************************* 위에는 일반 블로그 글쓰기

    let writeType = "land";

    export let data;
    let allData = {};
    let stImgs = [];
    let tempSaveImgs = []; // 임시저장 이미지 리스트, 새로고침 / 뒤로가기시 싹 삭제됨
    const stId = $page.url.searchParams.get("st_id");
</script>

<!-- <input type="number" bind:value on:change={onChange}> -->
<svelte:window on:keydown={onKeyDown} />
<div class="max_screen mx-auto px-2 pb-8 mt-2">
    <div class="mb-5">
        <select
            class="p-1 text-xs border-gray-300 rounded-sm"
            bind:value={writeType}
        >
            <option value="blog">블로그</option>
            <option value="land">부동산</option>
        </select>
    </div>

    {#if writeType == "land"}
        <div class="w-full overflow-auto ">
            <div class="w-full min-w-[700px] suit-font">
                <div class="mb-2 pl-3">※ 기본정보</div>
                <table class="w-full text-sm">
                    <tr>
                        <th class="border p-2 text-sm">현장명</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_name"]}
                            />
                        </td>
                        <th class="border p-2">세대수</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_house_num"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">전용면적</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_area_size"]}
                            />
                        </td>
                        <th class="border p-2">규모</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_scale"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">시공예정</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_construct_date"]}
                            />
                        </td>
                        <th class="border p-2">시행사</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_developer"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">공급위치</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_supply_location"]}
                            />
                        </td>
                        <th class="border p-2">입주예정</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_movein_date"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">문의</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_inquiry"]}
                            />
                        </td>
                        <th class="border p-2">분양가</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["st_parcel_price"]}
                            />
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="mt-5 suit-font">
            <div class="mb-2 pl-3 text-base">※ 현장 설명</div>
            <div>
                <textarea
                    rows="7"
                    class="border p-3 w-full focus:outline-none focus:border-blue-500 rounded-md rounded-md border-gray-300"
                    bind:value={allData["st_description"]}
                ></textarea>
            </div>
        </div>

        <div class="mt-5 suit-font">
            <div class="mb-2 pl-3 text-base">※ 메인이미지</div>
            <div>
                {#if allData["st_main_img"]}
                    <div class="mb-3 border p-1 rounded-md">
                        <img src={allData["st_main_img"]} alt="" />
                    </div>
                {:else}
                    <div class="mb-3">이미지를 추가해주세요</div>
                {/if}

                {#if allData["st_main_img"]}
                    <button
                        class="py-1 px-3 text-xs text-white rounded-md bg-red-500 active:bg-red-600"
                    >
                        메인이미지 삭제
                    </button>
                {:else}
                    <button
                        class="py-1 px-3 text-xs text-white rounded-md bg-blue-500 active:bg-blue-600"
                    >
                        메인이미지 업로드
                    </button>
                {/if}
            </div>
        </div>

        <div class="mt-5 suit-font">
            <div class="mb-2 pl-3 text-base">※ 현장 설명 이미지</div>
            <div></div>
        </div>

        <div class="py-5 px-3 border rounded-md mt-5 suit-font">
            <span class="text-sm">▣ 이미지 리스트</span>
            <SortableImg
                modifyImageList={stImgs}
            />
        </div>

        <div class="mt-5 pb-10 text-center suit-font">
            {#if data.getId}
                <button
                    class="text-lg text-white py-1.5 px-10 bg-green-600 active:bg-green-700 rounded-lg"
                    value="update"
                >
                    업로드
                </button>
            {:else}
                <button
                    class="text-lg text-white py-1.5 px-10 bg-green-600 active:bg-green-700 rounded-lg"
                    value="upload"
                >
                    업로드
                </button>
            {/if}

            <button
                on:click={() => {
                    console.log(stImgs);
                }}>xptmxm</button
            >
        </div>



    {:else if writeType == "blog"}
        <input
            type="text"
            class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
            placeholder="제목을 입력하세요"
            bind:value={subject}
        />

        <select
            class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
            bind:value={category}
        >
            <option value="">선택하세요</option>
            {#each category_list as category}
                <option value={category.link}>{category.name}</option>
            {/each}
        </select>

        <Editor
            on:getEditorContent={getEditorContent}
            {modifyVal}
            bind:contentArr
            height="500px"
        />

        <div class="mt-3 text-center">
            <button
                class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
                on:click={uploadContent}
            >
                등록하기
            </button>
        </div>
    {/if}
</div>

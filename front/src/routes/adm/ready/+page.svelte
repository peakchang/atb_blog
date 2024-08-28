<script>
    import ModalCustom from "$components/design/ModalCustom.svelte";
    import SortableImg from "$components/SortableImg.svelte";
    import { category_list } from "$lib/const.js";
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import { invalidateAll } from "$app/navigation";
    import moment from "moment-timezone";

    export let data;
    let readyList = [];

    $: data, setData();

    function setData() {
        readyList = data.ready_list;
    }

    $: contentModalBool, chkModalBoolFunc();

    async function chkModalBoolFunc() {
        if (!contentModalBool) {
            let delImgArr = [];
            if (!br_id) {
                delImgArr = imgArr;
            } else {
                const preImgArr = br_imgs.split(",");
                delImgArr = imgArr.filter((item) => !preImgArr.includes(item));
            }

            if (delImgArr.length != 0) {
                try {
                    const res = await axios.post(
                        `${back_api}/adm/delete_imgs`,
                        { delImgArr },
                    );
                    
                } catch (error) {}
            }

            br_id = "";
            br_subject = "";
            br_category = "";
            br_imgs = "";
            br_date = "";
        }
    }

    let contentModalBool = false;

    let br_id = "";
    let br_subject = "";
    let br_category = "";
    let br_imgs = "";
    let br_date = "";

    let imgArr = [];

    let checkedList = [];
    let checkedWrap;
    let allChk = false;

    async function uploadReady() {
        const type = this.value;
        if (!br_subject || !br_category || !br_date || imgArr.length == 0) {
            alert("항목을 모두 채워주세요");
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(br_date);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            alert(
                "선택한 날짜는 오늘 날짜와 같거나 이전입니다. 다른 날짜를 선택해주세요.",
            );
            return false;
        }

        br_imgs = imgArr.join(",");

        try {
            const res = await axios.post(`${back_api}/adm/update_ready`, {
                br_id,
                br_subject,
                br_category,
                br_date,
                br_imgs,
                type,
            });

            if (res.data.status) {
                alert("적용이 완료 되었습니다.");

                contentModalBool = false;
                invalidateAll();
            }
        } catch (error) {
            alert(`에러가 발생 했습니다! ${error.message}`);
        }
    }

    function updateMainImgList(e) {
        const imgList = e.detail.imgArr;
        imgArr = imgList.map((e) => e["src"]);
    }

    function openUpdateModal() {
        const selData = readyList[this.value];
        br_id = selData["br_id"];
        br_subject = selData["br_subject"];
        br_category = selData["br_category"];
        br_imgs = selData["br_imgs"];
        br_date = moment(selData["br_date"]).format("YYYY-MM-DD");
        imgArr = br_imgs.split(",");
        contentModalBool = true;
    }

    async function deleteRows() {
        if (!confirm("Are you sure you want to delete")) {
            return false;
        }
        try {
            const res = await axios.post(`${back_api}/adm/delete_ready`, {
                delete_list: checkedList,
            });

            if (res.data.status) {
                alert("삭제가 완료 되었습니다.");
                invalidateAll();
                allChk = false;
                checkedList = [];
            }
        } catch (error) {}
    }

    function allChkFunc() {
        if (allChk) {
            checkedList = readyList.map((item) => item.br_id);
        } else {
            checkedList = [];
        }
    }
</script>

<ModalCustom bind:open={contentModalBool} autoClose={false}>
    <table class="w-full">
        <tr>
            <th class="border p-1 text-sm">제목</th>

            <td class="border p-1">
                <input
                    type="text"
                    class="p-1 text-sm border-gray-300 w-full rounded-md"
                    bind:value={br_subject}
                />
            </td>
        </tr>

        <tr>
            <th class="border p-1 text-sm">카테고리</th>
            <td>
                <select
                    class="text-sm py-1 border-gray-400 rounded-lg"
                    bind:value={br_category}
                >
                    {#each category_list as category}
                        <option value={category.link}>
                            {category.name}
                        </option>
                    {/each}
                </select>
            </td>
        </tr>
        <tr>
            <th class="border p-1 text-sm">이미지</th>
            <td class="border p-1">
                <div>
                    <SortableImg
                        bind:modifyImageList={imgArr}
                        on:updateImgeList={updateMainImgList}
                    />
                </div>
            </td>
        </tr>
        <tr>
            <th class="border p-1 text-sm">날짜</th>
            <td class="border p-1">
                <input
                    type="date"
                    class="p-1 text-sm border-gray-400 rounded-lg"
                    bind:value={br_date}
                />
            </td>
        </tr>
    </table>

    <div class="text-center mt-3">
        {#if br_id}
            <button
                class="py-1 w-1/3 bg-yellow-500 active:bg-yellow-600 text-white rounded-lg mr-2 text-sm"
                value="update"
                on:click={uploadReady}
            >
                업데이트
            </button>
        {:else}
            <button
                class="py-1 w-1/3 bg-yellow-500 active:bg-yellow-600 text-white rounded-lg mr-2 text-sm"
                value="upload"
                on:click={uploadReady}
            >
                업로드
            </button>
        {/if}
    </div>
</ModalCustom>

<div class="mb-5">
    <button
        class="py-1 px-3 bg-green-500 active:bg-green-600 text-white rounded-lg mr-2"
        on:click={() => {
            imgArr = [];
            contentModalBool = !contentModalBool;
        }}
    >
        행 추가
    </button>
    <button
        class="py-1 px-3 bg-red-500 active:bg-red-600 text-white rounded-lg"
        on:click={deleteRows}
    >
        행 삭제
    </button>
</div>

<div class="w-full min-w-[800px] overflow-auto">
    <div class="w-full max-w-[1200px]">
        <table class="w-full text-center">
            <tr>
                <th class="border p-1.5">
                    <input
                        type="checkbox"
                        bind:checked={allChk}
                        on:change={allChkFunc}
                    />
                </th>
                <th class="border p-1.5"> 글 제목 </th>
                <th class="border p-1.5"> 작업일 </th>
                <th class="border p-1.5"> 버튼 </th>
            </tr>

            {#each readyList as data, idx}
                <tr>
                    <td class="border p-1.5" bind:this={checkedWrap}>
                        <input
                            type="checkbox"
                            value={data.br_id}
                            bind:group={checkedList}
                            on:change={(e) => {
                                if (
                                    checkedList.length == readyList.length &&
                                    checkedList.length != 0
                                ) {
                                    allChk = true;
                                } else if (
                                    checkedList.length != readyList.length
                                ) {
                                    allChk = false;
                                }
                            }}
                        />
                    </td>
                    <td class="border p-1.5">
                        {data.br_subject}
                    </td>
                    <td class="border p-1.5">
                        {moment(data.br_date).format("YY/MM/DD")}
                    </td>
                    <td class="border p-1.5">
                        <button
                            class="py-1 px-3 bg-blue-500 active:bg-blue-600 text-white rounded-lg"
                            value={idx}
                            on:click={openUpdateModal}
                        >
                            보기 및 수정
                        </button>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</div>

<script>
    import ModalCustom from "$components/design/ModalCustom.svelte";
    import SortableImg from "$components/SortableImg.svelte";
    import { category_list } from "$lib/const.js";
    import axios from 'axios';

    console.log(category_list);

    let contentModalBool = false;

    let br_id = "";
    let br_subject = "";
    let br_category = "";
    let br_imgs = "";
    let br_date = "";

    let imgArr = [];

    async function uploadReady(){
        console.log(br_id);
        console.log(br_subject);
        console.log(br_category);
        console.log(br_date);
    }

    function updateMainImgList(e) {
        const imgList = e.detail.imgArr;
        imgArr = imgList.map((e) => e["src"]);

        console.log(imgArr);
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
                    <SortableImg on:updateImgeList={updateMainImgList} />
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
        <button
            class="py-1 w-1/3 bg-yellow-500 active:bg-yellow-600 text-white rounded-lg mr-2 text-sm"
            on:click={uploadReady}
        >
            업로드
        </button>
    </div>
</ModalCustom>

<div class="mb-5">
    <button
        class="py-1 px-3 bg-green-500 active:bg-green-600 text-white rounded-lg mr-2"
        on:click={() => {
            contentModalBool = !contentModalBool;
        }}
    >
        행 추가
    </button>
    <button
        class="py-1 px-3 bg-red-500 active:bg-red-600 text-white rounded-lg"
    >
        행 삭제
    </button>
</div>

<div class="w-full min-w-[800px] overflow-auto">
    <div class="w-full max-w-[1200px]">
        <table class="w-full text-center">
            <tr>
                <th class="border p-1.5">
                    <input type="checkbox" name="" id="" />
                </th>
                <th class="border p-1.5"> 글 제목 </th>
                <th class="border p-1.5"> 작업일 </th>
                <th class="border p-1.5"> 버튼 </th>
            </tr>

            <tr>
                <td class="border p-1.5">
                    <input type="checkbox" name="" id="" />
                </td>
                <td class="border p-1.5">
                    여튼 여기는 제목이요~~~~~~~~~~~~~~~
                </td>
                <td class="border p-1.5"> 24-08-24 </td>
                <td class="border p-1.5">
                    <button
                        class="py-1 px-3 bg-blue-500 active:bg-blue-600 text-white rounded-lg"
                    >
                        보기 및 수정
                    </button>
                </td>
            </tr>
        </table>
    </div>
</div>

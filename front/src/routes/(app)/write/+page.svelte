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
    console.log($page.url.searchParams.get("id"));

    export let data;
    let allData = {};

    $: data, setData();

    function setData() {
        if (data.all_data) {
            allData = data.all_data;
            if (allData.bo_imgs) {
                stImgs = allData.bo_imgs.split(",");
            }
        }
    }

    let contentArr;
    let content;

    let workStatus = false; // 값이 true 면 새로고침시 체크

    let subject;
    let category;
    let keyword;
    let description;

    const uploadContent = async (e) => {
        console.log(allData);
        const type = e.target.value;
        console.log(type);
        if (!allData["bo_subject"] || !allData["bo_category"]) {
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
            if (allData["bo_content"].includes(kkk)) {
                contentArr[i] = "";
            }
        }

        const res = await axios.post(`${back_api}/board/write`, {
            type,
            allData,
            contentArr,
        });

        if (res.data.status) {
            workStatus = false;
            alert("글 작성이 완료 되었습니다.");
            goto("/");
        }
    };

    const getEditorContent = (e) => {
        allData["bo_content"] = e.detail.editorContent;
        if (!allData["bo_content"] || allData["bo_content"] == "<p><br></p>") {
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
                const del_libo_cookie = deleteArr.join(",");
                Cookies.set("del_libo_cookie", del_libo_cookie); // 혹시 모르니까 쿠키에 저장
                await axios
                    .post(`${back_api}/editor/nosave_del`, { deleteArr })
                    .then(() => {
                        Cookies.remove("del_libo_cookie");
                    });
            } else {
                cancel();
            }
        }
    });

    // F5키를 누르는 경우 삭제할 이미지 리스트 쿠키 바로 저장
    function onKeyDown(e) {
        if (e.keyCode == 116) {
            Cookies.set("del_libo_cookie", contentArr);
        }
    }

    // ********************************* 위에는 일반 블로그 글쓰기

    let stImgs = [];

    console.log(allData["bo_imgs"]);
    let tempSaveImgs = []; // 임시저장 이미지 리스트, 새로고침 / 뒤로가기시 싹 삭제됨
    const stId = $page.url.searchParams.get("bo_id");

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const uploadMainImgAct = (e) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg");
        input.click();

        // input change
        input.onchange = async (e) => {
            const maxWidth = 1200;
            const img_file = e.target.files[0];
            const options = {
                maxSizeMB: 0.7,
                // maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const reader = new FileReader();
            reader.readAsDataURL(img_file);
            reader.onload = function (r) {
                let setWidth = 0;
                let setHeight = 0;
                const img = new Image();
                img.src = r.target.result;
                img.onload = async function (e) {
                    if (img.width >= maxWidth) {
                        var share = img.width / maxWidth;
                        var setHeight = Math.floor(img.height / share);
                        var setWidth = maxWidth;
                    } else {
                        setWidth = img.width;
                        setHeight = img.height;
                    }

                    var canvas = document.createElement("canvas");
                    canvas.width = setWidth;
                    canvas.height = setHeight;
                    canvas.display = "inline-block";
                    canvas
                        .getContext("2d")
                        .drawImage(img, 0, 0, setWidth, setHeight);

                    var getReImgUrl = canvas.toDataURL("image/webp");

                    const resultImage = dataURItoBlob(getReImgUrl);

                    let imgForm = new FormData();

                    const timestamp = new Date().getTime();
                    const fileName = `${timestamp}${Math.random()
                        .toString(36)
                        .substring(2, 11)}.webp`;
                    imgForm.append("onimg", resultImage, fileName);

                    axios
                        .post(`${back_api}/editor/onimg_upload`, imgForm, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((res) => {
                            allData["bo_main_img"] = res.data.baseUrl;
                        })
                        .catch((err) => {
                            console.error();
                            alert(`${err.message} 에러가 발생 했습니다.`);
                        });
                };
            };
        };
    };

    async function deleteMainImgAct() {
        const mainImgUrlArr = allData["bo_main_img"].split("/");
        const mainImgUrlPath = `public/uploads/${mainImgUrlArr[3]}/${mainImgUrlArr[4]}/${mainImgUrlArr[5]}`;

        try {
            const res = await axios.post(`${back_api}/board/delete_mainimg`, {
                mainImgUrlPath,
            });
            if (res.data.status) {
                alert("로고가 삭제 되었습니다.");
                invalidateAll();
                allData["bo_main_img"] = "";
            } else {
                console.log("????");
            }
        } catch (error) {
            alert("에러가 발생 했습니다.");
        }
    }

    function updateMainImgList(e) {
        const imgList = e.detail.imgArr;
        stImgs = setImgArr(imgList);
    }

    async function updateLandAct() {
        const type = this.value;

        console.log(type);

        if (stImgs) {
            allData["bo_imgs"] = stImgs.join(",");
        }

        console.log(allData);

        try {
            const res = await axios.post(`${back_api}/board/upload_land_data`, {
                allData,
                type,
            });

            if (res.data.status) {
                alert("업로드가 완료 되었습니다.");
                goto("/", { invalidateAll: true });
            }
        } catch (error) {}
    }

    function setImgArr(imgList) {
        const imgArr = imgList;
        let tempImgArr = [];

        let tempSaveImgsTemp = [...tempSaveImgs];
        for (let i = 0; i < imgArr.length; i++) {
            const imgObj = imgArr[i];
            tempImgArr.push(imgObj["src"]);
            if (!tempSaveImgsTemp.includes(imgObj["src"])) {
                tempSaveImgsTemp.push(imgObj["src"]);
            }
        }
        tempSaveImgs = tempSaveImgsTemp;
        return tempImgArr;
    }
</script>

<!-- <input type="number" bind:value on:change={onChange}> -->
<svelte:window on:keydown={onKeyDown} />
<div class="max_screen mx-auto px-2 pb-8 mt-2">
    <div class="mb-5">
        <select
            class="p-1 text-xs border-gray-300 rounded-sm"
            bind:value={allData["bo_type"]}
        >
            <option value="blog">블로그</option>
            <option value="land">부동산</option>
        </select>
    </div>

    {#if allData["bo_type"] == "land"}
        <div class="w-full overflow-auto">
            <div class="w-full min-w-[700px] suit-font">
                <div class="mb-2 pl-3">※ 기본정보</div>
                <table class="w-full text-sm">
                    <tr>
                        <th class="border p-2 text-sm">현장명</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_subject"]}
                            />
                        </td>
                        <th class="border p-2">세대수</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_housenum"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">전용면적</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_area_size"]}
                            />
                        </td>
                        <th class="border p-2">규모</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_scale"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">시공예정</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_construct_date"]}
                            />
                        </td>
                        <th class="border p-2">시행사</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_developer"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">공급위치</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_supply_location"]}
                            />
                        </td>
                        <th class="border p-2">입주예정</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_movein_date"]}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="border p-2">문의</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_inquiry"]}
                            />
                        </td>
                        <th class="border p-2">분양가</th>
                        <td class="border p-1">
                            <input
                                type="text"
                                class="border p-2 w-full focus:outline-none focus:border-blue-500 rounded-md border-gray-300"
                                bind:value={allData["bo_parcel_price"]}
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
                    bind:value={allData["bo_description"]}
                ></textarea>
            </div>
        </div>

        <div class="mt-5 suit-font">
            <div class="mb-2 pl-3 text-base">※ 메인이미지</div>
            <div>
                {#if allData["bo_main_img"]}
                    <div class="mb-3 border p-1 rounded-md">
                        <img src={allData["bo_main_img"]} alt="" />
                    </div>
                {:else}
                    <div class="mb-3">이미지를 추가해주세요</div>
                {/if}

                {#if allData["bo_main_img"]}
                    <button
                        class="py-1 px-3 text-xs text-white rounded-md bg-red-500 active:bg-red-600"
                        on:click={deleteMainImgAct}
                    >
                        메인이미지 삭제
                    </button>
                {:else}
                    <button
                        class="py-1 px-3 text-xs text-white rounded-md bg-blue-500 active:bg-blue-600"
                        on:click={uploadMainImgAct}
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
                on:updateImgeList={updateMainImgList}
                modifyImageList={stImgs}
            />
        </div>

        <div class="mt-5 pb-10 text-center suit-font">
            {#if $page.url.searchParams.get("id")}
                <button
                    class="text-lg text-white py-1.5 px-10 bg-green-600 active:bg-green-700 rounded-lg"
                    value="update"
                    on:click={updateLandAct}
                >
                    업로드
                </button>
            {:else}
                <button
                    class="text-lg text-white py-1.5 px-10 bg-green-600 active:bg-green-700 rounded-lg"
                    value="upload"
                    on:click={updateLandAct}
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
    {:else if allData["bo_type"] == "blog"}
        <input
            type="text"
            class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
            placeholder="제목을 입력하세요"
            bind:value={allData["bo_subject"]}
        />

        <select
            class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
            bind:value={allData["bo_category"]}
        >
            <option value="">선택하세요</option>
            {#each category_list as category}
                <option value={category.link}>{category.name}</option>
            {/each}
        </select>

        <Editor
            on:getEditorContent={getEditorContent}
            modifyVal={allData["bo_content"]}
            bind:contentArr
            height="500px"
        />

        <div class="mt-3 text-center">
            {#if $page.url.searchParams.get("id")}
                <button
                    class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
                    value="update"
                    on:click={uploadContent}
                >
                    등록하기
                </button>
            {:else}
                <button
                    class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
                    value="upload"
                    on:click={uploadContent}
                >
                    등록하기
                </button>
            {/if}
        </div>
    {/if}
</div>

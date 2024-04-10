<script>
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import SortableImg from "$lib/components/SortableImg.svelte";
    import { dataURItoBlob } from "$src/lib/lib";
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";

    export let data;
    let allData = {};
    let stImgs = [];
    let tempSaveImgs = []; // 임시저장 이미지 리스트, 새로고침 / 뒤로가기시 싹 삭제됨
    const stId = $page.url.searchParams.get("st_id");

    $: data, setData();

    function setData() {
        if (stId) {
            allData = data.modifyVal;
            console.log(allData);
            if(allData["st_imgs"]){
                stImgs = allData["st_imgs"].split(",");
            }

            console.log(stImgs);
            
        }
    }

    async function uploadData() {
        const type = this.value;

        console.log(allData);
        console.log(type);

        if (stImgs) {
            allData["st_imgs"] = stImgs.join(",");
        }

        try {
            const res = await axios.post(`${back_api}/adm/upload_data`, {
                allData,
                type,
            });

            if (res.data.status) {
                alert("업로드가 완료 되었습니다.");
                goto("/adm/site", { invalidateAll: true });
            }
        } catch (error) {}
    }

    async function deleteLogoAct() {
        const mainImgUrlArr = allData["st_main_img"].split("/");
        const mainImgUrlPath = `uploads/${mainImgUrlArr[3]}/${mainImgUrlArr[4]}/${mainImgUrlArr[5]}`;

        try {
            const res = await axios.post(
                `${back_api}/adm/delete_mainimg`,
                {
                    mainImgUrlPath,
                },
            );
            if (res.data.status) {
                alert("로고가 삭제 되었습니다.");
                invalidateAll();
                allData["st_main_img"] = "";
            }
        } catch (error) {
            alert("에러가 발생 했습니다.");
        }
    }

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const uploadLogoAct = (e) => {
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
                            allData["st_main_img"] = res.data.baseUrl;
                        })
                        .catch((err) => {
                            console.error();
                            alert(`${err.message} 에러가 발생 했습니다.`);
                        });
                };
            };
        };
    };

    function updateMainImgList(e) {
        const imgList = e.detail.imgArr;
        stImgs = setImgArr(imgList);
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

<div class="w-full overflow-auto">
    <div class="w-full min-w-[700px]">
        <div class="mb-2 pl-3 text-base">※ 기본정보</div>
        <table class="w-full">
            <tr>
                <th class="border p-2">현장명</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_name"]}
                    />
                </td>
                <th class="border p-2">세대수</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_house_num"]}
                    />
                </td>
            </tr>

            <tr>
                <th class="border p-2">전용면적</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_area_size"]}
                    />
                </td>
                <th class="border p-2">규모</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_scale"]}
                    />
                </td>
            </tr>

            <tr>
                <th class="border p-2">시공예정</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_construct_date"]}
                    />
                </td>
                <th class="border p-2">시행사</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_developer"]}
                    />
                </td>
            </tr>

            <tr>
                <th class="border p-2">공급위치</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_supply_location"]}
                    />
                </td>
                <th class="border p-2">입주예정</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_movein_date"]}
                    />
                </td>
            </tr>

            <tr>
                <th class="border p-2">문의</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_inquiry"]}
                    />
                </td>
                <th class="border p-2">분양가</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border p-2 w-full focus:outline-none focus:border-blue-500"
                        bind:value={allData["st_parcel_price"]}
                    />
                </td>
            </tr>
        </table>
    </div>
</div>

<div class="mt-5">
    <div class="mb-2 pl-3 text-base">※ 현장 설명</div>
    <div>
        <textarea
            rows="7"
            class="border p-3 w-full focus:outline-none focus:border-blue-500 rounded-md"
            bind:value={allData["st_description"]}
        ></textarea>
    </div>
</div>

<div class="mt-5">
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
                on:click={deleteLogoAct}
            >
                메인이미지 삭제
            </button>
        {:else}
            <button
                class="py-1 px-3 text-xs text-white rounded-md bg-blue-500 active:bg-blue-600"
                on:click={uploadLogoAct}
            >
                메인이미지 업로드
            </button>
        {/if}
    </div>
</div>

<div class="mt-5">
    <div class="mb-2 pl-3 text-base">※ 현장 설명 이미지</div>
    <div></div>
</div>

<div class="py-5 px-3 border rounded-md mt-5">
    <span class="text-sm">▣ 이미지 리스트</span>
    <SortableImg
        on:updateImgeList={updateMainImgList}
        modifyImageList={stImgs}
    />
</div>

<div class="mt-5 pb-10 text-center">
    {#if data.getId}
        <button
            class="text-lg text-white py-1.5 px-10 bg-green-600 active:bg-green-700 rounded-lg"
            value="update"
            on:click={uploadData}
        >
            업로드
        </button>
    {:else}
        <button
            class="text-lg text-white py-1.5 px-10 bg-green-600 active:bg-green-700 rounded-lg"
            value="upload"
            on:click={uploadData}
        >
            업로드
        </button>
    {/if}

    <button on:click={() => {
        console.log(stImgs);
        
    }}>xptmxm</button>
</div>

<script>
    import moment from "moment-timezone";
    moment.tz.setDefault("Asia/Seoul");
    import SeoMeta from "$lib/components/SeoMeta.svelte";

    export let data;
    let siteList = [];
    $: data, setData();
    function setData() {
        console.log(data);
        siteList = data.siteList;
    }
</script>

<div class="mb-4">
    <a href="/adm/site/write">
        <button
            class="py-1.5 px-4 bg-yellow-500 active:bg-yellow-600 rounded-lg text-white"
        >
            분양글 추가
        </button>
    </a>
</div>

<div>
    <table class="w-full">
        <tr>
            <th class="border p-2">
                <input type="checkbox" name="" id="" />
            </th>
            <th class="border p-2"> 현장명 </th>
            <th class="border p-2"> 생성일 </th>
        </tr>

        {#each siteList as site, idx}
            <tr>
                <td class="border p-2 text-center">
                    <input type="checkbox" name="" id="" />
                </td>
                <td class="border p-2 text-center">
                    {site.st_name}
                    <a href="/adm/site/write?st_id={site.st_id}">
                        <button
                            class="py-0.5 px-2 bg-blue-500 active:bg-blue-600 rounded-md text-white"
                        >
                            수정
                        </button>
                    </a>

                    <a href="/site/{site.st_id}" target="_blank">
                        <button
                            class="py-0.5 px-2 bg-blue-500 active:bg-blue-600 rounded-md text-white"
                        >
                            보기
                        </button>
                    </a>
                </td>
                <td class="border p-2 text-center">
                    {moment(site.st_created_at).format("YYYY-MM-DD HH:mm:ss")}
                </td>
            </tr>
        {/each}
    </table>
</div>

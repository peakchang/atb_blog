<script>
    import SeoMeta from "$lib/components/SeoMeta.svelte";
    import { authStatus } from "$lib/store";
    export let data;
    let siteInfo = {};
    let seoValue = {};
    let getId = "";
    $: data, setData();
    function setData() {
        siteInfo = data.siteInfo;
        console.log(siteInfo);
        seoValue = data.seoValue;
        getId = siteInfo.st_id
    }

    

    async function deletePost() {}
</script>

<svelte:head>
    <SeoMeta bind:seoValue />
</svelte:head>

<div
    class="my-3 suit-font"
    data-sveltekit-preload-data="tap"
    data-sveltekit-reload
>
    {#if $authStatus}
        <a href="/write?id={getId}&type=land">
            <button class="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white">
                <i class="fa fa-cog" aria-hidden="true"></i> 수정하기
            </button>
        </a>
        <button
            class="px-3 py-1 text-sm rounded-lg bg-red-500 text-white"
            on:click={deletePost}
        >
            <i class="fa-solid fa-circle-minus" /> 삭제하기
        </button>
    {/if}
</div>

<div class="suit-font">
    <div class="text-4xl font-bold text-gray-600 text-center py-5 bg-gray-100">
        {siteInfo.st_name}
    </div>

    <div class="text-center pt-5">
        <img src={siteInfo.st_main_img} alt="" class="mx-auto" />
    </div>

    <div class="pt-10">
        <table class="w-full">
            <tr>
                <th class="border p-2 text-sm">현장명</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_name}
                        {siteInfo.st_name}
                    {/if}
                </td>
                <th class="border p-2 text-sm">세대수</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_house_num}
                        {siteInfo.st_house_num}
                    {/if}
                </td>
            </tr>
            <tr>
                <th class="border p-2 text-sm">전용면적</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_area_size}
                        {siteInfo.st_area_size}
                    {/if}
                </td>
                <th class="border p-2 text-sm">규모</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_scale}
                        {siteInfo.st_scale}
                    {/if}
                </td>
            </tr>
            <tr>
                <th class="border p-2 text-sm">시공예정</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_constructer}
                        {siteInfo.st_constructer}
                    {/if}
                </td>
                <th class="border p-2 text-sm">시행사</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_developer}
                        {siteInfo.st_developer}
                    {/if}
                </td>
            </tr>
            <tr>
                <th class="border p-2 text-sm">공급위치</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_supply_location}
                        {siteInfo.st_supply_location}
                    {/if}
                </td>
                <th class="border p-2 text-sm">입주예정</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_movein_date}
                        {siteInfo.st_movein_date}
                    {/if}
                </td>
            </tr>
            <tr>
                <th class="border p-2 text-sm">문의</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_inquiry}
                        {siteInfo.st_inquiry}
                    {/if}
                </td>
                <th class="border p-2 text-sm">분양가</th>
                <td class="border p-2 text-sm">
                    {#if siteInfo.st_parcel_price}
                        {siteInfo.st_parcel_price}
                    {/if}
                </td>
            </tr>
        </table>
    </div>

    <div class="pt-5">
        <div class="border p-5">
            {#if siteInfo.st_description}
                {@html siteInfo.st_description.replaceAll("\n", "<br>")}
            {/if}
        </div>
    </div>

    <div class="pt-5">
        {#if siteInfo.st_imgs}
            {#each siteInfo.st_imgs.split(",") as imgLink}
                <img src={imgLink} alt="" class="mx-auto" />
            {/each}
        {/if}
    </div>
</div>

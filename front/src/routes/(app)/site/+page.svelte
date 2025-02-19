<script>
    import SeoMeta from "$src/lib/components/SeoMeta.svelte";

    let siteList = [];
    let seoValue = {};
    export let data;
    $: data, setData();
    function setData() {
        siteList = data.site_list;
        seoValue = data.seoValue;
    }
</script>

<svelte:head>
    <SeoMeta bind:seoValue />
</svelte:head>

<div
    data-sveltekit-preload-data="tap"
    data-sveltekit-reload
    class="grid grid-cols-2 md:grid-cols-3 suit-font gap-3 mt-8"
>
    {#each siteList as site}
        <a href={`/site/${site.bo_id}`}>
            <div class="border rounded-md overflow-hidden">
                <div class=" h-40 overflow-hidden">
                    <img
                        src={site.bo_main_img}
                        alt=""
                        class="min-w-full min-h-full align-center"
                    />
                </div>
                <div class="p-3">
                    {site.bo_name}
                </div>
            </div>
        </a>
    {/each}
</div>

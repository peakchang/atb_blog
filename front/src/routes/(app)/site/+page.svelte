<script>
    let siteList = [];
    export let data;
    $: data, setData();
    function setData() {
        siteList = data.site_list;
        console.log(siteList);
    }
</script>

<div
    data-sveltekit-preload-data="tap"
    class="grid grid-cols-2 md:grid-cols-3 suit-font gap-3 mt-8"
>
    {#each siteList as site}
        <a href={`/site/${site.st_id}`}>
            <div class="border rounded-md overflow-hidden">
                <div class=" h-40 overflow-hidden">
                    <img
                        src={site.st_main_img}
                        alt=""
                        class="min-w-full min-h-full align-center"
                    />
                </div>
                <div class="p-3">
                    {site.st_name}
                </div>
            </div>
        </a>
    {/each}
</div>

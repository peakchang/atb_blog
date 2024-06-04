<script>
    import moment from "moment-timezone";

    let siteVisitList = [];

    export let data;
    $: data, setData();

    function setData() {
        siteVisitList = data.site_visit_list;
    }
</script>

<div>일단 버튼 영역</div>

<div class="w-full min-w-[800px] overflow-auto">
    <div class="w-full max-w-[1200px]">
        <table class="w-full text-center">
            <tr>
                <th class="border p-1.5">
                    <input type="checkbox" name="" id="" />
                </th>
                <th class="border p-1.5"> 방문 도메인 </th>
                <th class="border p-1.5 w-[200px]"> 아이피 </th>
                <th class="border p-1.5"> 이전주소 </th>
                <th class="border p-1.5"> UserAgent </th>
                <th class="border p-1.5"> 날짜 </th>
            </tr>

            {#each siteVisitList as data}
                <tr>
                    <td class="border p-1.5">
                        <input type="checkbox" name="" id="" />
                    </td>
                    <td class="border p-1.5"> {data.sv_domain} </td>
                    <td class="border p-1.5"> {data.sv_ip} </td>
                    <td class="border p-1.5">
                        <div class="mx-auto break-words" style="width:350px;">
                            <span class="">
                                {data.sv_referrer}
                            </span>
                        </div>
                    </td>
                    <td class="border p-1.5">
                        <div class="mx-auto" style="width:350px">
                            {data.sv_ua}
                        </div>
                    </td>
                    <td class="border p-1.5">
                        {moment(data.sv_created_at).format("YY/MM/DD HH:mm:ss")}
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</div>

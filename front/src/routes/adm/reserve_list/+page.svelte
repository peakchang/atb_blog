<script>
    import { Button } from "flowbite-svelte";
    import { back_api } from "$src/lib/const";
    import axios from "axios";
    import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
    export let data;

    $: data, setData();

    let reserveList = [];

    function setData() {
        reserveList = data.reserveList;
        console.log(reserveList);
    }

    console.log(data);

    async function real_set_reserve_content() {
        if (!confirm("맞는지 체크 한번만 더 하고 올리세요!!")) {
            return;
        }

        try {
            const res = await axios.post(
                `${back_api}/board/real_set_reserve_content`,
                { id: this.value },
            );

            if(res.status == 200){
                alert('업로드 성공!')
                invalidateAll();
            }
        } catch (error) {}
    }
</script>

<table class="w-full text-center">
    <tr>
        <th class="border p-1"> 제목 </th>
        <th class="border p-1"> 메모 </th>
        <th class="border p-1"> 테이블 </th>
        <th class="border p-1"> 버튼 </th>
    </tr>
    {#each reserveList as reserve}
        <tr>
            <td class="border p-2 w-[35%]">
                {reserve.bo_subject ? reserve.bo_subject : reserve.bo_name}
            </td>
            <td class="border p-2 w-[25%]">
                {reserve.bo_memo}
            </td>
            <td class="border p-2 w-[20%]">
                {reserve.bo_table_name}
            </td>
            <td class="border p-2 w-[20%]">
                <Button
                    color="green"
                    size="xs"
                    value={reserve.bo_id}
                    on:click={real_set_reserve_content}
                >
                    글 업로드
                </Button>
            </td>
        </tr>
    {/each}
</table>
asdfasdfasdfasdf

<script>
    export let data;

    $: data, setData();


    let reserveList = [];

    function setData() {
        reserveList = data.reserveList;
        console.log(reserveList);
        
    }

    console.log(data);
    
</script>

asdfasdfasdfasdf
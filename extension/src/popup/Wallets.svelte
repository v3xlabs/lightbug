<script lang="ts">
    export let addresses: string[] = []
    const getData = async () => {
        const url = new URL("https://enstate.rs/bulk/a")
    
        addresses.forEach((address) => {
            url.searchParams.append("addresses[]", address)
        })
    
        const response = await fetch(url.toString())
        return (await response.json()).response
    }

    let data = getData()
    console.log(data)
</script>

    <ul>
        {#await data}
            <li>Loading...</li>
        {:then data}
            {#each data as data}
                <li>
                    <div>
                        <div class="bg-yellow-600 w-8">

                        </div>
                    </div>
                </li>
            {/each}
        {:catch error}
            <li>Error: {error.message}</li>
        {/await}
    </ul>
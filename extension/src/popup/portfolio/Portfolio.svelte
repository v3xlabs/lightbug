<script lang="ts">
    let address = "0x8F8f07b6D61806Ec38febd15B07528dCF2903Ae7";
    const fetchData = async () => {
        const response = await fetch(
            `https://eth.blockscout.com/api/v2/addresses/${address}/tokens?type=ERC-20`,
        );
        return await response.json();
    };
</script>

{#await fetchData() then fetchData}
    <h1 class="text-2xl">Portfolio</h1>

    <ul>
        {#each fetchData.items as token}
            <li class="border border-neutral-400 p-2 my-2 rounded-lg w-full">
                {token.token.name} - {(token.value/1000000)}
            </li>
        {/each}
    </ul>
{/await}
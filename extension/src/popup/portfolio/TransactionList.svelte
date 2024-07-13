<script lang="ts">
    import { formatAddress } from "ens-tools";
    import { formatEther } from "viem";

        let address = "0x8F8f07b6D61806Ec38febd15B07528dCF2903Ae7";
    const fetchData = async () => {
        const response = await fetch(
            `https://eth.blockscout.com/api/v2/addresses/${address}/transactions`,
        );
        return await response.json();
    };
</script>
{#await fetchData() then fetchData}
    <h1 class="text-2xl">Transactions</h1>

    <ul>
        {#each fetchData.items as transaction}
            <li class="border border-neutral-400 p-2 my-2 rounded-lg w-full">
                {formatAddress(transaction.from.ens_name || transaction.from.hash)} - {formatAddress(transaction.to.ens_name || transaction.to.hash)} - {formatEther(transaction.value)}
            </li>
        {/each}
    </ul>
{/await}
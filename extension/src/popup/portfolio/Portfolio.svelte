<script lang="ts">
    import { http, createPublicClient, formatEther } from "viem";
    import { mainnet } from "viem/chains";

    export const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(),
    });

    const balance = publicClient.getBalance({
        address: "0x8F8f07b6D61806Ec38febd15B07528dCF2903Ae7",
    });

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
            <!-- This displays amount of ether -->
            <li class="border border-neutrla-400 p-2 my-2 rounded-lg w-full">Ethereum (amount) - {#await balance then balance1}{parseFloat(formatEther(balance1)).toFixed(2)}{/await}</li>
        
        {#each fetchData.items as token}
            <li class="border border-neutral-400 p-2 my-2 rounded-lg w-full">
                {token.token.name} - ${token.value /
                    Math.pow(10, token.token.decimals)}
            </li>
        {/each}
    </ul>
{/await}

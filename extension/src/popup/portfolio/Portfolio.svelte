<script lang="ts">
    import { http, createPublicClient, formatEther } from "viem";
    import { mainnet } from "viem/chains";
    import { activeWallet } from "../DeviceConnector";
    import { pop } from 'svelte-spa-router'

    export const publicClient = createPublicClient({
        chain: mainnet,
        transport: http('https://rpc.ankr.com/eth'),
    });

    const balance = publicClient.getBalance({
        address: $activeWallet as any,
    });

    let address = "0x8F8f07b6D61806Ec38febd15B07528dCF2903Ae7";
    const fetchData = async () => {
        const response = await fetch(
            `https://eth.blockscout.com/api/v2/addresses/${$activeWallet}/tokens?type=ERC-20`,
        );
        return await response.json();
    };
</script>

<button class="" on:click={pop}>Back</button>

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

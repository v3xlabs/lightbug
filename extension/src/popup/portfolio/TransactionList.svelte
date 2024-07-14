<script lang="ts">
    import { formatAddress } from "ens-tools";
    import { formatTransaction } from "viem";
    import { activeWallet } from '../DeviceConnector';
    import { pop } from 'svelte-spa-router';

    const fetchData = async () => {
        const response = await fetch(
            `https://eth.blockscout.com/api/v2/addresses/${$activeWallet}/transactions`,
        );
        return await response.json();
    };

    const mode = (activeWallet:string, txt_from:string) => {
        if (activeWallet == txt_from) {
            return 'Sent';
        } else {
            return 'Received';
        }
    }
</script>
<button class="" on:click={pop}>Back</button>

{#await fetchData() then fetchData}
    <h1 class="text-2xl">Transactions</h1>

    <ul>
        {#each fetchData.items as transaction}
        <a target="_blank" href={`https://eth.blockscout.com/tx/${transaction.hash}`}>
            <li class="border border-neutral-400 p-2 my-2 rounded-lg w-full">
                <!-- {formatAddress(transaction.from?.ens_name || transaction.from?.hash || '0x0')} - {formatAddress(transaction.to?.ens_name || transaction.to?.hash || '0x0')} - {formatEther(transaction.value)} -->
                <div class="text-lg">{mode($activeWallet, transaction.from) === "Sent" ? "Sent yo " : "Received from "} {mode($activeWallet, transaction.from) === "Sent" ? formatAddress(transaction.to.hash) : formatAddress(transaction.from.hash)}</div>
                <div class="text-md">{transaction.hash.slice(0,6)}...{transaction.hash.slice(-4)}</div>
            </li>
        </a>
        {/each}
    </ul>
{/await}
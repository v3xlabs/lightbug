<script lang="ts">
    import {formatAddress} from "ens-tools"
    import { activeWallet, deviceConnector, wallets } from './DeviceConnector';
    import clsx from "clsx";
    import { pop } from 'svelte-spa-router'
    // const getData = async () => {
    //     const url = new URL("https://enstate.rs/bulk/a");

    //     addresses.forEach((address) => {
    //         url.searchParams.append("addresses[]", address);
    //     });

    //     const response = await fetch(url.toString());
    //     return (await response.json()).response;
    // };

    // let data = getData();
    // console.log(data);
</script>

<button class="w-full" on:click={pop}>Back</button>

<h1 class="text-2xl">Choose your wallet</h1>

<button class="w-full" on:click={deviceConnector.setMockValues}>Set Mock</button>


<ul>
    <!-- {#await data}
        <li>Loading...</li>
    {:then data} -->
        {#each $wallets as address}
        <button class="w-full" on:click={() => deviceConnector.setActiveWallet(address)}>
            <li class={clsx("border border-neutral-400 p-2 my-2 rounded-lg w-full", address === $activeWallet ? "!border-yellow-600 border-2" : "")}>
                <div>
                    <div class="flex flex-row">
                        <div class="bg-yellow-600 size-14">
                        </div>
                        <div class="mx-2 flex flex-col">
                            <span class="text-lg font-semibold">
                                {formatAddress(address)}
                            </span>
                        </div>
                    </div>
                </div>
            </li>
        </button>
        {/each}
    <!-- {:catch error}
        <li>Error: {error.message}</li>
    {/await} -->
</ul>

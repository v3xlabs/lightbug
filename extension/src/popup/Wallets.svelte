<script lang="ts">
    export let addresses: string[] = [];
    import {formatAddress} from "ens-tools"
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

<ul>
    <!-- {#await data}
        <li>Loading...</li>
    {:then data} -->
        {#each addresses as address}
        <button class="w-full" on:click={console.log}>
            <li class="border border-neutral-400 p-2 my-2 rounded-lg w-full">
                <div>
                    <div class=" flex flex-row">
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

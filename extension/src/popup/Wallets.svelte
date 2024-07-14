<script lang="ts">
    import { formatAddress } from "ens-tools";
    import { activeWallet, deviceConnector, wallets } from "./DeviceConnector";
    import clsx from "clsx";
    import { pop } from "svelte-spa-router";
    import { fetchENS } from "./utils/ens";
</script>

<div class="px-4">
    <button class="w-full" on:click={pop}>Back</button>

    <h1 class="text-2xl">Choose your wallet</h1>

    <button class="w-full" on:click={deviceConnector.setMockValues}
        >Set Mock</button
    >

    <ul>
        <!-- {#await data}
            <li>Loading...</li>
            {:then data} -->
        {#each $wallets as address}
            <button
                class="w-full"
                on:click={() => deviceConnector.setActiveWallet(address)}
            >
                <li
                    class={clsx(
                        "border border-neutral-400 p-2 my-2 rounded-lg w-full",
                        address === $activeWallet
                            ? "!border-yellow-600 border-2"
                            : "",
                    )}
                >
                    <div>
                        {#await fetchENS(address)}
                            <div>suspense</div>
                        {:then profile}
                            <div class="flex flex-row">
                                {#if profile?.avatar}
                                    <div class="bg-yellow-600 size-14">
                                        <img
                                            src={`https://avatarservice.xyz/128/${profile.name}.webp`}
                                            alt="avatar"
                                            class="object-cover"
                                        />
                                    </div>
                                {/if}

                                <div
                                    class="mx-2 flex flex-col justify-center items-start"
                                >
                                    <span class="text-lg font-semibold">
                                        {profile?.name ??
                                            formatAddress(address)}
                                    </span>
                                    {#if profile?.name}
                                        <span class="text-sm text-neutral-400">
                                            {formatAddress(address)}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        {:catch error}
                            <div>
                                error {error.message}
                            </div>
                        {/await}
                    </div>
                </li>
            </button>
        {/each}
        <!-- {:catch error}
            <li>Error: {error.message}</li>
            {/await} -->
    </ul>
</div>

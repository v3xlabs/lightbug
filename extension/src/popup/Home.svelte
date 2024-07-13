<script lang="ts">
    import { formatAddress } from "ens-tools";
    import "../app.css";
    import { serialManager, serialManagerStatus } from "./SerialManager";
    import clsx from "clsx";
    import { activeWallet } from './DeviceConnector';

    // const wallet = "0x225f137127d9067788314bc7fcc1f36746a3c3B5";
    // const wallet = "0xd577D1322cB22eB6EAC1a008F62b18807921EFBc";
    // const wallet = "0x8F8f07b6D61806Ec38febd15B07528dCF2903Ae7";

    let profile:
        | undefined
        | { name?: string; avatar?: string; header?: string } = undefined;

    const fetchENS = async (address: string) => {
        const response = await fetch(`https://enstate.rs/a/${address}`);
        const data = await response.json();
        profile = data;
        return data;
    };

    $: fetchENS($activeWallet).then(console.log);

    // chrome.runtime.sendMessage({ action: "lb_request_device" }, (response) => {
    //     console.log("Received device info", response);
    //     // message = JSON.stringify(response);
    // });
</script>

<main class="p-8 min-w-96 bg-[#FEF9ED] h-screen flex flex-col relative">
    <div>
        {#if profile}
            {#if profile.header}
                <div
                    class="absolute inset-x-2 top-2 object-cover bg-gray-200 aspect-[3/1] rounded-lg overflow-hidden"
                >
                    <img
                        src={profile.header}
                        alt="banner"
                        class="w-full object-cover"
                    />
                </div>
            {/if}
            {#if profile.avatar}
                <div
                    class={clsx(
                        "w-16 h-16 rounded-md overflow-hidden border-2 border-gray-500/25 bg-white",
                        profile.header ? "absolute right-6 top-24" : "absolute right-6 top-6",
                    )}
                >
                    <img
                        src={profile.avatar}
                        alt="avatar"
                        class="object-cover"
                    />
                </div>
            {/if}
        {/if}
    </div>

    <div class:pt-28={!!profile?.header} class:pt-6={!profile?.header && profile?.avatar}>
        <div>
            <h1 class="text-xl py-2">
                Hello <span class="font-bold"
                    >{profile?.name ?? formatAddress($activeWallet)}</span
                >
            </h1>
        </div>
    </div>

    <div class="space-y-2 pt-2">
        <a
            href="#/wallets"
            class="px-4 py-2 bg-cyan-800 text-white rounded-lg">Wallets</a
        >
        <a
            href="#/portfolio"
            class="px-4 py-2 bg-purple-800 text-white rounded-lg">Portfolio</a
        >
        <a
            href="#/transactions"
            class="px-4 py-2 bg-green-800 text-white rounded-lg">Transactions
        </a>
    </div>

    <!-- <button on:click={pairFireFly}>Pair FireFly</button> -->
    <!-- <a href={chrome.runtime.getURL("html/options.html")} target="_blank">Options</a>
    {#if $serialManagerStatus === "disconnected"}
        <div class="my-auto">
            <h1 class="text-4xl my-2">Please select a device</h1>
            <button
                class="px-4 py-2 bg-purple-800 text-white rounded-lg"
                on:click={() => {
                    serialManager.request();
                }}>Select FireFly</button
            >
        </div>
    {:else if $page === "intro"}
        <div class="my-auto">
            <h1 class="text-4xl my-2">Welcome to Lightbug</h1>
            <button
                class="px-4 py-2 bg-purple-800 text-white rounded-lg"
                on:click={() => {
                    page.set("choose-device");
                }}>Next</button
            >
            <p id="message">{message}</p>
        </div>
    {:else if $page === "choose-device"}
        <div class="my-auto">
            <h1 class="text-4xl my-2">Please select a device</h1>
            <p class="text-lg">Your browser serial popup should open</p>
        </div>
    {:else if $page === "choose-wallet"}
        <h1 class="text-2xl">Choose your wallet</h1>
        <Wallets {addresses} />
    {/if} -->
</main>

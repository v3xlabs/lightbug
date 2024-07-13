<script lang="ts">
    import { writable } from "svelte/store";
    import Portfolio from "./portfolio/Portfolio.svelte";
    import "../app.css";
    import Wallets from "./Wallets.svelte";

    import { serialManager, serialManagerStatus } from "./SerialManager";

    const addresses = ["0x8F8f07b6D61806Ec38febd15B07528dCF2903Ae7"];

    // intro > choose-device > choose wallet > wallet page

    import "../app.css";

    let message = "hello";

    chrome.runtime.sendMessage({ action: "lb_request_device" }, (response) => {
        console.log("Received device info", response);
        message = JSON.stringify(response);
    });

</script>

<main class="p-8 min-w-96 bg-[#FEF9ED] h-screen flex flex-col">
    <p>
        Serial status: {$serialManagerStatus}
    </p>

    <a href="#/wallets" class="px-4 py-2 bg-purple-800 text-white rounded-lg">Wallets</a>

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

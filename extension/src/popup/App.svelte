<script lang="ts">
    import { writable } from "svelte/store";
    import Portfolio from "./portfolio/Portfolio.svelte";

    const connected = true;
    // intro > choose-device > choose wallet > wallet page
    type pages = "intro" | "choose-device" | "choose-wallet" | "wallet-page";
    const page = writable<pages>("intro");
    import "../app.css";

    let message = "hello";  
    
    chrome.runtime.sendMessage({ action: "requestInfo", lightbug: true }, (response) => {
        console.log("Popup Info got response", response);
        message = JSON.stringify(response);
    });
</script>

<main class="p-8 min-w-96">
    {#if $page === "intro"}
        <h1 class="text-2xl">Welcome to Lightbug</h1>
        <button
            on:click={() => {
                page.set("choose-device");
            }}>Next</button
        >
        <p id="message">{message}</p>
    {:else if $page === "choose-device"}
        <h1 class="text-2xl">Choose your device</h1>
        <button
            on:click={() => {
                page.set("choose-wallet");
            }}>Next</button
        >
    {:else if $page === "choose-wallet"}
        <h1 class="text-2xl">Choose your wallet</h1>
        <button
            on:click={() => {
                page.set("wallet-page");
            }}>Next</button
        >
    {:else if $page === "wallet-page"}
        <Portfolio />
    {/if}
</main>

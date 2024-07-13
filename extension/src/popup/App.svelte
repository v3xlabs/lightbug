<script lang="ts">
    import { writable } from "svelte/store";
    import Portfolio from "./portfolio/Portfolio.svelte";
    import "../app.css";

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

<main class="p-8 min-w-96 bg-[#FEF9ED] h-screen flex flex-col">
    {#if $page === "intro"}
        <div class="my-auto">
            <h1 class="text-4xl my-2">Welcome to Lightbug</h1>
            <button class="px-4 py-2 bg-purple-800 text-white rounded-lg"
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
        <button
            on:click={() => {
                page.set("wallet-page");
            }}>Next</button
        >
    {:else if $page === "wallet-page"}
        <Portfolio />
    {/if}
</main>
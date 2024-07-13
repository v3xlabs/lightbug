<script lang="ts">
    import "../app.css";

    import Router from "svelte-spa-router";
    import { routes } from "./router";

    import { serialManagerStatus } from "./SerialManager";
</script>

<main class="p-8 min-w-96 h-screen flex flex-col">
    {#if $serialManagerStatus === "disconnected"}
        <div class="my-auto">
            <h1 class="text-2xl my-2">Connect your FireFly</h1>
            <p class="text-base mb-4">
                Your browser must support WebSerial to be able to communicate
                with the <a href="https://firefly.app">FireFly Pixie</a>.
            </p>
            <a
                href={chrome.runtime.getURL("html/setup.html")}
                target="_blank"
                class="px-4 py-2 bg-green-700 text-white rounded-lg"
                >Pair FireFly</a
            >
        </div>
    {:else}
        <Router {routes} />
    {/if}
</main>

<style>
    :global(html) {
        width: 420px;
        height: 420px;
        min-width: 420px;
        max-width: 100%;
        min-height: 420px;
        max-height: 100%;
        position: relative;
        vertical-align: middle;
    }
</style>

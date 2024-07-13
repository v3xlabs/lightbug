<script lang="ts">
    import "../app.css";

    import Router from "svelte-spa-router";
    import { routes } from "./router";

    import { serialManagerStatus } from "./SerialManager";
</script>

<main class="p-8 min-w-96 h-screen flex flex-col">
    {#if $serialManagerStatus === "disconnected"}
        <div class="my-auto">
            <h1 class="text-3xl my-2">Connect your FireFly to continue</h1>

            <!-- or if it's already connected, try pairing it -->
            <p class="text-lg mb-2">
                Or if it's already connected, try pairing it by clicking the
                button below
            </p>
            <a
                href={chrome.runtime.getURL("html/setup.html")}
                target="_blank"
                class="px-4 py-2 bg-purple-800 text-white rounded-lg"
                >Setup FireFly</a
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

<script lang="ts">
    import "../app.css";
    import GoLink from "svelte-icons/go/GoLink.svelte";

    import { serialManager, serialManagerStatus } from "../popup/SerialManager";

    let setting: string = "default setting";

    async function pairFireFly() {
        await serialManager.request();
    }

    async function unpairFireFly() {
        await serialManager.unpair();
    }
</script>

<main>
    <div class="border rounded-md h-fit flex items-center">
        <span class="p-2 border-r">
            <div class="w-4 h-4">
                <GoLink />
            </div>
        </span>
        <span class="p-1">
            {$serialManagerStatus}
        </span>
    </div>
    {#if $serialManagerStatus === "disconnected"}
        <div class="my-auto">
            <h1 class="text-xl text-bold my-2">Connect your FireFly to continue</h1>

            <!-- or if it's already connected, try pairing it -->
            <p class="text-base mb-2">
                Or if it's already connected, try pairing it by clicking the
                button below
            </p>
            <button
                on:click={pairFireFly}
                class="px-4 py-2 bg-purple-800 text-white rounded-lg"
            >
                Connect Device
            </button>
        </div>
    {:else}
        <div class="p-4 bg-green-500 rounded-lg w-fit mx-auto">
            <div>You are good to go!</div>
            <p>
                You can now close this window and continue using the extension.
            </p>
            <button class="bg-purple-500 px-4 py-1" on:click={unpairFireFly}>Disconnect</button>
        </div>
    {/if}
</main>

<style>
    main {
        padding: 1em;
        margin: 0 auto;
        max-width: 420px;
        width: 100%;

        @apply space-y-2;
    }
</style>

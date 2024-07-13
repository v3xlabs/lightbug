<script lang="ts">
    import "../app.css";

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
    <h1></h1>
    <p>Current Serial Status: {$serialManagerStatus}</p>

    {#if $serialManagerStatus === "disconnected"}
        <div class="my-auto">
            <h1 class="text-3xl my-2">Connect your FireFly to continue</h1>

            <!-- or if it's already connected, try pairing it -->
            <p class="text-lg mb-2">
                Or if it's already connected, try pairing it by clicking the
                button below
            </p>
            <button
                on:click={pairFireFly}
                class="px-4 py-2 bg-purple-800 text-white rounded-lg"
            >
                Connect FireFly
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
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }
    h1 {
        color: #ff3e00;
        font-size: 4em;
    }
</style>

<script lang="ts">
    import { writable } from "svelte/store";

    const connected = false;
    const page = writable("main");
</script>

<main class="p-8">
    {#if $page === "main"}
        <h1 class="text-4xl">Lightbug</h1>
        {#if connected}
            <p>Connected</p>
        {:else}
            <p>Ready to connect</p>
            <button
                on:click={() => {
                    $page = "flash";
                }}>or flash a new device</button
            >
        {/if}
    {:else if $page === "flash"}
        Connect your device to flash it
    {/if}
</main>

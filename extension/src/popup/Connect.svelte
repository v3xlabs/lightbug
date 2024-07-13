<script lang="ts">
    export let rejectCallback: () => void
    export let resolveCallback: () => void
    export let dapp: {
        name: string
        url: string
        image: string
    } = {
        name: "Lightbug",
        url: "https://lightbug.io",
        image: "https://lightbug.io/logo.png"
    }
</script>

<div class="min-w-96 bg-[#FEF9ED] h-screen flex flex-col">
    <div class="my-auto">
        <h1 class="text-4xl my-2">Connect to {dapp.name}</h1>
        <button
            class="px-4 py-2 bg-purple-800 text-white rounded-lg"
            on:click={() => {
                resolveCallback()
            }}>Connect</button>
        <button
            class="px-4 py-2 bg-purple-800 text-white rounded-lg"
            on:click={() => {
                rejectCallback()
            }}>Cancel</button>
    </div>
</div>
<script lang="ts">
    let setting: string = "default setting";

    async function pairFireFly() {
        let port = await navigator.serial.requestPort().catch((err) => {
            alert("Error: " + err);
        });

        if (port) {
            alert("Successfully connected to " + port.getInfo().usbProductId);
        }
    }
</script>

<main>
    <h1>Options Page</h1>
    <p>Current setting: {setting}</p>

    <button on:click={pairFireFly}>Pair FireFly</button>
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

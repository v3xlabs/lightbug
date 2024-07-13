import { get, writable } from "svelte/store";

const FIREFLY_PRODUCT_ID = 4097;
const FIREFLY_VENDOR_ID = 12346;
const FIREFLY_BAUD_RATE = 115200;

class SerialManager {
    private _port: SerialPort | null = null;
    public status = writable<"disconnected" | "connecting" | "connected">(
        "disconnected"
    );

    private _reader: ReadableStreamDefaultReader<string> | null = null;

    public constructor() {
        console.log("Serial manager init");

        navigator.serial.addEventListener("connect", (ev) => {
            console.log("Serial port connected", ev);
            this.connectPort(ev.target as SerialPort);
        });

        this.init();
    }

    public async init() {
        if (this._port == null) {
            console.log("Serial port not initialized");
            const ports = await navigator.serial.getPorts();
            for (const port of ports) {
                const portInfo = port.getInfo();
                console.log("Found port", portInfo);

                if (
                    portInfo.usbProductId === FIREFLY_PRODUCT_ID &&
                    portInfo.usbVendorId === FIREFLY_VENDOR_ID
                ) {
                    await this.connectPort(port);

                    break;
                }
            }
        }
    }

    private async connectPort(port: SerialPort) {
        this.setPort(port);
        let success = await this.tryOpenPort();

        if (!success) {
            throw new Error("Failed to open port");
        }

        const decoder = new TextDecoderStream();

        this._reader = port.readable!.pipeThrough(decoder).getReader();

        this.initReader();
    }

    private setPort(port: SerialPort) {
        const portInfo = port.getInfo();
        if (portInfo.usbProductId !== FIREFLY_PRODUCT_ID || portInfo.usbVendorId !== FIREFLY_VENDOR_ID) {
            throw new Error("Invalid port");
        }

        this._port = port;
        this._port.addEventListener("disconnect", (ev) => {
            console.log("Serial port disconnected", ev);
            this.removePort();
        });

        this.status.set("connected");
    }

    private removePort() {
        this._port = null;
        this.status.set("disconnected");
    }

    private async tryOpenPort() {
        if (this._port === null) {
            throw new Error("Serial port not initialized");
        }

        if (get(this.status) === "connecting") {
            throw new Error("Serial port is already connecting");
        }

        this.status.set("connecting");

        try {
            await this._port.open({ baudRate: FIREFLY_BAUD_RATE });
            console.log("Serial port opened");
            this.status.set("connected");
            return true;
        } catch (err) {
            console.log("Failed to open serial port", err);
            this.status.set("disconnected");
            return false
        }
    }

    public get port() {
        // if (this._port === null) {
        //     throw new Error('Serial port not initialized');
        // }

        return this._port;
    }

    public async request() {
        const port = await navigator.serial
            .requestPort({
                filters: [
                    {
                        usbProductId: FIREFLY_PRODUCT_ID,
                        usbVendorId: FIREFLY_VENDOR_ID
                    }
                ]
            })
            .catch((err) => {
                console.log("Serial port request failed", err);
            });

        if (port) {
            console.log("Serial port selected");
            await this.connectPort(port);
        }
    }

    private async initReader() {
        console.log("Initializing reader");
        while (this._reader !== null) {
            const { value, done } = await this._reader.read();
            if (done) {
                this._reader = null;
                console.log("Reader stopped");
                break;
            }

            console.log("Received", value);
        }

        console.log("Reader stopped");
    }
}

export const serialManager = new SerialManager();

export const serialManagerStatus = serialManager.status;

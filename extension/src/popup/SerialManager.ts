import { writable } from "svelte/store";

const FIREFLY_PRODUCT_ID = 4097;
const FIREFLY_VENDOR_ID = 12346;
const FIREFLY_BAUD_RATE = 115200;

class SerialManager {
    private _port: SerialPort | null = null;
    public status = writable<"disconnected" | "connecting" | "connected">(
        "disconnected"
    );

    public constructor() {
        console.log("Serial manager init");
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
                    this.setPort(port);

                    await this.tryOpenPort();

                    break;
                }
            }
        }
    }

    private setPort(port: SerialPort) {
        this._port = port;
        this._port.addEventListener("connect", (ev) => {
            console.log("Serial port connected", ev);
            this.status.set("connected");

            // this._open = true;
        });
        this._port.addEventListener("disconnect", (ev) => {
            console.log("Serial port disconnected", ev);
            this.status.set("disconnected");

            // this._open = false;
        });
    }

    private async tryOpenPort() {
        if (this._port === null) {
            throw new Error("Serial port not initialized");
        }

        this.status.set("connecting");

        try {
            await this._port.open({ baudRate: FIREFLY_BAUD_RATE });
            console.log("Serial port opened");
            this.status.set("connected");
        } catch (err) {
            console.log("Failed to open serial port", err);
            this.status.set("disconnected");
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
                // filters: [
                //     {
                //         usbProductId: FIREFLY_PRODUCT_ID,
                //         usbVendorId: FIREFLY_VENDOR_ID
                //     }
                // ]
            })
            .catch((err) => {
                console.log("Serial port request failed", err);
            });

        if (port) {
            console.log("Serial port selected");
            this.setPort(port);
            await this.tryOpenPort();
        }
    }
}

export const serialManager = new SerialManager();

export const serialManagerStatus = serialManager.status;

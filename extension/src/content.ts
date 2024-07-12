import icon from '../public/icons/injected.svg';
import { EventEmitter } from 'events';

console.log('LightBug content script loaded');

/// <reference types="vite/client" />
interface EIP6963ProviderInfo {
    walletId: string;
    uuid: string;
    name: string;
    icon: string;
}

// Represents the structure of an Ethereum provider based on the EIP-1193 standard.
interface IEIP1193Provider {
    isStatus?: boolean;
    host?: string;
    path?: string;
    sendAsync?: (request: { method: string, params?: Array<unknown> }, callback: (error: Error | null, response: unknown) => void) => void
    send?: (request: { method: string, params?: Array<unknown> }, callback: (error: Error | null, response: unknown) => void) => void
    request: (request: { method: string, params?: Array<unknown> }) => Promise<unknown>
}

interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo;
    provider: IEIP1193Provider;
}

// This type represents the structure of an event dispatched by a wallet to announce its presence based on EIP-6963.
type EIP6963AnnounceProviderEvent = {
    detail: {
        info: EIP6963ProviderInfo,
        provider: IEIP1193Provider
    }
}

// let provider = createProvider();
// @ts-ignore
// let provider = null;
// let provider = new Proxy({}, {
//     get: (target, prop) => {
//         console.log("LightBug provider get", prop);
//         // return target[prop];
//     },
// })

// const x: IEIP1193Provider = {
//     async request(request) {
//         console.log("LightBug provider request", request);
//     },
//     on: (event, listener) => {
//         console.log("LightBug provider on", event, listener);
//     }                           
// }

// // var provider: IEIP1193Provider = new Proxy({}, {
// //     get: (target, prop) => {
// //         console.log("LightBug provider get", prop);
// //     }
// // });
let provider = null;    

// @ts-ignore
// window.ethereum = provider;

console.log({ provider });

var info = {
    uuid: "d85812f6-2258-47e4-bddf-08b5f882579d",
    name: "LightBug",
    icon,
    rdns: "eth.lightbug.wallet"
};

var detail = Object.freeze({
    info,
    provider
});

console.log({ detail });

var publishProvider = () => {
    try {
        console.log("LightBug dispatching 'eip6963:announceProvider' event");
        var event = new CustomEvent('eip6963:announceProvider', {
            detail
        });
        console.log({ event });
        window.dispatchEvent(
            event
        )
    } catch (err) {
        console.error("LightBug could not dispatch 'eip6963:announceProvider' event:", err)
    }
};

window.addEventListener('eip6963:requestProvider', () => {
    publishProvider();
});

publishProvider();

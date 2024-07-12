import icon from '../public/icons/injected.svg';
import EthereumProvider from 'ethereum-provider';
import { EventEmitter } from 'events';

console.log('LightBug content script loaded');

// let provider = null;    
// let provider = new Proxy({}, {
//     get: (target, prop) => {
//         console.log("LightBug provider get", prop);
//         // return target[prop];
//     },
// });


class Connection extends EventEmitter {
    constructor() {
        super()

        window.addEventListener('message', (event) => {
            if (event && event.source === window && event.data) {
                const { type } = event.data

                if (type === 'eth:payload') {
                    this.emit('payload', event.data.payload)
                }

                if (type === 'eth:event') {
                    this.emit(event.data.event, ...event.data.args)
                }
            }
        })

        setTimeout(() => this.emit('connect'), 0)
    }

    send(payload) {
        window.postMessage({ type: 'eth:send', payload }, window.location.origin)
    }
}

class ExtensionProvider extends EthereumProvider {
    // override the send method in order to add a flag that identifies messages
    // as "connection messages", meaning Frame won't track an origin that sends
    // these requests
    doSend(method, params, targetChain, waitForConnection) {
        // if (!waitForConnection && (method === 'eth_chainId' || method === 'net_version')) {
        //     const payload = { jsonrpc: '2.0', id: this.nextId++, method, params, __extensionConnecting: true }
        //     return new Promise((resolve, reject) => {
        //         this.promises[payload.id] = { resolve, reject, method }
        //         this.connection.send(payload)
        //     })
        // }

        console.log("LightBug provider send", method, params, targetChain, waitForConnection);
        // return super.doSend(method, params, targetChain, waitForConnection)
    }
}

let provider = new ExtensionProvider(new Connection());

// @ts-ignore
// window.ethereum = provider;

console.log({ provider });

let info = {
    uuid: "d85812f6-2258-47e4-bddf-08b5f882579d",
    name: "LightBug",
    icon,
    rdns: "eth.lightbug.wallet"
};

let detail = Object.freeze({
    info,
    provider
});

console.log({ detail });

let publishProvider = () => {
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

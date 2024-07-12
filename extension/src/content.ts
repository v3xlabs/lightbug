import icon from '../public/icons/injected.svg';
import EthereumProvider from 'ethereum-provider';
import { EventEmitter } from 'events';
import Provider from './content/provider/provider';

console.log('LightBug content script loaded');

// @ts-ignore
// window.ethereum = provider;
let provider = Provider.currentProvider;

let info = {
    uuid: "d85812f6-2258-47e4-bddf-08b5f882579d",
    name: "LightBug",
    icon,
    rdns: "eth.lightbug.wallet"
};

let publishProvider = () => {
    try {
        console.log("LightBug dispatching 'eip6963:announceProvider' event");
        var event = new CustomEvent('eip6963:announceProvider', {
            detail: Object.freeze({ info, provider })
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

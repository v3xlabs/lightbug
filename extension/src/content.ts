import { get } from 'svelte/store';
import providerInjectorPath from "./content/inject.ts?script&module";
import { activeWallet } from './popup/DeviceConnector';

console.log("LightBug content script loaded");

// Inject the provider script
function injectScript(scriptPath: string) {
    const container = document.head || document.documentElement;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.setAttribute("type", "module");
    script.src = chrome.runtime.getURL(scriptPath);
    script.setAttribute("async", "false");
    container.insertBefore(script, container.children[0]);
    container.removeChild(script);
}

// Listen for messages from the provider
window.addEventListener('message', (event) => {
    // We only accept messages from ourselves
    if (event.source != window) {
        return;
    }

    if (event.data.action && event.data.action.startsWith('lb_')) {

        if (event.data.action === 'lb_get_selected_wallet') {
            window.postMessage({ action: 'lb_wallet_selected', payload: get(activeWallet) }, '*');
            return;
        }

        console.log('got message', event.data.action);
        chrome.runtime.sendMessage(event.data);
    }
}, false);

activeWallet.subscribe((wallet) => {
    console.log('activeWallet changed', wallet);
    window.postMessage({ action: 'lb_wallet_selected', payload: wallet }, '*');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background got message', request);
    if (!request?.action.startsWith('lb_')) return;

    if (request.action === 'lb_wallet_selected') {
        console.log('requestInfo called', sender, request, sendResponse);
        window.postMessage(request.action, '*');
        }
});

injectScript(providerInjectorPath);

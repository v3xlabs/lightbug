import providerInjectorPath from "./content/inject.ts?script&module";

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
        console.log('got message', event.data.action);
        chrome.runtime.sendMessage(event.data);
    }
}, false);

injectScript(providerInjectorPath);

import providerInjectorPath from "./content/inject.ts?script&module";

console.log("LightBug content script loaded");

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

injectScript(providerInjectorPath);

import scriptPath from './yeet.ts?script&module';


console.log('LBProvider scriptPath', scriptPath);

console.log('LightBug content script loaded');

function injectProvider() {
    const container = document.head || document.documentElement;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    // make script module
    script.setAttribute('type', 'module');
    script.src = chrome.runtime.getURL(
        scriptPath
    )
    script.setAttribute('async', 'false');
    container.insertBefore(script, container.children[0]);
    container.removeChild(script);
}


injectProvider();
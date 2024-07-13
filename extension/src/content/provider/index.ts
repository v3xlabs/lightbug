import { EventEmitter } from 'events';
import { createStore } from 'mipd';
import type { Address } from 'viem';

let PROVIDER: LBProvider;

export class LBProvider extends EventEmitter {
    chainId: string;
    accounts: string[];

    constructor() {
        console.log('LBProvider constructor called');
        super();

        this.chainId = '0x1'; // Mainnet
        this.accounts = [];
        PROVIDER = this;
    }

    // Mock request method to handle RPC calls
    async request({ method, params }) {
        console.log(`MockProvider request method called with:`, method, params);
        switch (method) {
            case 'eth_requestAccounts':
                console.log('eth_requestAccounts called');
                // artificial 5 second wait
                window.postMessage({ action: 'lb_open_wallet' }, '*');

                PROVIDER.accounts = await new Promise<string[]>((resolve) => {
                    // TODO: wait for device info and wallet selection
                    const v = (event) => {
                        if (event.data.action === 'lb_wallet_selected') {
                            console.log('wallet selected', event.data);
                            window.removeEventListener('message', v);
                            clearTimeout(timeout_handle);
                            resolve(['0x0000000000000000000000000000000000000000'])
                        }
                    };

                    // wait for either event or timeout
                    const timeout = 5 * 60; // 5 minutes
                    const timeout_handle = setTimeout(() => {
                        // timeout
                        window.removeEventListener('message', v);
                        // resolve([]);
                        // TODO: remove this
                        resolve(['0x0000000000000000000000000000000000000000'])
                    }, timeout);
                    window.addEventListener('message', v);
                });

                return PROVIDER.accounts;
            case 'eth_chainId':
                console.log('eth_chainId called');
                return PROVIDER.chainId;
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    }

    // Mock enable method for compatibility with older dapps
    async enable() {
        return PROVIDER.accounts;
    }
}

// Initialize the MIPD store
const store = createStore();

// Subscribe to the MIPD store to log provider details
store.subscribe(providerDetails => {
    console.log('Providers available:', providerDetails);
});

// Inject the mock provider into the page
(function () {
    // announceMockProvider();
    console.log('MockProvider injected and MIPD setup complete.');
})();

import { EventEmitter } from 'events';
import { createStore } from 'mipd';

export class LBProvider extends EventEmitter {
    constructor() {
        console.log('LBProvider constructor called');
        super();

        this.isMock = true;
        this.chainId = '0x1'; // Mainnet
        this.accounts = ['0x0000000000000000000000000000000000000000']; // Mock account
    }

    [key: string]: unknown;

    // Mock request method to handle RPC calls
    async request({ method, params }) {
        console.log(`MockProvider request method called with:`, method, params);
        switch (method) {
            case 'eth_requestAccounts':
                return this.accounts;
            case 'eth_chainId':
                return this.chainId;
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    }

    // Mock enable method for compatibility with older dapps
    async enable() {
        return this.accounts;
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

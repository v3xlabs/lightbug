import { derived, get, writable } from 'svelte/store';

const MOCK_WALLETS = [
    "0x225f137127d9067788314bc7fcc1f36746a3c3B5",
    "0xd577D1322cB22eB6EAC1a008F62b18807921EFBc",
    "0x8F8f07b6D61806Ec38febd15B07528dCF2903Ae7",
]


class DeviceConnector {
    private _activeWallet = writable(0);
    private _wallets = writable<string[]>(MOCK_WALLETS);

    constructor() {
        this.init();
    }

    async init() {
        const {wallets,activeWallet} = await chrome.storage.local.get(['wallets', 'activeWallet']);
        this._wallets.set(wallets || []);
        this._activeWallet.set(activeWallet || 0);

        chrome.storage.local.onChanged.addListener((changes) => {
            if (changes.activeWallet) {
                this._activeWallet.set(changes.activeWallet.newValue);
            }

            if (changes.wallets) {
                this._wallets.set(changes.wallets.newValue);
            }
        });
    }

    public async setActiveWallet(wallet: string) {
        this._activeWallet.set(MOCK_WALLETS.indexOf(wallet));

        await chrome.storage.local.set({ activeWallet: get(this._activeWallet) });
    }

    public get activeWallet() {
        // return MOCK_WALLETS[this._activeWallet];
        return derived(this._activeWallet, ($activeWallet) => get(wallets)[$activeWallet]);
    }

    public get wallets() {
        return derived(this._wallets, ($wallets) => $wallets);
    }

    public async setMockValues() {
        await chrome.storage.local.set({ activeWallet: 0 });
        await chrome.storage.local.set({ wallets: MOCK_WALLETS });
    }
}

export const deviceConnector = new DeviceConnector();

export const wallets = deviceConnector.wallets;
export const activeWallet = deviceConnector.activeWallet;
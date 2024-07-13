import Home from './Home.svelte';
import Wallets from './Wallets.svelte';
import { wrap } from 'svelte-spa-router/wrap';

export const routes = {
    '/': Home,
    '/wallets': Wallets,
}
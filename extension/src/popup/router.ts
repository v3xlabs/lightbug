import Connect from './Connect.svelte';
import Home from './Home.svelte';
import Portfolio from './portfolio/Portfolio.svelte';
import TransactionList from './portfolio/TransactionList.svelte';
import Wallets from './Wallets.svelte';
import { wrap } from 'svelte-spa-router/wrap';

export const routes = {
    '/': Home,
    '/wallets': Wallets,
    "/connect": Connect,
    "/portfolio": Portfolio,
    "/transactions": TransactionList,
}
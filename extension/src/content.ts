import icon from '../public/icons/injected.svg';
import { LBProvider } from './content/provider';
import { announceProvider } from 'mipd';
import './content/provider';

console.log('LightBug content script loaded');

const mockProvider = new LBProvider();
const providerDetail = {
    info: {
        uuid: "e7552e29-1135-4105-a1fa-b573343821e9",
        name: "LightBug",
        icon,
        rdns: "eth.lightbug"
    },
    provider: mockProvider
};

// Announce the provider
announceProvider(providerDetail);

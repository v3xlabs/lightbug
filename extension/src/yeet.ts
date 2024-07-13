import { announceProvider } from 'mipd';
import { LBProvider } from './content/provider';
import icon from '../public/icons/injected.svg';

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

console.log('providerDetail', providerDetail);

// Announce the provider
announceProvider(providerDetail);

import { announceProvider } from 'mipd';
import { LBProvider } from './provider';
import icon from '../../public/icons/injected.svg';

const lightBugProvider = new LBProvider();
const providerDetail = {
    info: {
        uuid: "e7552e29-1135-4105-a1fa-b573343821e9",
        name: "LightBug",
        // icon,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
        rdns: "eth.lightbug"
    },
    provider: lightBugProvider
};

// Announce the provider
announceProvider(providerDetail);
export type TempProfile = { name?: string; avatar?: string; header?: string };

export const fetchENS = async (address: string): Promise<TempProfile | undefined> => {
    const key = `ens_${address}`;
    const cached: { [key: string]: TempProfile } = await chrome.storage.local.get([key]);
    if (cached[key]) {
        return cached[key];
    }

    const response = await fetch(`https://enstate.rs/a/${address}`);
    const data: TempProfile = await response.json();

    await chrome.storage.local.set({ [key]: data });
    return data;
};
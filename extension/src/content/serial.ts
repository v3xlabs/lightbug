export const getSerialDevice = async () => {
    const devices = await navigator.serial.getPorts();
    return devices;
};

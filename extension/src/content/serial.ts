export const getSerialDevice = async () => {
    const devices = await navigator.serial.requestPort();

    console.log({ devices });
};

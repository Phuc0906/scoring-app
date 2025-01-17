let btDeviceHandle = undefined;
let btSppService = undefined;
let btSppCharacteristic = undefined;

let textEncoder = new TextEncoder('utf-8');


const connectBluetoothDevice = async () => {
    try {
        const selectedDevice = await navigator.bluetooth.requestDevice({
            filters: [
                { services: [ 0xFFE0 ] }
            ]
        });
    
        btDeviceHandle = await selectedDevice.gatt.connect();
        btSppService = await btDeviceHandle.getPrimaryService(0xFFE0);
        btSppCharacteristic = await btSppService.getCharacteristic(0xFFE1);
    } catch (error) {
        console.error(error);
    }
}

const startListeningDevice = async (callback) => {
    try {
        await btSppCharacteristic.writeValueWithoutResponse(textEncoder.encode('B\n'));
    await btSppCharacteristic.startNotifications();
    btSppCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        callback(event.target.value);
    });
    } catch (error) {
        console.error(error);
    }
}

export const BluetoothRemote = {
    connectBluetoothDevice,
    startListeningDevice
};
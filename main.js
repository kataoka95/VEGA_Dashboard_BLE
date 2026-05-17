const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    title: "VEGA Dashboard (BLE)",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html');

  // BLEデバイス選択の自動化イベント
  win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    
    // マイコン側のデバイス名「VEGA_BLE_Sender」を自動探索
    const targetDevice = deviceList.find((device) => {
      return device.deviceName.includes('VEGA_BLE');
    });

    if (targetDevice) {
      callback(targetDevice.deviceId);
    } else {
      if (deviceList.length > 0) {
        callback(deviceList[0].deviceId);
      }
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
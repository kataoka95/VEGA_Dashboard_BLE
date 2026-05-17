const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // ==========================================
    // Web Bluetooth API の自動接続設定
    // ==========================================
    mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault(); // デフォルトの挙動（ポップアップを出そうとする処理）をキャンセル
        
        // 検索で見つかったデバイスの中から、マイコンの名前と一致するものを探す
        const targetDevice = deviceList.find(device => device.deviceName === 'VEGA_UI_mk3');
        
        if (targetDevice) {
            console.log("ターゲットデバイスを発見しました:", targetDevice.deviceName);
            callback(targetDevice.deviceId); // 見つけたらそのIDで接続
        } else {
            console.log("ターゲットデバイスが見つかりません...");
            callback(''); // 見つからなかったらキャンセル
        }
    });

    // Bluetoothの権限チェックを無条件で許可する設定
    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
        if (permission === 'bluetooth') return true;
        return false;
    });
    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
        if (details.deviceType === 'bluetooth') return true;
        return false;
    });

    // ダッシュボードのHTMLを読み込む
    mainWindow.loadFile('index.html');
}

// ==========================================
// Electronアプリのライフサイクル管理
// ==========================================
app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
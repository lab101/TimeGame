const { app, BrowserWindow,ipcRenderer } = require('electron');
const path = require('node:path');

const SerialButton = require('./serialButton.js');



// serialButton.connect(9600)
//   .then(() => {
//     console.log('Serial button connected');

//   })
//   .catch((error) => {
//     console.error('Error connecting to serial button:', error);
//   });

// function setupSerialPort(path) {
  
//   const port = new SerialPort({
//     path: path,
//     baudRate: 9600,
//   })
  
  
//   port.on('error', function(err) {
//     console.log('Error: ', err.message)
//   })
  
  
//   port.on('data', function (data) {
//     lastSerialDataTime = Date.now();
//     if(!serialButtonPressed){
//       serialButtonPressed = true;
//       console.log('Serial button down');

//     }

//   })
// }


// setInterval(() => {


//   if(serialButtonPressed &&  Date.now() - lastSerialDataTime > 10) {
//     serialButtonPressed = false;
//     console.log('Serial button up');
//   }
// }, 10);


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}




try {
  require('electron-reloader')(module)
} catch (_) {}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webSecurity: false,
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: false,
    allowRunningInsecureContent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();



   let serialButton = new SerialButton();
   serialButton.connect(9600)
     .then(() => {
       console.log('Serial button connected');
        serialButton.startMonitoring();
     })
     .catch((error) => {
       console.error('Error connecting to serial button:', error);
     });


  // Listen for the buttonDown event from the serial button
 serialButton.on('buttonDown', () => {
    console.log("Button down event received");
    mainWindow.webContents.send('buttonDown', true);
  }
  );
   


  // Listen for the buttonUp event from the serial button
  serialButton.eventEmitter.on('buttonDown', () => {
    console.log("Button up event received");
    mainWindow.webContents.send('buttonDown', true);
  }
  );




};




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();




  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

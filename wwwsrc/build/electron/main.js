const electron = require('electron');
const version = require('./package.json').version;
const {app, BrowserWindow, autoUpdater, session } = electron;

// auto update code
const config = require('./app.config.json');
if (config && config.autoUpdateUri) {
  autoUpdater.on('update-availabe', () => {
    console.log('update available')
  })
  autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update')
  })
  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available')
  })
  autoUpdater.on('update-downloaded', (e) => {
    console.log(e)
    alert("Install?")
      autoUpdater.quitAndInstall();
  })
  
  autoUpdater.setFeedURL(config.autoUpdateUri);
  try { autoUpdater.checkForUpdates();} catch (e) {};

}

// handle squirrel updates
if(require('./squirrel-startup')) return;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});

  session.defaultSession.allowNTLMCredentialsForDomains('*');

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  win.webContents.openDevTools();
  
  var handleRedirect = (e, url) => {
    if(url != win.webContents.getURL()) {
      e.preventDefault()
      require('electron').shell.openExternal(url)
    }
  }

  win.webContents.on('will-navigate', handleRedirect);
  win.webContents.on('new-window', handleRedirect);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
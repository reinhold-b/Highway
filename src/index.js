const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("electron-store");

const {
  fetchPreferenceScheme,
  fetchDefaultsSchema,
} = require("../static/schemes/prefScheme");
const {
  loadCurrentStreak,
  loadBarProgress,
} = require("../ui/progressBarController");

const schema = fetchPreferenceScheme();
const defaults = fetchDefaultsSchema();
const store = new Store({ defaults, schema });

// Create the current_projects array
// Fetches it from store if available else defines it []
if (store.get("current_projects")) {
  var current_projects = store.get("current_projects");
} else {
  var current_projects = [];
}

// require('update-electron-app')() --> add when app is ready to ensure update

// This function adds a new project to the store
// It gets invoked by buttons.js when the { add button } is clicked
ipcMain.handle("addProjectToStore", (event, value) => {
  current_projects.push(value);
  store.set("current_projects", current_projects);
});

// This function removes an element from the store
// It gets invoked by buttons.js by the check button in the li element
ipcMain.handle("removeElement", (event, value) => {
  if (store.has("current_projects", value)) {
    current_projects.splice(current_projects.indexOf(value), 1);
    store.set("current_projects", current_projects); //update project list
    store.delete(value);
  } else {
    //pass
  }
});

ipcMain.handle("removeInfo", (event, values) => {
  var projectName = values[0];
  var infoName = values[1];

  var projectInfo = store.get(projectName);
  projectInfo.splice(projectInfo.indexOf(infoName), 1);
  store.set(projectName, projectInfo);
  delete projectInfo;
});

//save new info to project details
ipcMain.handle("saveNewInfo", (event, values) => {
  var newInfo = values[0];
  var projectName = values[1];

  if (store.has(projectName)) {
    var tempStoreArr = store.get(projectName);
    tempStoreArr.push(newInfo);
    store.set(projectName, tempStoreArr);
  } else {
    var newProjectArr = [];
    if (newInfo) {
      newProjectArr.push(newInfo);
    }
    store.set(projectName, newProjectArr);
  }
});

//save the current progress of the progress bar
ipcMain.handle("saveBarProgress", (event, values) => {
  store.set("barProgress", values);
});

//save the current streak
ipcMain.handle("saveStreak", (event, streak) => {
  store.set("currentStreak", streak);
});

ipcMain.handle("saveClickedd", (event, clickeddName) => {
  store.set("savedClickedd", clickeddName);
});

// return info for project to { rightPanelUI.js }
ipcMain.on("getInfo", (event, projectName) => {
  event.reply("deliveryInfo", store.get(projectName));
});

ipcMain.on("getProjectInfoLength", (event, projectName) => {
  var info = store.get(projectName);
  event.reply("deliveryInfoLength", info.length);
});

ipcMain.on("getProgressInfoFromStore", (event) => {
  event.reply("progressInfoDelivery", store.get("barProgress"));
});

ipcMain.on("getStreakFromStore", (event) => {
  event.reply("streakDelivery", store.get("currentStreak"));
});

ipcMain.on("isThereSavedClickedd", (event) => {
  if (store.has("savedClickedd")) {
    event.reply("isThereSavedClickeddResponse", store.get("savedClickedd"));
  } else {
    event.reply("isThereSavedClickeddResponse", false);
  }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  let winWidth = store.get("window_size")[0]; //LOAD WINDOW WIDTH
  let winHeight = store.get("window_size")[1]; //LOAD WINDOW HEIGHT

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
    frame: false,
    width: winWidth,
    height: winHeight,
    minWidth: 500,
    minHeight: 550,
    backgroundColor: "#2f2d2e",
  });

  // and load the index.html of the app.
  const path = require("path");
  mainWindow.loadFile(path.join(__dirname, "main_win.html"));

  mainWindow.webContents.on("did-finish-load", () => {
    fresh_project_list = store.get("current_projects");

    if (fresh_project_list.length != 0) {
      mainWindow.webContents.send("fillProjectList", fresh_project_list);
    } else {
      mainWindow.webContents.send("setNoProRep");
    }
  });

  mainWindow.on("resize", () => {
    try {
      store.set("window_size", mainWindow.getSize());
    } catch {
      //pass
    }
  });

  mainWindow.on("maximize", () => {
    mainWindow.reload();
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.reload();
  });

  mainWindow.on("focus", () => {
    mainWindow.reload();
  });

  ipcMain.handle("windowAction", (event, action) => {
    if (action == "close") {
      store.delete("savedClickedd");
      mainWindow.close();
    } else if (action == "maximize") {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    } else if (action == "minimize") {
      mainWindow.minimize();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("web-contents-created", (event, contents) => {
  const URL = require("url").URL;
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin !== "main_win.html") {
      event.preventDefault();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

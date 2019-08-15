const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
const express = require("express");
var http = require("http");
const port = 3000;
// const sendkeys = require("sendkeys");
var ks = require("node-key-sender");
var fs = require("fs");
const storage = require("electron-json-storage");

var getEngine = "i",
  getPower = "u",
  getFR = "R",
  getLP = "n",
  getShieldIO = "o",
  getWeaponsIO = "p",
  getF12 = "F12",
  f11 = "F11";

let mainWindow;

function createMain() {
  mainWindow = new BrowserWindow({
    backgroundColor: "#232E44",
    resizable: false,
    maximizable: false,
    minWidth: 840,
    minHeight: 490,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

function createTouchpad(req, res) {
  const app = express();

  app.set("port", port);
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(express.static("public"));

  var server = http.createServer(app);
  var io = require("socket.io")(server);

  app.get("/", function(req, res) {
    res.render("index", {
      engine: getEngine,
      power: getPower,
      flight_ready: getFR,
      landing_pads: getLP,
      shield: getShieldIO,
      weapons: getWeaponsIO,
      f12: getF12
    });
  });

  ks.setOption("startDelayMillisec", 100);

  io.on("connection", function(socket) {
    console.log("a user connected");

    socket.on("keypressed", function(msg) {
      ks.sendKey(msg);
      // sendkeys("{" + msg + "}").then(() => console.log("success"));
    });
    socket.on("keypressedDouble", function(msg) {
      console.log("touche pressee 2 fois: " + msg);
      ks.sendKeys([msg, msg]);
    });
    // WIP, can't simulate hold atm
    socket.on("keypressedHold", function(msg) {
      console.log("touche pressee retenue: " + msg);
      ks.sendKey(msg);
    });
    socket.on("keypressedR", function(msg) {
      console.log("touche pressee retenue: " + f11);
    });
  });
  server.listen(port);
}

app.on("ready", function() {
  createMain();
  createTouchpad();
  ipcMain.on("synchronous-message", (event, arg) => {
    console.log(arg); // affiche "ping"
    event.returnValue = "pong";
  });
  /*   electronLocalshortcut.register(mainWindow, "F11", () => {
    console.log("f11 ! ");
  }); */
});

app.on("window-all-closed", function() {
  // Mac
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // Mac
  if (mainWindow === null) createMain();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

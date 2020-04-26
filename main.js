const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ejse = require("ejs-electron");
const express = require("express");
const http = require("http");
const ks = require('node-key-sender');
const port = 8000;

let mainWindow, childWindow;
ejse.data("username", "Some Guy");

function createMain() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
}
function createChild() {
  childWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
  });
}

function createTouchpad(req, res) {
  const app = express();

  app.set("port", port);
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(express.static(__dirname + "/public"));

  var server = http.createServer(app);
  var io = require("socket.io")(server);

  app.get("/", function (req, res) {
    res.render("index", {
      username: "toto",
    });
  });

  io.on("connection", function (socket) {
    console.log("a user connected");
    socket.on("press-flightRdy", function (msg) {
      ks.sendKey(msg);
    });
  });

  server.listen(port);
}

app.on("ready", () => {
  createMain();
  mainWindow.loadURL("file://" + __dirname + "/index.ejs");
  mainWindow.webContents.openDevTools();
});

app.on("window-all-closed", function () {
  // macOS
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // macOS
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on("createModal", (event, [...args]) => {
  console.log(args[0]);
  createChild();
  childWindow.loadURL("https://github.com");
  childWindow.show();
});
ipcMain.on("createPad", (event, [...args]) => {
  createTouchpad();
});

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  btnModal.onclick = function () {
    async("createModal", ["tg", "stp"]);
  };
  btnPad.onclick = function () {
    async("createPad",["tg", "stp"]);
  };

  function async(title, [...args]) {
    ipcRenderer.send(title, [...args]);
  }
});

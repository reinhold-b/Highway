var maximizeListener = true;
var minimizeListener = true;
var closeListener = true;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("maximize").addEventListener("click", () => {
    maximizeListener = false;
    ipcRenderer.invoke("windowAction", "maximize");
  });
  document.getElementById("minimize").addEventListener("click", () => {
    minimizeListener = false;
    ipcRenderer.invoke("windowAction", "minimize");
  });
  document.getElementById("close").addEventListener("click", () => {
    closeListener = false;
    ipcRenderer.invoke("windowAction", "close");
  });
});

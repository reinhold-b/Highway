function processInfoInput() {
  // Get the info from the { infoInput } (bottom-right) and pass it
  // to  - refreshInfoTable(); -  in { rightPanelUI.js }

  // COMMUNICATES WITH { index.js } --> - ipcMain.handle('saveNewInfo') -

  var newInfo = document.getElementById("infoInput").value;
  var projectName = document
    .getElementById("clickedd")
    .innerText.replace("✓", "")
    .trim();

  if (newInfo && projectName) {
    try {
      ipcRenderer.invoke("saveNewInfo", [newInfo, projectName]);
      addNewInfo(newInfo);
    } catch (e) {
      console.log(e);
    }
  }

  document.getElementById("infoInput").value = "";
}

//CREATE THE CLICK LISTENER FOR THE { INFO ADD BUTTON } (bottom right corner)

// PROCESS START POINT for newInfo action --> trace from here
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("infoAddBtn")
    .addEventListener("click", processInfoInput);
});

// ABOVE FUNCTION TRIGGERED WITH ENTER
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("infoInput")
    .addEventListener("keyup", function (event) {
      var infoInput = document.getElementById("infoInput");
      if (event.keyCode === 13 && document.activeElement === infoInput) {
        event.preventDefault();
        processInfoInput();
      }
    });
});

module.exports = {
  processInfoInput,
};

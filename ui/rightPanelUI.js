var searchButtonMode = 0; //open --> 1 = search

function buttonsAndInputs(mode) {
  var input = document.getElementById("infoInput");
  var btn = document.getElementById("infoAddBtn");
  var container = document.getElementById("infoForm");
  input.disabled = !mode;
  btn.disabled = !mode;
  if (!mode) {
    container.classList.add("disabled");
    input.classList.add("disabled");
    btn.classList.add("disabled");
  } else {
    container.classList.remove("disabled");
    input.classList.remove("disabled");
    btn.classList.remove("disabled");
  }
}

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

function searchProject(name) {
  ipcRenderer.once("queryReply", (event, responseIndex) => {
    if (responseIndex.length == 1 && responseIndex[0] >= 0) {
      forceSetClicked(responseIndex[0]);
    } else if (responseIndex.length == 1 && responseIndex[0] == -2) {
      openArchive();
    } else if (responseIndex.length > 1) {
      setBlinkFoundInSearch(responseIndex);
    } else if (responseIndex.length == 0) {
      setNotFound();
    }
  });
  ipcRenderer.send("searchProject", name);
}

function search() {
  var searchPanel = document.getElementById("searchPanel");
  if (!searchButtonMode) {
    searchPanel.style.display = "block";
    searchButtonMode = 1;
  } else if (searchButtonMode == 1 && searchPanel.value != "") {
    searchProject(searchPanel.value.toLowerCase());
    searchPanel.value = "";
    searchPanel.style.display = "none";
    searchButtonMode = 0;
  } else {
    searchPanel.style.display = "none";
    searchButtonMode = 0;
  }
}

function saveToArchiveFromProjects(projectName) {
  ipcRenderer.on("deliveryInfoA", (event, info) => {
    var date = getArchiveDate();
    if (Array.from(info).length > 0) {
      for (let ele of info) {
        var archValues = [0, ele, date];
        ipcRenderer.invoke("addToArchive", archValues);
      }
    }
  });
  ipcRenderer.send("getInfoA", projectName);
}

function openArchive() {
  var infoTable = document.getElementById("todo-info-table");
  var todoContent = document.getElementById("todo-content");

  document.getElementById("clickedd").id = "";
  setArchiveTitle();
  buttonsAndInputs(false);
  infoTable.innerHTML = "";
  removeNoTaskReplacer();
  loadArchive();
}

function loadArchive() {
  ipcRenderer.once("archiveDelivery", (event, archivedDays) => {
    var infoTable = document.getElementById("todo-info-table");
    for (let day of Object.keys(archivedDays)) {
      // SPACE
      var new_date = document.createElement("h4");
      new_date.appendChild(document.createTextNode(day.replace(/-/g, ".")));
      var new_li_date = document.createElement("li");
      new_li_date.classList.add("archiveDayTitle");
      new_li_date.appendChild(new_date);
      infoTable.appendChild(new_li_date);

      for (let element of archivedDays[day]) {
        // SPACE FOR READABILITY
        var new_li = document.createElement("li");
        new_li.classList.add("archiveElement");
        new_li.appendChild(document.createTextNode(element));
        infoTable.appendChild(new_li);
      }
    }
  });
  ipcRenderer.send("getArchive");
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
  // INFO INPUT LISTENERS
  document
    .getElementById("infoInput")
    .addEventListener("keyup", function (event) {
      var infoInput = document.getElementById("infoInput");
      if (event.keyCode === 13 && document.activeElement === infoInput) {
        event.preventDefault();
        processInfoInput();
      }
    });
  // SEARCH BUTTON LISTENER
  document.getElementById("searchButton").addEventListener("click", search);
  // SEARCH PANEL START SEARCH ON ENTER
  document
    .getElementById("searchPanel")
    .addEventListener("keyup", function (event) {
      if (event.keyCode === 13 && searchButtonMode == 1) {
        event.preventDefault();
        search();
      }
    });
  // ARCHIVE BUTTON CLICK LISTENER
  document.getElementById("archiveButton").addEventListener("click", () => {
    openArchive();
  });
});

// ABOVE FUNCTION TRIGGERED WITH ENTER

module.exports = {
  processInfoInput,
};

var setDELIVERYINFO = true;
var newListener = true;

function addNewInfo(text) {
  removeNoTaskReplacer();
  var infoTable = document.getElementById("todo-info-table");

  var new_li = document.createElement("li");
  var infoCheckbox = document.createElement("input");
  var deleteButton = document.createElement("button");
  var deleteButtonSpan = document.createElement("span");

  infoCheckbox.type = "checkbox";
  infoCheckbox.classList.add("infoListCheck");

  new_li.appendChild(infoCheckbox);
  new_li.appendChild(document.createTextNode(text));

  deleteButtonSpan.classList.add("deleteButtonSpan");
  deleteButtonSpan.classList.add("smallBin");
  deleteButton.appendChild(deleteButtonSpan);
  deleteButton.classList.add("deleteButton");

  new_li.appendChild(deleteButton);

  new_li.classList.add("info-item");
  new_li.spellcheck = false;

  infoTable.appendChild(new_li);
}

function removeOne(node) {
  var infoTable = document.getElementById("todo-info-table");
  infoTable.removeChild(node);

  loadCurrentStreak();
  if (infoTable.childNodes.length == 0) {
    setNoTaskReplacer([]);
  }
}

function refreshInfoTable() {
  // on every add --> clear the info table, get the store data and insert it

  // COMMUNICATES WITH { index.js } -->  - ipcMain.on('getInfo') -

  if (setDELIVERYINFO) {
    ipcRenderer.on("deliveryInfo", (event, info) => {
      setDELIVERYINFO = false;
      var infoTable = document.getElementById("todo-info-table");
      var todoContent = document.getElementById("todo-content");

      if (todoContent.childNodes.length > 0) {
        setInfoTitle();
      }
      loadBarProgress();
      loadCurrentStreak();
      setNoTaskReplacer(info);

      infoTable.innerHTML = "";
      if (info) {
        try {
          infoTitle.innerText = getCurrentProjectName();
        } catch {
          //pass
        }

        for (let i of info) {
          var currentInfo = i;

          var new_li = document.createElement("li");
          var infoCheckbox = document.createElement("input");
          var deleteButton = document.createElement("button");
          var deleteButtonSpan = document.createElement("span");

          infoCheckbox.type = "checkbox";
          infoCheckbox.classList.add("infoListCheck");

          new_li.appendChild(infoCheckbox);
          new_li.appendChild(document.createTextNode(currentInfo));

          deleteButtonSpan.classList.add("deleteButtonSpan");
          deleteButtonSpan.classList.add("smallBin");
          deleteButton.appendChild(deleteButtonSpan);
          deleteButton.classList.add("deleteButton");

          new_li.appendChild(deleteButton);

          new_li.classList.add("info-item");
          new_li.spellcheck = false;

          infoTable.appendChild(new_li);
        }
      } else {
        infoTitle.innerText = "";
      }
    });
  }
  try {
    var projectName = getCurrentProjectName();
    ipcRenderer.send("getInfo", projectName);
  } catch {
    //pass
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (newListener) {
    document
      .getElementById("todo-info-table")
      .addEventListener("dblclick", function (e) {
        newListener = false;
        if (e.target && e.target.matches("li.info-item")) {
          if (!e.target.childNodes[0].checked) {
            e.target.childNodes[0].checked = true;
            var values = [getCurrentProjectName(), e.target.innerText];
            ipcRenderer.invoke("removeInfo", values);

            e.target.classList.add("removingInfo");

            setTimeout(() => {
              removeOne(e.target);
            }, 450);

            setProgressFromInfo();
          }
        }
      });
    document
      .getElementById("todo-info-table")
      .addEventListener("click", function (e) {
        if (e.target && e.target.matches("button.deleteButton")) {
          var values = [getCurrentProjectName(), e.target.parentNode.innerText];
          ipcRenderer.invoke("removeInfo", values);

          e.target.parentNode.classList.add("deleteInfo");

          setTimeout(() => {
            removeOne(e.target.parentNode);
          }, 600);
        }
      });
  }
});

module.exports = {
  refreshInfoTable,
};

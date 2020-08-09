const { ipcRenderer } = require("electron");

//----------------------------NEW PROJECT BUTTON---------------------------------------

var isListener = false;

// The function reads the value of the input form and adds a new li to the project list

function addProject() {
  // listen for add project button (bottom left) and add new P to left P list

  // COMMUNICATES WITH { index.js }  - ipcMain.handle('addProjectToStore') -

  if (getNoProReplacer()) {
    removeNoProReplacer();
  }

  var projectList = document.getElementById("todo-table");
  var newProjectName = document.getElementById("newProjectInput").value.trim();

  // only add if newProjctName isnt blank
  if (newProjectName) {
    var new_li = document.createElement("li");

    ipcRenderer.invoke("addProjectToStore", newProjectName);
    ipcRenderer.invoke("saveNewInfo", [, newProjectName]);

    new_li.appendChild(document.createTextNode(newProjectName));
    // new_li.classList.add('appear');
    new_li.classList.add("todo-item");

    projectList.appendChild(new_li);

    var liBtn = document.createElement("button");
    var textSpan = document.createElement("span");
    textSpan.classList.add("smallCheck");
    liBtn.classList.add("liBtn");
    liBtn.appendChild(textSpan);
    new_li.appendChild(liBtn);
  }

  document.getElementById("newProjectInput").value = "";
}

// event listener for button click

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addBtn").addEventListener("click", addProject);
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("newProjectInput")
    .addEventListener("keyup", function (event) {
      var newProjectInput = document.getElementById("newProjectInput");
      if (event.keyCode === 13 && document.activeElement === newProjectInput) {
        event.preventDefault();
        addProject();
      }
    });
});

// remove element on check click

// COMMUNICATES WITH { ipcMain.js }  - ipcMain.handle('removeElement') -
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("todo-table").addEventListener("click", function (e) {
    if (e.target && e.target.matches("button.liBtn")) {
      e.target.parentNode.classList.add("removing"); // new class name here

      setProgressFromProjects(e.target.parentNode.innerText);

      if (getProjectList().children.length == 1) {
        setNoProjectReplacer();
      }

      var projects = Array.from(document.getElementsByClassName("todo-item"));
      var currentIndex = projects.indexOf(e.target.parentNode);

      setNewClicked(currentIndex);

      ipcRenderer.invoke(
        "removeElement",
        e.target.parentNode.innerText.replace("✓", "").trim()
      );

      setTimeout(() => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      }, 450);

      refreshInfoTable();
    }
  });
});

//add id='clickedd' to the current clicked project to get the right project details

//COMMUNICATES WITH { rightPanelUI.js }  - refreshInfoTable(); -
document.addEventListener("DOMContentLoaded", function () {
  if (!isListener) {
    document
      .getElementById("todo-table")
      .addEventListener("click", function (e) {
        isListener = true;
        if (e.target && e.target.matches("li.todo-item")) {
          if (document.getElementById("clickedd")) {
            old_clickedd = document.getElementById("clickedd");
            old_clickedd.removeAttribute("id");

            e.target.id = "clickedd";
          } else {
            e.target.id = "clickedd";
          }
          // save the current clickedd, so when you restart the app,
          // it focuses on the last watched element == clickedd
          ipcRenderer.invoke(
            "saveClickedd",
            document.getElementById("clickedd").innerText
          );

          setTimeout(() => refreshInfoTable(), 5);
        }
      });
  } else {
    //pass
  }
});

module.exports = {
  addProject,
};

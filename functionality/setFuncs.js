const NO_PRO_TEXT = "No projects yet :(";
const NO_TASK_TEXT = "You haven't added any tasks yet...";

function setNewClicked(currentIndex) {
  // when a project is deleted, there needs to b a new 'clickedd' list element

  var projectListElements = document
    .getElementById("todo-table")
    .getElementsByClassName("todo-item");

  // only find new focused element if the deleted element was focused
  if (projectListElements[currentIndex].id == "clickedd") {
    if (projectListElements.length > 1 && currentIndex != 0) {
      projectListElements[currentIndex - 1].id = "clickedd";
    } else if (projectListElements.length > 1 && currentIndex == 0) {
      projectListElements[1].id = "clickedd";
    }
  }
  if (document.getElementById("clickedd")) {
    ipcRenderer.invoke(
      "saveClickedd",
      document.getElementById("clickedd").innerText
    );
  }
  refreshInfoTable();
}

function setInfoTitle() {
  console.log(document.getElementById("todo-table").childNodes.length);
  if (getCurrentInfoTitleElement()) {
    getCurrentInfoTitleElement().innerText = getCurrentProjectName();
  } else {
    var infoTitle = document.createElement("h2");
    infoTitle.appendChild(document.createTextNode(getCurrentProjectName()));
    infoTitle.id = "infoTitle";
    document.getElementById("todo-content").prepend(infoTitle);
  }
}

// REPLACERS

function setNoProjectReplacer() {
  var leftPanel = document.getElementById("container-left-panel-content");

  var replacer = document.createElement("p");
  replacer.appendChild(document.createTextNode(NO_PRO_TEXT));
  replacer.classList.add("replacer");
  replacer.id = "noPro";
  leftPanel.insertBefore(replacer, leftPanel.childNodes[2]);
}

// this is the ipc version of the above func so the main process index.js can call this function
ipcRenderer.once("setNoProRep", (event) => {
  var leftPanel = document.getElementById("container-left-panel-content");

  var replacer = document.createElement("p");
  replacer.appendChild(document.createTextNode(NO_PRO_TEXT));
  replacer.classList.add("replacer");
  replacer.id = "noPro";
  leftPanel.insertBefore(replacer, leftPanel.childNodes[2]);

  loadCurrentStreak();
  loadBarProgress();
});

function removeNoProReplacer() {
  var replacer = document.getElementById("noPro");

  replacer.remove();
}

function setNoTaskReplacer(info) {
  if (info && Array.from(info).length == 0) {
    var todoContainer = document.getElementById("todo-content");

    var taskReplacer = document.createElement("p");
    taskReplacer.appendChild(document.createTextNode(NO_TASK_TEXT));
    taskReplacer.classList.add("taskReplacer");
    taskReplacer.id = "noTask";
    removeNoTaskReplacer();
    todoContainer.insertBefore(taskReplacer, todoContainer.childNodes[1]);
  } else {
    removeNoTaskReplacer();
  }
}

function removeNoTaskReplacer() {
  if (document.getElementById("noTask")) {
    document.getElementById("noTask").remove();
  }
}

module.exports = {
  setNewClicked,
  setInfoTitle,
  setNoProjectReplacer,
  removeNoProReplacer,
};

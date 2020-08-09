const NO_PRO_TEXT = "No projects yet :(";

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
  ipcRenderer.invoke(
    "saveClickedd",
    document.getElementById("clickedd").innerText
  );
}

function setInfoTitle() {
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

module.exports = {
  setNewClicked,
  setInfoTitle,
  setNoProjectReplacer,
  removeNoProReplacer,
};

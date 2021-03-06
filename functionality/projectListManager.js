// fill project list at start
// projectListManager receives webcontents.send from main.js

function setClickedAtOpenWindow() {
  ipcRenderer.once("isThereSavedClickeddResponse", (event, response) => {
    var projectArray = document.getElementsByClassName("todo-item");
    if (response) {
      for (let ele of projectArray) {
        if (ele.innerText == response) {
          ele.id = "clickedd";
        }
      }
    } else {
      projectArray[0].id = "clickedd";
    }
  });
  ipcRenderer.send("isThereSavedClickedd");
}

ipcRenderer.once("setDay", function () {
  var title = document.getElementById("title");
  title.title = getDay("long");
  title.innerText = `${getDay("short")}, ${getDate()}.`;
});

ipcRenderer.once("fillProjectList", function (event, arr) {
  for (let i of arr) {
    var newProjectName = i;

    var new_li = document.createElement("li");

    new_li.appendChild(document.createTextNode(newProjectName));
    new_li.setAttribute("class", "todo-item");

    document.getElementById("todo-table").appendChild(new_li);

    var liBtn = document.createElement("button");
    var textSpan = document.createElement("span");
    textSpan.classList.add("smallCheck");
    liBtn.classList.add("liBtn");
    liBtn.appendChild(textSpan);
    new_li.appendChild(liBtn);
  }
  // looks at the saved clickedd and sets it as a focused project item at window open
  setClickedAtOpenWindow();
  setTimeout(() => refreshInfoTable(), 5);
});

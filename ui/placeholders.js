// placeholders should be displayed when project or info lists are empty

const noInfoPlaceholderText = "Nothing here yet :(";

function clearRightPH() {
  var place = document.getElementById("right-panel-todo-info");

  var replacer = place.getElementsByClassName("replacer")[0];

  if (replacer) {
    place.removeChild(replacer);
  }
}

function displayRightPH() {
  var rightPanel = document.getElementById("right-panel-todo-info");

  var new_placeholder = document.createElement("p");
  new_placeholder.appendChild(document.createTextNode(noInfoPlaceholderText));
  new_placeholder.classList.add("replacer");

  rightPanel.appendChild(new_placeholder);
}

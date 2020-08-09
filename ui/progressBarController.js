//PROGRESS BAR

var setDeliveryListenerProgress = true;
var setFetchProgressListener = true;
var setFetchStreakListener = true;

function setProgressFromInfo() {
  var progressBar = document.getElementById("dailyProgress");

  if (checkIfProgressNotFull()) {
    progressBar.value += 1;
    saveCurrentBarProgress(progressBar.value);
  }
}

function setProgressFromProjects(projectName) {
  var projectName_ = projectName.replace("✓", "").trim();

  if (setDeliveryListenerProgress) {
    ipcRenderer.on("deliveryInfoLength", (event, info) => {
      setDeliveryListenerProgress = false;
      var progressBar = document.getElementById("dailyProgress");
      var barMax = getBarMaximum();

      if (progressBar.value < barMax) {
        if (progressBar.value + info < barMax) {
          progressBar.value += info;
          saveCurrentBarProgress(progressBar.value);
        } else if (progressBar.value + info >= barMax) {
          progressBar.value = barMax;
          saveCurrentBarProgress(progressBar.value);
          increaseAndSaveStreak();
        }
      }
    });
  }

  ipcRenderer.send("getProjectInfoLength", projectName_);
}

//check if the bar is full
function checkIfProgressNotFull() {
  var bar = document.getElementById("dailyProgress");
  var maxBarValue = getBarMaximum();

  if (bar.value + 1 == maxBarValue) {
    increaseAndSaveStreak();
    return true;
  } else if (bar.value < maxBarValue - 1) {
    return true;
  } else {
    return false;
  }
}

//save the progress on change
function saveCurrentBarProgress(currentProgress) {
  ipcRenderer.invoke("saveBarProgress", [currentProgress, getDateStamp()]);
}

// check the date to load the correct bar progress
function loadBarProgress() {
  if (setFetchProgressListener) {
    ipcRenderer.on("progressInfoDelivery", (event, data) => {
      setFetchProgressListener = false;

      refreshProgressBar(data);
    });
  }

  ipcRenderer.send("getProgressInfoFromStore");
}

function refreshProgressBar(data) {
  // index 0 is the saved barProgress, index 1 is the saved Validation Date

  var dailyProgress = document.getElementById("dailyProgress").value;
  var dayDifference = getDayDifference(data[1]);

  if (data[1] == getDateStamp()) {
    document.getElementById("dailyProgress").value = data[0];
  } else if (data[0] == getBarMaximum() && dayDifference == 1) {
    saveCurrentBarProgress(0);
    document.getElementById("dailyProgress").value = 0;
  } else {
    saveCurrentBarProgress(0);
    document.getElementById("dailyProgress").value = 0;
    saveCurrentStreak(0);
  }
}

//save the new streak value
function saveCurrentStreak(currentStreak) {
  ipcRenderer.invoke("saveStreak", currentStreak);
}

//load the current streak
function loadCurrentStreak() {
  if (setFetchStreakListener) {
    ipcRenderer.on("streakDelivery", (event, currentStreak) => {
      setFetchStreakListener = false;

      if (!(typeof currentStreak === "undefined")) {
        document.getElementById("streak").innerText = currentStreak;
      } else if (typeof currentStreak === "undefined") {
        document.getElementById("streak").innerText = 0;
      } else {
        document.getElementById("streak").innerText = currentStreak;
      }
    });
  }

  ipcRenderer.send("getStreakFromStore");
}

//increase the streak element, if the daily todo goal is achieved
function increaseAndSaveStreak() {
  var currentStreak = parseInt(document.getElementById("streak").innerText) + 1;
  saveCurrentStreak(currentStreak);
}

module.exports = {
  setProgressFromInfo,
  setProgressFromProjects,
  increaseAndSaveStreak,
  saveCurrentStreak,
  saveCurrentBarProgress,
  loadCurrentStreak,
  loadBarProgress,
  refreshProgressBar,
};

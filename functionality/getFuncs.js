function getCurrentProjectName() {
  //get the current clicked project name (e.g 'Maths Project')
  return document.getElementById("clickedd").innerText.replace("✓", "").trim();
}

function getCurrentInfoTitleElement() {
  return document.getElementById("infoTitle");
}

function getInfoTable() {
  return document.getElementById("todo-info-table");
}

function getProjectList() {
  return document.getElementById("todo-table");
}

function getNoProReplacer() {
  return document.getElementById("noPro");
}

function getBarMaximum() {
  return document.getElementById("dailyProgress").max;
}

// TIME DATE ....

const date = new Date();

function getDateStamp() {
  var stamp =
    String(date.getDate()) +
    String(date.getMonth()) +
    String(date.getFullYear());
  return stamp;
}

function getDayDifference(savedDate) {
  return date.getDate() - parseInt(savedDate.slice(0, 2));
}

function getDay() {
  return date.toLocaleString("en-us", { weekday: "short" });
}

// FETCH BAR DATA

// function getProgressFromStore() {
// 	var container;
// 	if (setFetchProgressListener) {
// 		ipcRenderer.on('progressInfoDelivery', (event, data) => {
// 			setFetchProgressListener = false;
// 			return data;
// 		})
// 	}

// 	ipcRenderer.send('getProgressInfoFromStore');
// }

module.exports = {
  getCurrentProjectName,
  getCurrentInfoTitleElement,
  getBarMaximum,
  getDateStamp,
  getDayDifference,
  getInfoTable,
  getProjectList,
  getNoProReplacer,
};

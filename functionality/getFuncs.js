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

const datee = new Date();

function getDateStamp() {
  var stamp =
    String(datee.getDate()) +
    String(datee.getMonth()) +
    String(datee.getFullYear());
  return stamp;
}

function getDayDifference(savedDate) {
  return datee.getDate() - parseInt(savedDate.slice(0, 2));
}

function getDay(length) {
  return datee.toLocaleString(navigator.language, { weekday: length });
}

function getDate() {
  return datee.getDate();
}

function getArchiveDate() {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  };
  return datee
    .toLocaleDateString(navigator.language, options)
    .replace(/\./g, "-");
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
  getArchiveDate,
};

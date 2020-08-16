const { getDateStamp } = require("../../functionality/getFuncs");

function fetchPreferenceScheme() {
  const scheme = {
    currentStreak: {
      type: "number",
      default: 0,
    },
    currentProjects: {
      type: ["array", "string"],
    },
    window_size: {
      type: ["array", "integer"],
      maxItems: 2,
    },
    barProgress: {
      type: "array",
      maxItems: 2,
    },
  };
  return scheme;
}

function fetchDefaultsSchema() {
  const defaults = {
    window_size: [800, 600],
    currentStreak: 0,
    barProgress: [0, "hihihaha"],
    current_projects: ["Hi there :)"],
    "Hi there :)": [
      "Welcome to Highway!",
      "Highway is a lightweight todo app, which makes it super easy to organize your tasks and get them done without any annoying stuff interrupting your workflow. ",
      "To create a new project, type in a name for it in the New Project field and click the plus button next to it or press ENTER.",
      "To add todo items to your project, navigate to the bottom right corner and enter a name for your new task in the New Task field and click the Add Button or press ENTER.",
      "If you have finished a task, doubleclick it to mark it as finished! If you want to delete your task, click the bin icon next to it. You can mark whole projects as finished by clicking the check next to the project.",
      "Finished tasks will be stored in the archive and deleted after one month.",
      "If you manage to complete five tasks a day, your productivity-speed will rise. You can see you current productivity-speed in the top right corner if you scroll up.",
      "Try to complete five tasks each day to keep your productivity-speed, otherwise you will lose it :(",
      "You can use the search button in the top right to search for projects or tasks!",
      "Mark this project as finished to get on the Highway and start getting things DONE ! <3",
    ],
  };
  return defaults;
}

function fetchADefaults() {
  const ADefaults = {
    initDayDiff: 0,
    archivedDays: {},
  };
  return ADefaults;
}

module.exports = {
  fetchPreferenceScheme,
  fetchDefaultsSchema,
  fetchADefaults,
};

import TaskList from "./taskList.js";
import TaskItem from "./taskItem.js";
import { actionsDivAssembled, contentDivAssembled, settingsDivAssembled, taskDivAssembled } from "./buildList.js"
import { deleteContents, filterTaskList } from "./helperFunctions.js";
import { getRandomEncouragement, encouragementList } from './encouragement.js';


const taskList = new TaskList();
let currentFilter = "pending";

// Launch app
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  //Event listeners
  const itemEntryForm = document.getElementById("itemEntryForm");
  itemEntryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    processSubmission();
  });

  //Event listener clear all tasks
  const clearTasks = document.getElementById("clearTasksButton");
  clearTasks.addEventListener("click", (event) => {
    const list = taskList.getTaskList();
    if (list.length > 0) {
      const confirmed = confirm("Are you sure you want to clear the entire list?");
      if (confirmed) {
        taskList.clearList();
        updatePersistentData(taskList.getTaskList());
        refreshThePage();
      } else {
        clearTasks.blur();
      }
    } else {
      alert("There are no tasks to clear.");
      clearTasks.blur();
    }
  });
  filterButtonsEventListener();
  // Procedural functions
  loadTaskListObject();
  refreshThePage();
};

const loadTaskListObject = () => {
  const storedList = localStorage.getItem("taskList");
  if (typeof storedList !== "string") {
    return;
  }
  const parsedList = JSON.parse(storedList);
  parsedList.forEach(itemObj => {
    const newTaskItem = createNewTask(itemObj._id, itemObj._taskContent, itemObj._status);
    taskList.addTaskToList(newTaskItem);
  });
};

const refreshThePage = () => {
  clearTaskListDisplay();
  renderTaskList();
  clearEntryField();
  setFocusOnEntryField();
  countCompletedTask();
};

const clearTaskListDisplay = () => {
  const taskListParentEl = document.getElementById("taskList");
  deleteContents(taskListParentEl);
};


const renderTaskList = () => {
  const list = taskList.getTaskList();
  const filteredList = filterTaskList(list, currentFilter);
  filteredList.forEach((task) => {
    buildListItem(task);
  });
};

const buildListItem = (task) => {
  /* ---------- Building DOM  ---------- */

  const { actionsDiv, checkBox } = actionsDivAssembled(task);
  const { contentDiv, textBoxInput } = contentDivAssembled(task);
  const { taskMenuUL, settingsDiv, taskMenuIcon } = settingsDivAssembled(task);


  //.draggableContainer
  const draggableContainerDiv = document.createElement("div");
  draggableContainerDiv.className = "draggableContainer";
  draggableContainerDiv.setAttribute('data-index', task.getId());

  //.task
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.setAttribute("draggable", "true");

  //Append to .task
  taskDiv.appendChild(actionsDiv);
  taskDiv.appendChild(contentDiv);
  taskDiv.appendChild(settingsDiv);

  //Append to .dataIndex
  draggableContainerDiv.appendChild(taskDiv);

  //Append to Task List
  const taskListContainer = document.getElementById("taskList");
  taskListContainer.appendChild(draggableContainerDiv);

  //Event Listeners
  addClickListenerToDraggable(taskDiv, draggableContainerDiv);
  addClickListenerToCheckbox(checkBox, textBoxInput);
  addClickListenerToTaskIcon(taskMenuIcon);
  addClickListenerToDeleteLi(taskMenuUL, textBoxInput);
  addClickListenerToEditLi(taskMenuUL, textBoxInput, taskDiv);

};

const updatePersistentData = (listArray) => {
  localStorage.setItem("taskList", JSON.stringify(listArray));
}

const clearEntryField = () => {
  document.getElementById("taskInput").value = "";
};


const setFocusOnEntryField = () => {
  document.getElementById("taskInput").focus();
};

const processSubmission = () => {
  const userEntryText = getNewEntry();
  if (!userEntryText.length) {
    alert("Please insert new task.")
    return;
  }
  activeTaskList();
  const nextTaskId = calcNextTaskId();
  const taskItem = createNewTask(nextTaskId, userEntryText, "pending");
  taskList.addTaskToList(taskItem);
  updatePersistentData(taskList.getTaskList());
  refreshThePage();
};


const getNewEntry = () => {
  return document.getElementById("taskInput").value.trim();
};

const calcNextTaskId = () => {
  let nextTaskId = 1;
  const list = taskList.getTaskList();
  if (list.length > 0) {
    nextTaskId = list[list.length - 1].getId() + 1;
  }
  return nextTaskId;
};

const createNewTask = (taskId, taskText, taskStatus) => {
  const task = new TaskItem();
  task.setId(taskId);
  task.setTaskContent(taskText);
  task.setStatus(taskStatus);
  return task;
};

/* ---------- Event Listeners ---------- */

const filterButtonsEventListener = () => {
  const filterButtons = document.querySelectorAll(".filterButton");
  filterButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      filterButtons.forEach(button => button.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.id;
      refreshThePage();
    });
  });
};



const addClickListenerToCheckbox = (checkBox, textBoxInput) => {

  const checkedId = textBoxInput.id;
  const list = taskList.getTaskList();
  const taskObj = list.find(task => task.getId() == checkedId);

  checkBox.addEventListener("click", (event) => {
    if (event.target.checked) {
      textBoxInput.classList.add("checked");
      taskObj.setStatus("completed");
      updatePersistentData(taskList.getTaskList());

      setTimeout(() => {
        refreshThePage();
      }, 500);
    } else {
      textBoxInput.classList.remove("checked");
      taskObj.setStatus("pending");
      updatePersistentData(taskList.getTaskList());

      setTimeout(() => {
        refreshThePage();
      }, 500);
    }
  });
};




const addClickListenerToTaskIcon = (taskMenuIcon) => {
  taskMenuIcon.addEventListener("click", (event) => {

    event.stopPropagation(); // prevent immediate close from document click

    const taskMenuUL = taskMenuIcon.nextElementSibling;
    if (!taskMenuUL) {
      return;
    };

    // Toggle the 'show' class
    taskMenuUL.classList.toggle("show");

    // Remove listeners if menu is closed
    if (!taskMenuUL.classList.contains("show")) {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
      return;
    }

    // Add listeners to close the menu
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);

    function handleClick(event) {
      if (!taskMenuUL.contains(event.target) && event.target !== taskMenuIcon) {
        taskMenuUL.classList.remove("show");
        document.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleEscape);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        taskMenuUL.classList.remove("show");
        document.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleEscape);
      }
    }
  });
};


const addClickListenerToDeleteLi = (taskMenuUL, textBoxInput) => {
  const deleteLiElement = taskMenuUL.lastElementChild;
  deleteLiElement.addEventListener("click", (event) => {
    taskList.removeTaskFromList(textBoxInput.id);
    updatePersistentData(taskList.getTaskList());
    refreshThePage();
  })
};


const addClickListenerToEditLi = (taskMenuUL, textBoxInput, taskDiv) => {
  const editLiElement = taskMenuUL.firstElementChild;
  editLiElement.addEventListener("click", (event) => {
    textBoxInput.removeAttribute("readonly");
    textBoxInput.focus();
    taskDiv.classList.add('focusEdit');

    taskMenuUL.classList.remove("show");
  });

  textBoxInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      textBoxInput.setAttribute("readonly", "readonly");
      taskDiv.classList.remove('focusEdit');

    }

    if (textBoxInput.readOnly) {
      const updatedTask = textBoxInput.value;
      const taskId = textBoxInput.id;
      const list = taskList.getTaskList();
      const taskObj = list.find(task => task.getId() == taskId);
      taskObj.setTaskContent(updatedTask);
      updatePersistentData(taskList.getTaskList());
    }
  });
};

/* ---------- Add Draggable functionality ---------- */

let dragStartId;
let dragStartIndex;

const addClickListenerToDraggable = (taskDiv, draggableContainerDiv) => {
  taskDiv.addEventListener('dragstart', dragStart);
  draggableContainerDiv.addEventListener('dragover', dragOver);
  draggableContainerDiv.addEventListener('drop', dragDrop);
  draggableContainerDiv.addEventListener('dragenter', dragEnter);
  draggableContainerDiv.addEventListener('dragleave', dragLeave);
};


const dragStart = (event) => {
  dragStartId = +event.target.closest('.draggableContainer').getAttribute('data-index');
  dragStartIndex = findTaskIndex(dragStartId);
};

const dragEnter = (event) => {
  event.currentTarget.firstElementChild.classList.add('over');
  event.currentTarget.querySelector('input[type="text"]').classList.add('over');
};

const dragLeave = (event) => {
  event.currentTarget.firstElementChild.classList.remove('over');
  event.currentTarget.querySelector('input[type="text"]').classList.remove('over');
};

const dragOver = (event) => {
  event.preventDefault();
  event.currentTarget.firstElementChild.classList.add('over');
  event.currentTarget.querySelector('input[type="text"]').classList.add('over');
};

const dragDrop = (event) => {
  let dragEndId = +event.currentTarget.getAttribute('data-index');
  let dragEndIndex = findTaskIndex(dragEndId);
  swapIndex(dragStartIndex, dragEndIndex);
  event.currentTarget.firstElementChild.classList.remove('over');
  event.currentTarget.querySelector('input[type="text"]').classList.remove('over');
};

const swapIndex = (fromIndex, toIndex) => {
  const list = taskList.getTaskList();
  const temp = list[fromIndex];
  list[fromIndex] = list[toIndex];
  list[toIndex] = temp;
  updatePersistentData(list);
  refreshThePage();
};

const findTaskIndex = (taskId) => {
  const list = taskList.getTaskList();
  const index = list.findIndex(task => task.getId() === taskId);
  return index;
}


/* ---------- Progress Bar functionality  ---------- */

const countCompletedTask = () => {
  const list = taskList.getTaskList();
  const totalTasks = list.length;
  const completedTasks = list.filter(task => task.getStatus() === "completed").length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;


  if (progress === 0) {
    document.getElementById("encouragement").innerText = "Lets get started!";
  }
  else if (progress > 0 && progress < 100) {
    document.getElementById("encouragement").innerText = getRandomEncouragement(encouragementList);
  } else {
    document.getElementById("encouragement").innerText = "Great job you did it!";
  }

  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${progress}%`;
  document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;

}

/* ---------- Helper function  ---------- */

const activeTaskList = () => {
  currentFilter = "pending";
  const filterButtons = document.querySelectorAll(".filterButton");
  filterButtons.forEach(button => button.classList.remove("active"));
  document.getElementById("pending").classList.add("active");
}

import TaskList from "./taskList.js";
import TaskItem from "./taskItem.js";

const taskList = new TaskList();

// Launch app
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  //Event listeners Add task
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
      }
    } else {
      alert("There are no tasks to clear.");
    }
  });

  // Procedural functions
  loadTaskListObject();
  refreshThePage();
};

const loadTaskListObject = () => {
  const storedList = localStorage.getItem("taskList");
  if (typeof storedList !== "string") {
    return; //If there is no stored list return
  }
  const parsedList = JSON.parse(storedList);
  parsedList.forEach(itemObj => {
    const newTaskItem = createNewTask(itemObj._id, itemObj._taskContent);
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

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }

};

const renderTaskList = () => {
  const list = taskList.getTaskList();
  list.forEach((task) => {
    buildListItem(task);
  });
  console.log("Current task list:", list); //TODO: Remove console log using log to check output list.

};

const buildListItem = (task) => {
  /* ---------- Building DOM  ---------- */


  //.draggableContainer
  const draggableContainerDiv = document.createElement("div");
  draggableContainerDiv.className = "draggableContainer";
  draggableContainerDiv.setAttribute('data-index', task.getId());

  //.task
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.setAttribute("draggable", "true");

  //Add event listener to draggable
  addClickListenerToDraggable(taskDiv, draggableContainerDiv);

  //.actions
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "actions";

  //bars Icon
  const barsIcon = document.createElement("i");
  barsIcon.classList.add("fa-solid", "fa-bars");
  barsIcon.setAttribute("aria-label", "Drag and drop icon");

  //CheckBox Label
  const checkBoxLabel = document.createElement("label");
  checkBoxLabel.htmlFor = "checkBox-" + task.getId();
  checkBoxLabel.className = "visually-hidden";
  checkBoxLabel.textContent = "Check Box";

  //Checkbox
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = "checkBox-" + task.getId();
  checkBox.tabIndex = 0;


  //append to .actions
  actionsDiv.appendChild(barsIcon);
  actionsDiv.appendChild(checkBoxLabel);
  actionsDiv.appendChild(checkBox);

  //.content
  const contentDiv = document.createElement("div");
  contentDiv.className = "content";

  //textBox Label
  const textBoxLabel = document.createElement("label");
  textBoxLabel.htmlFor = task.getId();
  textBoxLabel.className = "visually-hidden";
  textBoxLabel.textContent = "Text Box Description";

  //textBox Input
  const textBoxInput = document.createElement("input");
  textBoxInput.type = "text";
  textBoxInput.id = task.getId();
  textBoxInput.className = "text";
  textBoxInput.value = task.getTaskContent();
  textBoxInput.readOnly = true;
  textBoxInput.tabIndex = 0;

  // Add event listener to checkbox and textBoxInput 
  addClickListenerToCheckbox(checkBox, textBoxInput);

  //Append to .contents
  contentDiv.appendChild(textBoxLabel);
  contentDiv.appendChild(textBoxInput);

  //.settings
  const settingsDiv = document.createElement("div");
  settingsDiv.className = "settings";

  //Task Menu Icon
  const taskMenuIcon = document.createElement("i");
  taskMenuIcon.classList.add("fa-solid", "fa-ellipsis");
  taskMenuIcon.setAttribute("aria-label", "Settings Menu");
  addClickListenerToTaskIcon(taskMenuIcon);

  //Create Ul
  const taskMenuUL = document.createElement("ul");
  taskMenuUL.className = "task-menu";

  // Create Edit List Element item
  const editLiElement = document.createElement("li");

  //Edit Icon
  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pencil");
  editIcon.setAttribute("aria-label", "Edit Icon");

  //Append to List Element
  editLiElement.appendChild(editIcon);
  editLiElement.appendChild(document.createTextNode("Edit"));

  // Create Edit List Element item
  const deleteLiElement = document.createElement("li");

  //Delete Icon
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  deleteIcon.setAttribute("aria-label", "Delete Icon");


  //Append to List Element
  deleteLiElement.appendChild(deleteIcon);
  deleteLiElement.appendChild(document.createTextNode("Delete"));

  // Append to ul and .settings
  taskMenuUL.appendChild(editLiElement);
  taskMenuUL.appendChild(deleteLiElement);
  settingsDiv.appendChild(taskMenuIcon);
  settingsDiv.appendChild(taskMenuUL);

  //Add Event Listeners
  addClickListenerToDeleteLi(taskMenuUL, textBoxInput);
  addClickListenerToEditLi(taskMenuUL, textBoxInput);

  //Append to .task
  taskDiv.appendChild(actionsDiv);
  taskDiv.appendChild(contentDiv);
  taskDiv.appendChild(settingsDiv);

  //Append to .dataIndex
  draggableContainerDiv.appendChild(taskDiv);

  //Append to Task List
  const taskListContainer = document.getElementById("taskList");
  taskListContainer.appendChild(draggableContainerDiv);

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
  const nextTaskId = calcNextTaskId();
  const taskItem = createNewTask(nextTaskId, userEntryText);
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

const createNewTask = (taskId, taskText) => {
  const task = new TaskItem();
  task.setId(taskId);
  task.setTaskContent(taskText);
  return task;
};



/* ---------- Event Listeners ---------- */


const addClickListenerToCheckbox = (checkBox, textBoxInput) => {

  const checkedId = textBoxInput.id;
  const list = taskList.getTaskList();
  const taskObj = list.find(task => task.getId() == checkedId);

  checkBox.addEventListener("click", (event) => {
    if (event.target.checked) {
      textBoxInput.classList.add("checked");
      taskObj.setStatus("completed");
      updatePersistentData(taskList.getTaskList());
      countCompletedTask();
    } else {
      textBoxInput.classList.remove("checked");
      taskObj.setStatus("pending");
      updatePersistentData(taskList.getTaskList());
      countCompletedTask();
    }
  });
};

const countCompletedTask = () => {
  const list = taskList.getTaskList();
  const totalTasks = list.length;
  const completedTasks = list.filter(task => task.getStatus() === "completed").length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${progress}%`;
  document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;
}



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


const addClickListenerToEditLi = (taskMenuUL, textBoxInput) => {
  const editLiElement = taskMenuUL.firstElementChild;
  editLiElement.addEventListener("click", (event) => {
    textBoxInput.removeAttribute("readonly");
    taskMenuUL.classList.remove("show");
  });

  textBoxInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      textBoxInput.setAttribute("readonly", "readonly");
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
};

const dragLeave = (event) => {
  event.currentTarget.firstElementChild.classList.remove('over');
};

const dragOver = (event) => {
  event.preventDefault();
};

const dragDrop = (event) => {
  let dragEndId = +event.currentTarget.getAttribute('data-index');
  let dragEndIndex = findTaskIndex(dragEndId);
  swapIndex(dragStartIndex, dragEndIndex);
  event.currentTarget.firstElementChild.classList.remove('over');
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

//TODO: Create functions for progress Bar functionality

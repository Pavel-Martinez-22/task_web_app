
//Assemble actionsDive and return actionsDiv and checkBox
export const actionsDivAssembled = (task) => {
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
  checkBox.checked = task.getStatus() === "completed";

  //append to .actions
  actionsDiv.appendChild(barsIcon);
  actionsDiv.appendChild(checkBoxLabel);
  actionsDiv.appendChild(checkBox);

  return { actionsDiv, checkBox };
}

export const contentDivAssembled = (task) => {
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

  textBoxInput.value = task.getTaskContent();
  textBoxInput.readOnly = true;
  textBoxInput.tabIndex = 0;
  if (task.getStatus() === "completed") {
    textBoxInput.classList.add("text", "checked");
  } else {
    textBoxInput.className = "text";
  }

  //Append to .contents
  contentDiv.appendChild(textBoxLabel);
  contentDiv.appendChild(textBoxInput);

  return { contentDiv, textBoxInput };
}

export const settingsDivAssembled = (task) => {

  //.settings
  const settingsDiv = document.createElement("div");
  settingsDiv.className = "settings";

  //Task Menu Icon
  const taskMenuIcon = document.createElement("i");
  taskMenuIcon.classList.add("fa-solid", "fa-ellipsis");
  taskMenuIcon.setAttribute("aria-label", "Settings Menu");


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

  return { taskMenuUL, settingsDiv, taskMenuIcon };
}

export const taskDivAssembled = (task) => {
  const { actionsDiv } = actionsDivAssembled(task);
  const { contentDiv } = contentDivAssembled(task);
  const { settingsDiv } = settingsDivAssembled(task);


  //.task
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.setAttribute("draggable", "true");

  //Append to .task
  taskDiv.appendChild(actionsDiv);
  taskDiv.appendChild(contentDiv);
  taskDiv.appendChild(settingsDiv);

  return taskDiv;
}


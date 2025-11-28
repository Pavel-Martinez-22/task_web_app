//Pass in the parents element, then remove the last child while there is a child
export const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};


//If pending is identical to pending return all pending task else return completed tasks.
export const filterTaskList = (list, currentFilter) => {
  const pendingTasks = list.filter(task => task.getStatus() === "pending");
  const completedTasks = list.filter(task => task.getStatus() === "completed");
  const filteredList = currentFilter === "pending" ? pendingTasks : completedTasks;
  return filteredList;
};

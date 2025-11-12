export default class TaskList {
  constructor() {
    this._list = [];
  }

  getTaskList() {
    return this._list;
  }

  clearList() {
    this._list = [];
  }

  addTaskToList(taskObj) {
    this._list.push(taskObj);
  }

  removeTaskFromList(id) {
    const list = this._list;
    for (let i = 0; i < list.length; i++) {
      if (list[i]._id == id) {
        list.splice(i, 1);
        break;
      }
    }
  }
}
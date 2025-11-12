export default class TaskItem {
  constructor() {
    this._id = null;
    this._taskContent = null;
  }

  getId() {
    return this._id;
  }

  setId(id) {
    this._id = id;
  }

  getTaskContent() {
    return this._taskContent;
  }

  setTaskContent(taskContent) {
    this._taskContent = taskContent;
  }
}
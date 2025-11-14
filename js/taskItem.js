export default class TaskItem {
  constructor() {
    this._id = null;
    this._taskContent = null;
    this._status = null;
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

  getStatus() {
    return this._status;
  }

  setStatus(status) {
    this._status = status;
  }
}
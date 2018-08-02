import { observable } from 'mobx';
import { autoserialize } from 'cerialize';

export class TodoModel {
  @autoserialize readonly id: number;
  @observable @autoserialize public text: string;
  @observable @autoserialize public completed: boolean;

  constructor(text: string, completed: boolean = false) {
    this.id = TodoModel.generateId();
    this.text = text;
    this.completed = completed;
  }

  static nextId = 1;
  static generateId() {
    return this.nextId++;
  }
}

export default TodoModel;

import { observable } from 'mobx';
import { createModelSchema, primitive, reference, list, object, identifier, serialize, deserialize, getDefaultModelSchema, serializable, alias } from 'serializr';

class TodoModelBase {
  @serializable(alias('_id'))
  readonly id: number;

  constructor() {
    this.id = TodoModelBase.generateId();
  }

  static nextId = 1;
  static generateId() {
    return this.nextId++;
  }
}

export class TodoModel extends TodoModelBase {
  @observable
  @serializable
  public text: string;
  
  @observable
  @serializable
  public completed: boolean;

  constructor(text: string, completed: boolean = false) {
    super();
    this.text = text;
    this.completed = completed;
  }
}

export default TodoModel;

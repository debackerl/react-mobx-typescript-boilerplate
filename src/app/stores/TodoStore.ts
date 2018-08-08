import { observable, computed, action } from 'mobx';
import { createModelSchema, primitive, reference, list, object, identifier, serialize, deserialize, getDefaultModelSchema, serializable, alias } from 'serializr';
import { TodoModel } from 'app/models';

export class TodoStore {
  constructor() {
    this.todos = [];
  }

  @observable
  @serializable(list(object(TodoModel)))
  public todos: Array<TodoModel>;

  @computed
  get activeTodos() {
    return this.todos.filter((todo) => !todo.completed);
  }

  @computed
  get completedTodos() {
    return this.todos.filter((todo) => todo.completed);
  }

  @action
  addTodo = (item: Partial<TodoModel>): void => {
    this.todos.push(new TodoModel(item.text, item.completed));
  };

  @action
  editTodo = (id: number, data: Partial<TodoModel>): void => {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        if (typeof data.completed == 'boolean') {
          todo.completed = data.completed;
        }
        if (typeof data.text == 'string') {
          todo.text = data.text;
        }
      }
      return todo;
    });
  };

  @action
  deleteTodo = (id: number): void => {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  };

  @action
  completeAll = (): void => {
    this.todos = this.todos.map((todo) => ({ ...todo, completed: true }));
  };

  @action
  clearCompleted = (): void => {
    this.todos = this.todos.filter((todo) => !todo.completed);
  };
}

export default TodoStore;

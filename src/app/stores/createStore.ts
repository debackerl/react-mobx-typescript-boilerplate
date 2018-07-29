import { History } from 'history';
import { TodoModel } from 'app/models';
import { AppStore } from './AppStore';
import { TodoStore } from './TodoStore';
import { RouterStore } from './RouterStore';
import { STORE_APP, STORE_TODO, STORE_ROUTER } from 'app/constants';

export function createStores(history: History, defaultTodos?: TodoModel[]) {
  return {
    [STORE_APP]: new AppStore(),
    [STORE_TODO]: new TodoStore(defaultTodos),
    [STORE_ROUTER]: new RouterStore(history)
  };
}

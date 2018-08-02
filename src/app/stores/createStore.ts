import { History } from 'history';
import { Deserialize } from 'cerialize';
import { AppStore } from './AppStore';
import { TodoStore } from './TodoStore';
import { RouterStore } from './RouterStore';
import { STORE_APP, STORE_TODO, STORE_ROUTER } from 'app/constants';

export function createStores(history: History, initialState?: any) {
  return {
    [STORE_APP]: new AppStore(),
    [STORE_TODO]: initialState ? Deserialize(initialState[STORE_TODO], TodoStore) as TodoStore : new TodoStore(),
    [STORE_ROUTER]: new RouterStore(history)
  };
}

// Script first executed in browser, containing initialization code

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { TodoModel } from 'app/models';
import { createStores } from 'app/stores';
import { App } from 'app';

// enable MobX strict mode
useStrict(true);

// default fixtures for TodoStore
const defaultTodos = [
  new TodoModel('Use Mobx'),
  new TodoModel('Use React', true)
];

// prepare MobX stores
const history = createBrowserHistory();
const rootStore = createStores(history, defaultTodos);

// render react DOM
ReactDOM.render(
  // Provider put a reference to each 'store' in the React context,
  // any component can use it by using @inject
  <Provider {...rootStore}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
);
